const core = require('@actions/core');
const github = require('@actions/github');

var addReview = function(client, pullRequest, event, comment) {
  var review = {
    owner: pullRequest.owner,
    repo: pullRequest.repo,
    pull_number: pullRequest.number,
    event: event
  };
  if (comment) {
    review.body = comment;
  }
  client.pulls.createReview(review);
}

var addLabel = function(client, pullRequest, label) {
  client.issues.addLabels({
    owner: pullRequest.owner,
    repo: pullRequest.repo,
    issue_number: pullRequest.number,
    labels: [label]
  });
}

var removeLabel = function(client, pullRequest, label) {
  client.issues.removeLabel({
    owner: pullRequest.owner,
    repo: pullRequest.repo,
    issue_number: pullRequest.number,
    name: label
  });
}

try {
  const token = core.getInput('github-token');
  const titleRegex = core.getInput('title-regex');
  const labelText = core.getInput('label-text');
  const titleFailedComment = core.getInput('title-failed-comment');
  const client = new github.GitHub(token);
  const payload = github.context.payload;
  const pullRequest = github.context.issue;
  const title = payload.pull_request.title;
  const body = payload.pull_request.body;
  const labels = payload.pull_request.labels;

  if (!new RegExp(titleRegex, 'i').test(title)) {
    addReview(client, pullRequest, 'REQUEST_CHANGES', titleFailedComment.replace('%titleRegex%', titleRegex));
    addLabel(client, pullRequest, labelText);
    return;
  }

  removeLabel(client, pullRequest, labelText);
  addReview(client, pullRequest, 'APPROVE');
} catch (error) {
  console.error(error.message);
}
