# Reader Critics

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)
&nbsp;
[![GitHub version](https://badge.fury.io/gh/dbmedialab%2Freader-critics.svg)](https://badge.fury.io/gh/dbmedialab%2Freader-critics)
&nbsp;
[![Code Climate](https://codeclimate.com/github/dbmedialab/reader-critics/badges/gpa.svg)](https://codeclimate.com/github/dbmedialab/reader-critics)
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
/assets                        Static route base folder
    /images                    Images!
    /styles                    CSS things
    /templates                 doT style templates for some of the (mostly) static pages
/doc                           Documentation and schematics
/kubefiles                     Kubernetes and Wercker configuration
/out                           Target directory for compiled code
    /admin                     Compiled admin UI
    /app                       Compiled app
    /base                      Compiled base modules and libraries
    /bundle                    Target directory for Webpack bundles
    /front                     Compiled frontend
    start.js                   Static Javascript launcher for the app
/resources                     Static resources, often for testing
/run                           Shell scripts for recurring things (npm run XXX often points here)
/src                           TypeScript sources
    /admin                     Admin UI frontend
    /app                       App sources
    /base                      Base modules and libraries
    /front                     React user frontend
/test                          All the test suites
    /app                       Tests for the backend app
    /base                      Tests for base modules
    /frontend                  Browsertests (Nightwatch)
    /libs                      Tests for used libraries (core Node.js and other modules)
    mocha-app.opts             Mocha options for running backend tests
    mocha-base.opts            Mocha options for running base module tests
    mocha-libs.opts            Mocha options for running library tests
    nightwatch-frontend.js     Nightwatch configuration for frontend tests
    test-tools-frontend.js     Common helper functions for frontend tests
/tmp                           Home of the temporary files
    /src-archive               Early React drafts
    /templates                 HTML page templates, doT format (temporary)
.ackrc                         Project local settings for the "ack" tool
.editorconfig                  Configures indentation and whitespace. These are not only suggestions!
.gitignore                     Guess what
package.json                   Dependencies and everything
tsconfig.json                  TypeScript compiler configuration
tslint.json                    TypeScript linter configuration
webpack-admin.js               Webpack configuration for admin UI
webpack-front.js               Webpack configuration for user frontend
wercker.yml                    Wercker configuration
```

### License

**Copyright © 2017 DB Medialab / Aller Media AS** (Oslo, Norway)

Licensed under the [GNU General Public License (GPL) v3](LICENSE.txt).
