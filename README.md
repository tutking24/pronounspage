# Zaimki.pl / Pronouns.page

## Build Setup

```bash
# install dependencies
$ make install

# configure environment
$ nano .env
$ make switch LANG=pl

# serve with hot reload at localhost:3000
$ make run

# build for production and launch server
$ make deploy
$ nuxt start
```

## Copyright

See [LICENSE](./LICENSE.md)

## Development Documentation
Read https://en.pronouns.page/new-version
When you add a new language, remember to modify the file ./src/locales.js to add your language. true means the translation is finished and published, so you'll probably want to go with false.\
If you're having problems using Yarn, npm is probably fine, but remember to switch any `yarn [x]` commands for `npm run [x]`\
Remember to modify the ./.env file. You don't really need to set up any external APIs, just make up a secret. In order to test the login system, you can type in an email followed by a + (example@pronouns.page+). This way, you won't need a mailer, as the code will always be 999999. This feature is exclusive to development builds.

## Current translations being worked on
- Catalan - @peiprjs 
- [Add yours!]
