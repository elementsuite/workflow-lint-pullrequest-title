const core = require('@actions/core');
const github = require('@actions/github');

var createReview = function(client, comment) {
  client.pulls.createReview({
    owner: pullRequest.owner,
    repo: pullRequest.repo,
    pull_number: pullRequest.number,
    body: comment,
    event: 'COMMENT'
  });
}

try {
  const token = core.getInput('github-token');
  const titleRegex = core.getInput('title-regex');
  const client = new github.GitHub(token);
  const payload = github.context.payload;
  const pullRequest = github.context.issue;
  const title = payload.pull_request.title;
  const body = payload.pull_request.body;

  let comment;
  if (!new RegExp(titleRegex).test(title)) {
    core.setFailed('Pull Request lint failed.');
    createReview(`Incorrect title format, regex for correct format is "${titleRegex}".`);
  }

} catch (error) {
  core.setFailed(error.message);
}
