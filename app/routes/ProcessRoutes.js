const express = require("express");
const ProcessController = require("../controllers/v1/ProcessController");

const router = express.Router();

router.get("/getProcessDefinitions", ProcessController.getProcessDefinitions);
router.get("/getXml", ProcessController.getXml);
router.get(
  "/createProcessInstanceWithResult",
  ProcessController.createProcessInstanceWithResult
);
router.get("/getVariablesforProcess", ProcessController.getVariablesforProcess);
module.exports = router;
