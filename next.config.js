module.exports = () => ({
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    JIRA_TOKEN: process.env.JIRA_TOKEN,
    ENV: process.env.NODE_ENV,
  },
});
