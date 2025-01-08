//camunda communtity module to inetract with Camunda engin
const { TasklistApiClient } = require("camunda-tasklist-client");

const tasklistAPI = new TasklistApiClient();

////////////////////////////////////
// Load All Tasks
////////////////////////////////////
exports.load = async (req, res, next) => {
  const TaskState = {
    CREATED: "CREATED",
    COMPLETED: "COMPLETED",
    CANCELED: "CANCELED",
  };

  const { tasks } = await tasklistAPI.getAllTasks();

  //TODO add logic to get One Task

  res.status(200).send(tasks);
};

exports.search = async (req, res, next) => {
  const TaskState = {
    CREATED: "CREATED",
    COMPLETED: "COMPLETED",
    CANCELED: "CANCELED",
  };

  const { tasks } = await tasklistAPI.Tasks({ state: TaskState.CREATED });
  const FirstTask = tasks[0];

  res.status(200).send(tasks);

  //console.log('FirstTask', JSON.stringify(FirstTask, null, 0))
  //const taskid = FirstTask.id
  //const task = await tasklist.claimTask(taskid,"Mohammed")
};

exports.assigne = async (req, res, next) => {
  const taskid = req.query.taskId;
  const assigne = req.query.assigne;

  try {
    const task = await tasklistAPI.claimTask(taskid, assigne);
    res.status(200).send(task);
  } catch (error) {
    console.log(error);
  }
};

exports.unassigne = async (req, res, next) => {
  const taskid = req.query.taskId;

  const task = await tasklistAPI.unclaimTask(taskid);
  res.status(200).send(task);
};

exports.complete = async (req, res, next) => {
  const taskid = req.query.taskId;
  const variables = [];
  //const variables=req.query.variables

  const task = await tasklistAPI.completeTask(taskid, variables);

  res.status(200).send(task);
};

exports.getFormKey = async (req, res, next) => {
  const taskid = req.query.taskId;
  const variables = [];
  //const variables=req.query.variables

  //const task = await tasklistAPI.completeTask(taskid, variables)

  res.status(200).send({ key: "userTaskForm_3osqmdu" });
};

exports.renderForm = async (req, res, next) => {
  // const formId = "userTaskForm_3osqmdu"
  const formId = req.query.formId;
  // const processDefinitionId = "2251799814028527"
  const processDefinitionId = req.query.processDefinitionId;
  const from = await tasklistAPI.getForm(formId, processDefinitionId);

  res.status(200).send(from);
};
