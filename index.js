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

    // Get all running action on the same branch.
    let listRunJob = await octokit.actions.listRepoWorkflowRuns({
      owner,
      repo,
      branch: branch,
      per_page: 100
    });

    var maxJobByWrokflow = [];
    listRunJob.data.workflow_runs.forEach(function(value, index, all) {
      console.log("-------------------------------------");
      if(maxJobByWrokflow[value.workflow_url] === undefined || value.run_number > maxJobByWrokflow[value.workflow_url]) {
        maxJobByWrokflow[value.workflow_url] = value.run_number;
      }
      console.log(value.run_number);
      console.log(value.status);
      console.log(value.workflow_url);
      console.log("-------------------------------------");
    });

    console.log(maxJobByWrokflow);
    core.debug((new Date()).toTimeString())

    core.setOutput('time', new Date().toTimeString());
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
