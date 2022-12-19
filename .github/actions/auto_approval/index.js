'use strict'

const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
  const token = core.getInput('token');
  const users = core.getInput('allowed_users')
                  .split(',')
                  .map(u => u.trim())
                  .filter(u => u.length > 0);
  const reviewer_login = core.getInput('review_for');

  const context = github.context;
  const sender_login = context.payload.pull_request.user.login;
  const reviewers = context.payload.pull_request.requested_reviewers
                  .map(u => u.login)
                  .filter(u => u.length > 0);
  if (reviewers.includes(reviewer_login)) {
    core.info(`'${reviewer_login}' has been requested to review.`);
    if (users.includes(sender_login)) {
      core.info(`User '${sender_login}' PR will be approved.`);
      const octokit = github.getOctokit(token);
    
      await octokit.rest.pulls.createReview({
        ...context.repo,
        pull_number: context.payload.number,
        event: 'APPROVE'
      });
    } else {
      core.info(`User '${sender_login}' is not in allowed list: ${users.join(", ")}. PR will not be auto-approved.`);
    }
  } else {
    core.info(`'${reviewer_login}' is not in list of requested reviewers: ${reviewers.join(", ")}. PR will not be auto-approved.`);
  }
}

main().catch(err => core.setFailed(err.message));
