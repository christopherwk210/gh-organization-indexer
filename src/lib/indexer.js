// Imports
const octokit = require('@octokit/rest')()

async function index(config) {
  console.log('Begin indexing!');

  // Authenticate
  octokit.authenticate({
    type: 'basic',
    username: config.credentials.username,
    password: config.credentials.password
  });

  // Contact API
  let organization = {};

  console.log('Getting organization info...');

  // Get organization info
  organization.info = await octokit.orgs.get({ org: config.organization });
  
  console.log('Done.');
  console.log('Getting members...');

  // Get organization members
  organization.members = await octokit.orgs.getMembers({ org: config.organization });
  
  console.log('Done.');
  console.log('Getting repos...');

  // Get organization repos
  organization.repos = await octokit.repos.getForOrg({ org: config.organization });
  
  console.log('Done.');

  // Get additional repo information
  for (repo of organization.repos.data) {
    let owner = repo.owner.login;
    let name = repo.name;

    // Attempt to get latest update date
    try {
      let lastCommit = await octokit.repos.getCommits({
        owner: owner,
        repo: name,
        page: 1,
        per_page: 1
      });

      repo.lastUpdated = lastCommit.data[0].commit.author.date;
    } catch(e) {
      //
    }

    console.log(`Getting additional repo information for ${name}...`);

    // Get readme if it exists
    try {
      repo.readme = await octokit.repos.getReadme({
        owner: owner,
        repo: name
      });
    } catch(e) {
      // console.log(e)
    }

    // Parse readme
    if (repo.readme) {
      repo.readme = repo.readme.data.content;
    }

    // Get topics
    repo.topics = await octokit.repos.getTopics({
      owner: owner,
      repo: name
    });

    // Get contributors
    repo.contributors = await octokit.repos.getContributors({
      owner: owner,
      repo: name
    });

    console.log('Done.');
  }

  console.log('Indexing complete.');

  return organization;
}

module.exports = index;
