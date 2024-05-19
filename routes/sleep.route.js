const express = require("express");
const router = express.Router();
const { addSleepRecord, getSleepRecords, deleteSleepRecord } = require("../controllers/sleep.controller.js");

router.post('/sleep', addSleepRecord);
router.get('/sleep/:userId', getSleepRecords);
router.delete('/sleep/:recordId', deleteSleepRecord);

module.exports = router;