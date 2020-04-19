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
    const ref = core.getInput('ref');
    if(empty(myToken)) {
      core.setFailed(`Action failed with error, please set githubToken token`);
      return;
    }
    if(empty(ref)) {
      core.setFailed(`Action failed with error, please set ref`);
      return;
    }
    console.log(context);

    core.debug((new Date()).toTimeString())

    await wait(parseInt(ms));

    const octokit = new github.GitHub(myToken);
    core.debug((new Date()).toTimeString())

    core.setOutput('time', new Date().toTimeString());
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
