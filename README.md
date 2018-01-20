# gh-organization-indexer
Node server that periodically indexes a GitHub organization's info.

## lolwut
I made this because I needed to create my own relay for the GitHub API. This is a simple express server to relays core information about a GitHub organization from a single endpoint that includes organization info, list of members, and list of repos including topics, readmes, and contributors.

This is a very basic implementation and was created as a custom solution, but should be easy to modify to fit any need. To modify GitHub API credentials or set the organization you want to index, see `config.sample.json`.

The server indexes the API on an custom hourly interval and saves it to a local JSON file. The entire contents of the file are available at `http://localhost:6253/` or whatever port you decide to change it to.

## License
MIT
