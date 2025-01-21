const express = require("express");
const TaskHistoryController = require("../controllers/v1/TaskHistoryController");

const router = express.Router();

// Route for getting task history with filters
router.post("/", TaskHistoryController.getTaskHistory);

// Route for getting specific task by ID
router.get("/:taskId", TaskHistoryController.getTaskHistoryById);

module.exports = router;
