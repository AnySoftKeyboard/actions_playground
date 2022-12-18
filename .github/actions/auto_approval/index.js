'use strict'

import { getInput, setFailed } from '@actions/core'
import { GitHub, context } from '@actions/github'

const main = async () => {
  const token = getInput('token')
  const octokit = new GitHub(token)

  await octokit.pulls.createReview({
    ...context.repo,
    pull_number: context.event.number,
    event: 'APPROVE'
  })
}

main().catch(err => setFailed(err.message))
