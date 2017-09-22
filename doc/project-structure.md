# Project Structure

```
/assets                        Static route base folder
  /images                      Images!
  /styles                      CSS things
  /templates                   doT style templates for some of the (mostly) static pages
/conf                          Config files, mostly for tests, etc. (to not clutter / too much)
/doc                           Documentation and schematics
/kubefiles                     Kubernetes and Wercker configuration
/out                           Target directory for compiled code
  /admin                       Compiled admin UI
  /app                         Compiled app
  /base                        Compiled base modules and libraries
  /bundle                      Target directory for Webpack bundles
  /front                       Compiled frontent
  start.js                     Static Javascript launcher for the app
/resources                     Static resources, often for testing
/run                           Shell scripts for recurring things (npm run XXX often points here)
/src                           TypeScript sources
  /admin                       Admin UI frontend
  /app                         App sources
  /base                        Base modules and libraries
  /front                       React user frontend
  /test                        All the test suites
    /app                       Tests for the backend app
    /base                      Tests for base modules
    /database                  Tests for persisting services (operating on database)
    /frontend                  Browsertests (Nightwatch)
    /libs                      Tests for used libraries (core Node.js and other modules)
    test-tools-frontend.js     Common helper functions for frontend tests
/templates                     doT style templates, defaults (if not overridden by website config)
/tmp                           Home of the temporary files
  /src-archive                 Early React drafts
  /templates                   HTML page templates, doT format (temporary)
.ackrc                         Project local settings for the "ack" tool
.editorconfig                  Configures indentation and whitespace. These are not only suggestions!
.gitignore                     Guess what
config.example.json5           Empty template for creating your local app configuration
package.json                   Dependencies and everything
tsconfig.json                  TypeScript compiler configuration
tslint.json                    TypeScript linter configuration
webpack-admin.js               Webpack configuration for admin UI
webpack-front.js               Webpack configuration for user frontend
wercker.yml                    Wercker configuration
```
