const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;
const wait = require('./wait');


// most @actions toolkit packages have async methods
async function run() {
  try { 
    const ms = core.getInput('milliseconds');
    console.log(`Waiting ${ms} milliseconds ...`)
    console.log(context);
    core.debug((new Date()).toTimeString())

    await wait(parseInt(ms));
    core.debug((new Date()).toTimeString())

    core.setOutput('time', new Date().toTimeString());
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
