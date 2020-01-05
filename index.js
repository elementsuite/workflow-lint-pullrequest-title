const core = require('@actions/core');
const github = require('@actions/github');

try {
  const token = core.getInput('github-token');
  const titleRegex = core.getInput('title-regex');
  const client = new github.GitHub(token);
  const payload = github.context.payload;
  const pullRequest = github.context.issue;
  const title = payload.pull_request.title;
  const body = payload.pull_request.body;

  console.log("title", title);
  console.log("body", body);

  let comment;
  if (!new Regex(titleRegex).test(title)) {
    comment = 'Incorrect title format, correct format is "{hr|engage|recruit|core|pay|work|perform|learn|analytics}/{feature|fix}/{description}".'
  }

  if (comment) {
    client.pulls.createReview({
      owner: pullRequest.owner,
      repo: pullRequest.repo,
      pull_number: pullRequest.number,
      body: comment,
      event: 'COMMENT'
    });
    core.setFailed('Pull Request lint failed.');
  }


} catch (error) {
  core.setFailed(error.message);
}
