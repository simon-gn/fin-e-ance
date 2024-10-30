const cron = require('node-cron');
const RefreshToken = require('../../models/RefreshToken');
const { startCronJob } = require('../../cron');
const moment = require('moment');

jest.mock('node-cron', () => ({
    schedule: jest.fn()
}));
jest.mock('../../models/RefreshToken', () => ({
    deleteMany: jest.fn(),
}));
jest.mock('moment')

describe('startCronJob', () => {
    let consoleErrorMock, consoleLogMock, mockDate;

    beforeEach(() => {
        mockDate = new Date(Date.now());
        moment.mockReturnValue({
            toDate: jest.fn().mockReturnValue(mockDate)
        });
        
        cron.schedule.mockImplementation((_, job) => job());

        consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => {});
        consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleLogMock.mockRestore();
        consoleErrorMock.mockRestore();
        jest.clearAllMocks();
    })
    
    it('should start a daily schedule to delete expired and revoked tokens', async () => {
        const mockDeletedCount = 5;

        RefreshToken.deleteMany.mockResolvedValue({ deletedCount: mockDeletedCount });

        await startCronJob();

        expect(consoleLogMock).toHaveBeenCalledWith('Running daily cleanup of expired and revoked refresh tokens');
        expect(cron.schedule).toHaveBeenCalledWith('0 0 * * *', expect.any(Function));
        expect(RefreshToken.deleteMany).toHaveBeenCalledWith({
            $or: [
                { expiresAt: { $lte: mockDate } },
                { revoked: true },
            ]
        });
        expect(consoleLogMock).toHaveBeenCalledWith(`Deleted ${mockDeletedCount} expired or revoked refresh tokens.`);
    });

    it('should handle errors during deletion', async () => {
        const error = new Error('Database error');
        
        RefreshToken.deleteMany.mockRejectedValue(error);

        await startCronJob();

        expect(cron.schedule).toHaveBeenCalledWith('0 0 * * *', expect.any(Function));
        expect(consoleLogMock).toHaveBeenCalledWith('Running daily cleanup of expired and revoked refresh tokens');
        expect(RefreshToken.deleteMany).toHaveBeenCalled();
        expect(consoleErrorMock).toHaveBeenCalledWith('Error during refresh token cleanup:', error);
    });
});
