# Reader Critics

[![Codeship Status for dbmedialab/reader-critics](https://app.codeship.com/projects/50e81240-2277-0135-9adb-62dd7db260b1/status?branch=develop)](https://app.codeship.com/projects/221684)
&nbsp;
[![Wercker status](https://app.wercker.com/status/becb14dfb1645c8010f604bdbb6aeeca/s/develop "wercker status")](https://app.wercker.com/project/byKey/becb14dfb1645c8010f604bdbb6aeeca)
&nbsp;
[![Greenkeeper badge](https://badges.greenkeeper.io/dbmedialab/Reader-critics.svg?token=a55103c0252ec9f2b14f7bb9af0229280aeba52887991f94b78b271f245e9f0c)](https://greenkeeper.io/)

### Table of Contents

* [Project Setup](doc/project-setup.md) ‒ Instructions how to get from the checkout to a running system
* [Glossary](doc/glossary.md) ‒ Set some vocabulary straight first
* [Data Scheme](doc/data-scheme.md) ‒ Entities and relations used for persisting to the database
* [Tests](doc/tests.md) ‒ Everything that needs to be known about automated tests of this thing
* [Crazy Ideas](doc/think-about-these-crazy-ideas.md) ‒ We won't do that right now, but we really want to

### Project Structure

```
/doc                           Documentation and schematics
/kubefiles                     Kubernetes and Wercker configuration
/out                           Target directory for compiled code
    /app                       Compiled app
    /base                      Compiled base modules and libraries
    /bundle                    Target directory for Webpack bundles
    /front                     Compiled frontend
    start.js                   Static Javascript launcher for the app
/resources                     Static resources, often for testing
/run                           Shell scripts for recurring things (npm run XXX often points here)
/src                           TypeScript sources
    /app                       App sources
    /base                      Base modules and libraries
    /front                     React user frontend
/test                          All the test suites
    /base                      Tests for base modules
    /frontend                  Browsertests (Nightwatch)
    /libs                      Tests for used libraries (core Node.js and other modules)
    mocha-base.opts            Mocha options for running base module tests
    mocha-libs.opts            Mocha options for running library tests
    nightwatch-frontend.js     Nightwatch configuration for frontend tests
    test-tools-frontend.js     Common helper functions for frontend tests
/tmp                           Home of the temporary files
    /images                    Static express route for serving images goes here
    /src-archive               Early React drafts
    /styles                    Static route for CSS things
    /templates                 HTML page templates, doT format
.ackrc                         Project local settings for the "ack" tool
.editorconfig                  Configures indentation and whitespace. These are not only suggestions!
.gitignore                     Guess what
package.json                   Well, obviously this is a Node.js project
tsconfig.json                  Common configuration for the TypeScript compiler
tslint.json                    TypeScript linter config
webpack-front.js               Webpack configuration for user frontend
wercker.yml                    Wercker configuration
```
