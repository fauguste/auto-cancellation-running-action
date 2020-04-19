const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;
const wait = require('./wait');
var empty = require('is-empty');


// most @actions toolkit packages have async methods
async function run() {
  try { 
    const ms = 10000;
    console.log(`Waiting ${ms} milliseconds ...`)

    // Read secret access token.
    const myToken = core.getInput('githubToken');
    const ref = context.ref;
    const owner = context.repo.owner;
    const repo = context.repo.repo;
    if(empty(myToken)) {
      core.setFailed(`Action failed with error, please set githubToken token`);
      return;
    }

    console.log(context);
    let branch = context.payload.pull_request.head.ref;
    console.log("----------------------");
    core.debug((new Date()).toTimeString())

    await wait(parseInt(ms));

    const octokit = new github.GitHub(myToken);

    let listRunJob = await octokit.actions.listRepoWorkflowRuns({
      owner,
      repo,
      branch: branch,
      per_page: 100
    });

    listRunJob.data.workflow_runs.forEach(function(value, index, all) {
      console.log("-------------------------------------");
      console.log(value);
      console.log("-------------------------------------");
    });
    console.log(listRunJob);

    core.debug((new Date()).toTimeString())

    core.setOutput('time', new Date().toTimeString());
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
