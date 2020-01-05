const core = require('@actions/core');
const github = require('@actions/github');

try {
  const token = core.getInput('repo-token');
  const client = new github.GitHub(token);
  const payload = github.context.payload;
  const pullRequest = github.context.issue;
  const title = payload.title;
  const body = payload.body;

  console.log("title", title);
  console.log("body", body);

  client.pulls.createReview({
    owner: pullRequest.owner,
    repo: pullRequest.repo,
    pull_number: pullRequest.number,
    body: 'This is a comment!',
    event: 'COMMENT'
  });
} catch (error) {
  core.setFailed(error.message);
}
