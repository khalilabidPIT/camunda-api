const { TaskState, TasklistApiClient } = require("camunda-tasklist-client");

// Initialize the TaskList API client
const tasklistAPI = new TasklistApiClient({
  baseUrl: process.env.CAMUNDA_TASKLIST_BASE_URL,
  oAuthToken: process.env.CAMUNDA_CONSOLE_CLIENT_SECRET
});

// Define common fields to retrieve
const TASK_FIELDS = [
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
  `variables {
    id
    name
    value
    previewValue
  }`
];

// Get valid state names
const validStateNames = Object.keys(TaskState);

// Validate task state
const isValidTaskState = (state) => {
  return state && validStateNames.includes(state.toUpperCase());
};

exports.getTaskHistory = async (req, res) => {
  try {
    const requestedState = req?.body?.state?.toUpperCase();
    
    // Validate state if provided
    if (requestedState && !isValidTaskState(requestedState)) {
      return res.status(400).send({
        error: "Invalid task state",
        message: `State must be one of: ${validStateNames.join(', ')}`,
        providedState: requestedState
      });
    }

    const searchQuery = {
      state: requestedState ? TaskState[requestedState] : TaskState.COMPLETED,
      processDefinitionId: req?.body?.processDefinitionId,
      processInstanceId: req?.body?.processInstanceId,
      assignee: req?.body?.assignee,
      searchAfter: req?.body?.startDate,
      searchBefore: req?.body?.endDate
    };

    // Remove undefined or null values from query
    Object.keys(searchQuery).forEach(key => 
      !searchQuery[key] && delete searchQuery[key]
    );

    const result = await tasklistAPI.getTasks(searchQuery, TASK_FIELDS);

    // Filter results based on user permissions if email is provided
    let filteredTasks = result?.tasks || [];
    if (filteredTasks?.length > 0 && req?.body?.email) {
      filteredTasks = filteredTasks.filter(task => 
        task?.assignee === req?.body?.email ||
        (task?.candidateUsers?.some(user => req?.body?.email.includes(user))) ||
        (task?.candidateGroups?.some(group => req?.body?.groupNames?.includes(group)))
      );
    }

    res.status(200).send({
      tasks: filteredTasks,
      totalCount: filteredTasks.length,
      appliedState: requestedState || 'COMPLETED'
    });
  } catch (error) {
    console.error('Error fetching task history:', error);
    res.status(500).send({
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
};

exports.getTaskHistoryById = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    
    if (!taskId) {
      return res.status(400).send({
        error: "Missing task ID",
        message: "Task ID is required"
      });
    }

    const task = await tasklistAPI.getTask(taskId, TASK_FIELDS);

    if (!task) {
      return res.status(404).send({ 
        error: "Task not found",
        message: `No task found with ID: ${taskId}`
      });
    }

    res.status(200).send({ task });
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    res.status(500).send({
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
};

// Export valid state names for use in other parts of the application
exports.validTaskStates = validStateNames;
