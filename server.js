const express = require("express");
const helmet = require("helmet");
const winston = require("winston");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "tasklist-api" },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
  ],
});

app.use(express.json());
app.use(helmet());

const TasklistRoutes = require("./app/routes/TasklistRoutes");
const TaskRoutes = require("./app/routes/TaskRoutes");
const ProcessRoutes = require("./app/routes/ProcessRoutes");

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/api/v1.0/task", TaskRoutes);
app.use("/api/v1.0/task/assign", TaskRoutes);
app.use("/api/v1.0/task/unassign", TaskRoutes);
app.use("/api/v1.0/task/search", TaskRoutes);
app.use("/api/v1.0/task/renderTaskForm", TaskRoutes);
app.use("/api/v1.0/task/complete", TaskRoutes);
app.use("/api/v1.0/task/:taskId/form", TaskRoutes);
app.use("/api/v1.0/task/getCurrentUser", TaskRoutes);
app.use("/api/v1.0/task/getTask", TaskRoutes);
app.use("/api/v1.0/task/getVariable", TaskRoutes);
app.use("/api/v1.0/task/getVariables", TaskRoutes);
app.use("/api/v1.0/task/deleteProcessInstance", TaskRoutes);

app.use("/api/v1.0/tasklist/:processDefinitionId/:taskId", TasklistRoutes);

app.use("/api/v1.0/process", ProcessRoutes);
app.use("/api/v1.0/process/getXml", ProcessRoutes);
app.use("/api/v1.0/process/getProcessDefinitions", ProcessRoutes);
app.use("/api/v1.0/process/createProcessInstanceWithResult", ProcessRoutes);
app.use("/api/v1.0/process/getVariablesforProcess", ProcessRoutes);
app.listen(port, () => {
  logger.info(`Task List API listening at http://localhost:${port}`);
});
