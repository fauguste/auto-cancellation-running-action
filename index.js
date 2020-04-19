const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;
var empty = require('is-empty');


// most @actions toolkit packages have async methods
async function run() {
  try {
    // Do nothing if event is not a pull request.
    if (context.eventName !== 'pull_request') {
      return;
    }
    // Read secret access token.
    const myToken = core.getInput('githubToken');
    const owner = context.repo.owner;
    const repo = context.repo.repo;
    let branch = context.payload.pull_request.head.ref;
    if(empty(myToken)) {
      core.setFailed('Action failed with error, please set githubToken token');
      return;
    }
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
    listRunJob.data.workflow_runs.forEach(function(value) {
      if(maxJobByWrokflow[value.workflow_url] === undefined || value.run_number > maxJobByWrokflow[value.workflow_url]) {
        maxJobByWrokflow[value.workflow_url] = value.run_number;
      }
    });

    // Canceled all job with a less run number by workflow.
    listRunJob.data.workflow_runs.forEach(function(value) {
      if(maxJobByWrokflow[value.workflow_url] !== undefined
          && value.status != 'completed'
          && value.run_number < maxJobByWrokflow[value.workflow_url]) {
        var run_id = value.id;
        octokit.actions.cancelWorkflowRun({
          owner,
          repo,
          run_id
        })
        core.info(`Kill job ${value.run_number} to ${value.id}`);
      }
    });
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
