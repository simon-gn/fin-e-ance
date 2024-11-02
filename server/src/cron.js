const cron = require("node-cron");
const RefreshToken = require("./models/RefreshToken");
const moment = require("moment");

exports.startCronJob = async () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily cleanup of expired and revoked refresh tokens");
    try {
      const now = moment().toDate();

      const result = await RefreshToken.deleteMany({
        $or: [{ expiresAt: { $lte: now } }, { revoked: true }],
      });

      console.log(
        `Deleted ${result.deletedCount} expired or revoked refresh tokens.`,
      );
    } catch (error) {
      console.error("Error during refresh token cleanup:", error);
    }
  });
};
