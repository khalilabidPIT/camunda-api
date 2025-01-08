const { C8 } = require("camunda-8-sdk");

// Initialize clients with required configurations
const zbc = new C8.ZBClient({
  oAuth: {
    cacheDir: process.env.ZEEBE_OAUTH_CACHE_DIR || '/tmp', // Ensure OAuth tokens are cached in a writable directory
  },
});
const operate = new C8.OperateApiClient({
  oAuth: {
    cacheDir: process.env.ZEEBE_OAUTH_CACHE_DIR || '/tmp',
  },
});

exports.getProcessDefinitions = async (req, res) => {
  try {
    // Step 1: Retrieve all process definitions
    const allProcessDefinitions = await operate.searchProcessDefinitions({
      size: 1000, // Adjust the size based on your needs to retrieve all definitions
    });

    // Step 2: Group process definitions by their key
    const processDefinitionsMap = allProcessDefinitions?.items
      ?.filter(
        (item) =>
          item?.bpmnProcessId === "P024" || item?.bpmnProcessId === "P025"
      )
      ?.reduce((acc, definition) => {
        const key = definition.bpmnProcessId;
        if (!acc[key] || acc[key].version < definition.version) {
          acc[key] = definition;
        }
        return acc;
      }, {});

    // Step 3: Convert the grouped definitions map into an array
    const latestProcessDefinitions = Object.values(processDefinitionsMap);

    // console.log(
    //   latestProcessDefinitions.filter((item) => item?.processDefinitionId)
    // );

    res.status(200).send(latestProcessDefinitions);
  } catch (error) {
    const errorMessage = error?.message;
    res.status(500).send(errorMessage);
  }
};

exports.getXml = async (req, res) => {
  const processDefinitionKey = req?.query?.processDefinitionKey;
  try {
    const xml = await operate.getProcessDefinitionXML(processDefinitionKey);
    res.status(200).send(xml);
  } catch (error) {
    const errorMessage = error?.message;
    res.status(500).send(errorMessage);
  }
};

exports.createProcessInstanceWithResult = async (req, res) => {
  try {
    const process = await zbc.createProcessInstance({
      bpmnProcessId: req?.query?.bpmnProcessId,
    });

    res.status(200).send(process);
  } catch (error) {
    const errorMessage = error?.message;
    res.status(500).send(errorMessage);
  }
};

exports.getVariablesforProcess = async (req, res) => {
  try {
    const variables = await operate.getJSONVariablesforProcess(
      req?.query?.processInstanceId
    );

    res.status(200).send(variables);
  } catch (error) {
    const errorMessage = error?.message;
    res.status(500).send(errorMessage);
  }
};
