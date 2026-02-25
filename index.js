const core = require("@actions/core");

async function callAgent(apiUrl, apiToken, input, context, sourceUrl) {
  console.log("Calling Assis agent...");

  const body = {
    input: input,
    session_code: null,
    user: {
      email: "github.actions@v360.io",
      first_name: "GitHub",
      last_name: "Actions",
      role: "v360",
    },
    agent_source: {
      database: null,
      url: sourceUrl || apiUrl,
      context: context,
      client_name: null,
    },
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(`Assis API call failed with status ${response.status}: ${JSON.stringify(data)}`);
  }

  const data = await response.json();
  return data["output"];
}

async function run() {
  try {
    const apiUrl = core.getInput("api-url");
    const apiToken = core.getInput("api-token");
    const input = core.getInput("input");
    const context = core.getInput("context");
    const sourceUrl = core.getInput("source-url");

    const output = await callAgent(apiUrl, apiToken, input, context, sourceUrl);

    console.log("Assis output:\n\n", output);
    core.setOutput("output", output);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
