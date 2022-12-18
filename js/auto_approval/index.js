'use strict'

import { getInput, setFailed } from '@actions/core'
import { GitHub, context } from '@actions/github'

const main = async () => {
  const token = getInput('token')

  const [owner, repo] = context.repo.split('/')

  const octokit = new GitHub(token)

  await octokit.pulls.createReview({
    owner: owner,
    repo: repo,
    pull_number: context.event.number,
    event: 'APPROVE'
  })
}

main().catch(err => setFailed(err.message))
