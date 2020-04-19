const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;
const wait = require('./wait');
var empty = require('is-empty');


// most @actions toolkit packages have async methods
async function run() {
  try { 
    const ms = 100000;
    console.log(`Waiting ${ms} milliseconds ...`)

    // Read secret access token.
    const myToken = core.getInput('githubToken');
    const owner = context.repo.owner;
    const repo = context.repo.repo;
    let branch = context.payload.pull_request.head.ref;

    if(empty(myToken)) {
      core.setFailed(`Action failed with error, please set githubToken token`);
      return;
    }

    core.debug((new Date()).toTimeString())


    const octokit = new github.GitHub(myToken);

    // Get all running action on the same branch.
    let listRunJob = await octokit.actions.listRepoWorkflowRuns({
      owner,
      repo,
      branch: branch,
      per_page: 100
    });

    // Get max run id by workflow.
    var maxJobByWrokflow = [];
    listRunJob.data.workflow_runs.forEach(function(value, index, all) {
      if(maxJobByWrokflow[value.workflow_url] === undefined || value.run_number > maxJobByWrokflow[value.workflow_url]) {
        maxJobByWrokflow[value.workflow_url] = value.run_number;
      }
    });

    listRunJob.data.workflow_runs.forEach(function(value, index, all) {
      if(maxJobByWrokflow[value.workflow_url] !== undefined
          && value.status != 'completed'
          && value.run_number < maxJobByWrokflow[value.workflow_url]) {
        console.log(`Kill job ${value.run_number} to ${value.id}`);
      }
    });
    await wait(parseInt(ms));

    core.setOutput('time', new Date().toTimeString());
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
