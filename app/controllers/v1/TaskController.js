const { C8, Tasklist } = require("camunda-8-sdk");

const cacheDir = process.env.ZEEBE_OAUTH_CACHE_DIR || "/tmp";
const tasklistAPI = new C8.TasklistApiClient({
  oAuth: {
    cacheDir, // Explicitly set the cache directory
  },
});

////////////////////////////////////
// Load All Tasks
////////////////////////////////////
exports.load = async (req, res) => {
  try {
    const tasks = await tasklistAPI.getAllTasks();
    let filteredTasks;
    if (tasks?.tasks?.length > 0 && req?.body?.email) {
      filteredTasks = tasks?.tasks.filter(
        (task) =>
          task?.assignee === req?.body?.email ||
          task?.candidateUsers?.some((user) =>
            req?.body?.email.includes(user)
          ) ||
          task?.candidateGroups?.some((group) =>
            req?.body?.groupNames.includes(group)
          )
      );
    }

    res.status(200).send(filteredTasks || tasks?.tasks || {});
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const queryOptions = {};

    // Add state to the query if req.query.status exists
    if (req?.body?.status) {
      queryOptions.state = Tasklist.TaskState[req?.body?.status];
    }

    // Add processDefinitionId to the query if req.query.processDefinitionId exists
    if (req?.body?.processDefinitionId) {
      queryOptions.processDefinitionId = req?.body?.processDefinitionId;
    }

    // Add processInstanceId to the query if req.query.processInstanceId exists
    if (req?.body?.processInstanceId) {
      queryOptions.processInstanceId = req?.body?.processInstanceId;
    }

    // Add assignee to the query if req.query.assignee exists
    if (req?.body?.assignee) {
      queryOptions.assignee = req?.body?.assignee;
    }

    // queryOptions.pageSize = 1000;

    const tasks = await tasklistAPI.getTasks(queryOptions, [
      "candidateUsers",
      "assignee",
      "candidateGroups",
      "creationTime",
      "completionTime",
      "formKey",
      "id",
      "isFirst",
      "name",
      "processDefinitionId",
      "processInstanceId",
      "processName",
      "taskDefinitionId",
      "taskState",
    ]);

    // filter the tasks if req.query.candidateGroup exists
    // Used filter because the candidateGroup filter did'nt workn from camunda side
    let filteredTasks;
    if (tasks?.tasks?.length > 0 && req?.body?.email) {
      filteredTasks = tasks?.tasks.filter(
        (task) =>
          task?.assignee === req?.body?.email ||
          task?.candidateUsers?.some((user) =>
            req?.body?.email.includes(user)
          ) ||
          task?.candidateGroups?.some((group) =>
            req?.body?.groupNames.includes(group)
          )
      );
    }

    res.status(200).send(filteredTasks || tasks?.tasks || {});
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.getTask = async (req, res, next) => {
  const id = req.query.taskId;
  try {
    const task = await tasklistAPI.getTask(id, ["id", "name", "processName"]);
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getVariable = async (req, res, next) => {
  const taskId = req.query.taskId;

  // const variablesNames = ['department','employeeName']
  try {
    const variables = await tasklistAPI.getVariable(taskId);
    res.status(200).send(variables);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.getVariables = async (req, res, next) => {
  const taskid = req.query.taskId;

  try {
    const variables = await tasklistAPI.getVariables({});
    res.status(200).send(variables);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.deleteProcessInstance = async (req, res, next) => {
  const processInstanceId = req.query.processInstanceId;
  // const variablesNames = ['department','employeeName']
  try {
    const variables = await tasklistAPI.deleteProcessInstance(
      processInstanceId
    );
    res.status(200).send(variables);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.assigne = async (req, res, next) => {
  const taskid = req?.body?.taskId;
  const assignee = req?.body?.assignee;

  try {
    const task = await tasklistAPI.claimTask(taskid, assignee);
    res.status(200).send(task);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(JSON.parse(error?.message));
  }
};

exports.unassigne = async (req, res, next) => {
  const taskId = req?.body?.taskId;
  try {
    const task = await tasklistAPI.unclaimTask(taskId);
    res.status(200).send(task);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await tasklistAPI.getCurrentUser();
    res.status(200).send(currentUser);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.complete = async (req, res, next) => {
  const taskId = req?.body?.taskId;
  const variables = req?.body?.variables ? req.body.variables : {};

  try {
    const task = await tasklistAPI.completeTask(taskId, variables);

    if (task) {
      res.status(200).send(task);
    } else {
      res.status(500).send("Error: " + task);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
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

  try {
    const from = await tasklistAPI.getForm(formId, processDefinitionId);
    res.status(200).send(from);
  } catch (error) {
    res.status(500).send(error);
  }
};
