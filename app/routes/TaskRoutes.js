const express = require("express");
const TaskController = require("../controllers/v1/TaskController");

const router = express.Router();

router.post("/", TaskController.load);
router.post("/assign", TaskController.assigne);
router.post("/unassign", TaskController.unassigne);
router.get("/renderTaskForm", TaskController.renderForm);
router.post("/search", TaskController.search);
router.post("/complete", TaskController.complete);
router.get("/:taskId/form", TaskController.getFormKey);
router.get("/getCurrentUser", TaskController.getCurrentUser);
router.get("/getTask", TaskController.getTask);
router.get("/getVariable", TaskController.getVariable);
router.get("/getVariables", TaskController.getVariables);
router.get("/deleteProcessInstance", TaskController.deleteProcessInstance);

module.exports = router;
