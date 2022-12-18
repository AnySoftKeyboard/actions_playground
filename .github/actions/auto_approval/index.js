'use strict'

const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
  const token = core.getInput('token')
  const context = github.context;
  const octokit = github.getOctokit(token)

  await octokit.rest.pulls.createReview({
    ...context.repo,
    pull_number: context.event.number,
    event: 'APPROVE'
  })
}

main().catch(err => core.setFailed(err.message))
