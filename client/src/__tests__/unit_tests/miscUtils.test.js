import { getDateRange } from "../../utils/miscUtils";

describe("getDateRange", () => {
  it('should return today\'s date range for "Today"', () => {
    const { startDate, endDate } = getDateRange("today");
    const mockStartDate = new Date();
    mockStartDate.setHours(0, 0, 0, 0);
    const mockEndDate = new Date();

    expect(startDate).toEqual(mockStartDate);
    expect(endDate).toEqual(mockEndDate);
  });

  it('should return yesterday\'s date range for "Yesterday"', () => {
    const { startDate, endDate } = getDateRange("yesterday");
    const mockStartDate = new Date();
    mockStartDate.setDate(mockStartDate.getDate() - 1);
    mockStartDate.setHours(0, 0, 0, 0);
    const mockEndDate = new Date(mockStartDate);
    mockEndDate.setHours(23, 59, 59, 999);

    expect(startDate).toEqual(mockStartDate);
    expect(endDate).toEqual(mockEndDate);
  });

  it('should return custom range for "Custom Range" with valid dates', () => {
    const customStartDate = "2024-01-01";
    const customEndDate = "2024-01-31";
    const { startDate, endDate } = getDateRange(
      "custom",
      customStartDate,
      customEndDate
    );
    const mockStartDate = new Date(customStartDate);
    mockStartDate.setHours(0, 0, 0, 0);
    const mockEndDate = new Date(customEndDate);
    mockEndDate.setHours(23, 59, 59, 999);

    expect(startDate).toEqual(mockStartDate);
    expect(endDate).toEqual(mockEndDate);
  });

  it('should return null for start and end date for "Custom Range" with invalid dates', () => {
    const { startDate, endDate } = getDateRange("custom", null, null);
    expect(startDate).toBeNull();
    expect(endDate).toBeNull();
  });

  it("should return null for start and end date for an unknown range", () => {
    const { startDate, endDate } = getDateRange("Unknown Range");
    expect(startDate).toBeNull();
    expect(endDate).toBeNull();
  });
});
