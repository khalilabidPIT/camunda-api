const express = require("express");
const TasklistController = require("../controllers/v1/TasklistController");

const router = express.Router();

router.get("/:processDefinitionId/:taskId", TasklistController.renderForm);

module.exports = router;
