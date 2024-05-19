const dbPromise = require("../database");
const catchAsync = require("../util/catchAsync");
const ExpressError = require("../util/exressError");

const addSleepRecord = catchAsync(async (req, res) => {
  const { userId, hours, timestamp } = req.body;
  if (!userId || !hours || !timestamp) {
    throw new ExpressError(
      "Missing required fields: userId, hours, and timestamp.",
      400
    );
  }
  const db = await dbPromise;
  await db.run(
    "INSERT INTO sleep (userId, hours, timestamp) VALUES (?, ?, ?)",
    userId,
    hours,
    timestamp
  );
  res.status(201).json({ message: "Sleep record added successfully." });
});

const getSleepRecords = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const db = await dbPromise;
  const response = await db.all(
    "SELECT * FROM sleep WHERE userId = ? ORDER BY timestamp",
    [userId]
  );
  
  if (response.length === 0) {
    throw new ExpressError("No sleep records found for the given user.", 404);
  }

  res.json({
    message: "Sleep records retrieved successfully.",
    records: response,
  });
});

const deleteSleepRecord = catchAsync(async (req, res) => {
  const recordId = req.params.recordId;
  const db = await dbPromise;
  const response = await db.run("DELETE FROM sleep WHERE id = ?", [recordId]);
 
  if (response.changes === 0) {
    throw new ExpressError("Sleep record not found.", 404);
  }
  
  return res.status(200).json({
    message: "Sleep record deleted successfully.",
    deletedRecordId: recordId,
  });
});

module.exports = { addSleepRecord, getSleepRecords, deleteSleepRecord };
