# Tests

*Tests are good! Tests let you sleep better! Have many of 'em!*

All test suites are located in _/test_ and grouped into
* [Library tests](/src/test/libs)
* [Base unit tests](/src/test/base)
* [App unit tests](/src/test/app)
* [Database DAO tests](/src/test/database)
* [Frontend E2E tests](/src/test/frontend)

All files that declare test cases have to end with the suffix `*.test.ts` for
all backend related tests and additionally `*.test.js` for frontend tests.

## Database Tests

These tests try to cover all DAO methods of the persisting services and apply them in a defined order against a running database, preferrable on `localhost`. During deployment, the CI/CD container has to provide a sufficient MongoDB service. Redis is not affected by these tests.

:exclamation::exclamation: **Attention: running the database tests will delete and rewrite all collections in the configured MongoDB** :exclamation::exclamation:

If you want to keep your own test data, either add them to the test resources or _simply do not run them_. The database tests are also executed when as one of the test suites in `run/test` so be aware that running this script locally **will erase everything**.

To prevent the test script from overwriting remote databases, the MongoDB connection module checks the database URL against a regular expression when started in test mode

While overwriting data might sound like a bad thing at first, it is in fact a very valuable development tool. These tests will always provide you with a defined set of objects in your database that you can work with. If you need additional object which maybe have to contain specific data for a new feature, create new test files in [/resources](/resources) to have them included in the tests on every new run.

Several of these tests scan their relevant directories under [/resources](/resources) and try to store all the [JSON5](https://json5.org/)-files that are found there. So you don't need to add the names of your new resource files to the test sources, they will get picked up automatically.

Beware though, that there are tests that check object counts of the collections, sometimes against criteria like _feedback objects in a certain status_ or similar. These numbers are hardcoded and need to be changed to make the tests pass again. Congrats, you have just performed [test-driven development](https://en.wikipedia.org/wiki/Test-driven_development)!

**When changing code in the persisting services or adding a new feature that depends on objects in the database, it is _highly_ recommended to run these tests as often as possible during development, not only once when you think your task is finished.**

Some workflows of the application, like for example sending out e-mail notifications, can change the state of the objects in the database. To reset the state for re-testing such a workflow, it is sometimes required to run the database tests everytime before the app is started again. But this is just another use that these tests have, giving you a defined state everytime the app starts. Since the tests finish in less than two seconds on a halfwhat recent machine, this is certainly not a problem.

## Unit Tests

Tests for the app (all things backend) use
* Mocha
* Chai/Assert

TypeScript requires additional libraries on the way, these are included though Mocha's `require` command line parameters (see the _*.opts_ files in _/src/test_)
* `ts-node/register` - instant compiling of TS sources
* `tsconfig-paths/register` - takes `paths` from _tsconfig.json` and maps them

### Special Case: Library Tests

Often when a new, unknown library is used, the developer needs to write a few snippets to understand its functions, how return values are formatted, and so forth.

It is convenient to embed these snippets and "proving" functions into small test cases. This way, two things are achieved:
* Developers new to the project and/or the library will get some free examples
* The CI will catch breaking changes in the library's API (this has happened!)

## Frontend E2E Tests

Tests for the frontend use
* Nightwatch
* Selenium WebDriver
* Chromedriver and Geckodriver for local tests
* Browserstack for remote tests (**TBD!**)

Test cases should be grouped into directories denoting the component that they test or that this test is closest related to.

Example:
```
/test
  ► ArticleElement
     ► TextDiff.test.js
  ► ArticleEditForm
     ► FormResetAfterEdit.test.js
```
The same way, the test case's first `describe()` call should print the name of that particular component.

Things learned when writing tests for Nightwatch:
* If the test finishes too quickly, something likely has gone south. It has been observed that certain `assert.value(...)` calls just interrupt the test case and **let the result appear to be OKAY**. This seems to be a bug in Nightwatch and is triggered when comparing something against `undefined`. The test is **not finishing** but at the same time claims to be fine. Such a test is not only _worthless_, but rather _dangerous_ and _deceiving_.
* Always check that the test is really doing what it is supposed to to when writing a new one!
* The function chains of the test suites in Nightwatch are evaluated _completely before_ the test is started. This means that variables that are set during the test and are referenced later will always resolve to `undefined`. See above and also [this Google Groups thread](https://groups.google.com/forum/#!topic/nightwatchjs/NmRQtUz4bzk).
* Frontend tests actually behave like a person sitting in front of a browser. Therefore, tests need to follow the _exact_ behaviour of a human user. Example, the following sequence will _do nothing_:
  ```
    browser.url('http://localhost')
    .waitForElementVisible('body', 500)
    .setValue('textarea#input', 'Hello World')
  ```
  The browser will receive key events, but if the `<textarea>` does not have
  focus by coincidence, they will disappear into bit nirvana. The following works:
  ```
    browser.url('http://localhost')
    .waitForElementVisible('body', 500)
    .click('textarea#input')
    .setValue('textarea#input', 'Hello World')
  ```
  This sequence emulates real user behaviour, since the input field is
  activated by _clicking_ it with the (virtual) mouse before starting to type.
* There is a convenient function named `perform()` in the Nightwatch API, that can execute arbitrary stuff during a test sequence. It is also possible to do asynchronous things inside here, and the test runner will await the `done` callback if this parameter to `perform()` is used:
  ```
    .perform(function(done) {
      ...
    })
  ```
  *However*, using `done` as a callback parameter to another asynchronous call
  will most likely not work. `done` should always be called inside a wrapper
  function. This will likely break:
  ```
    .perform(function(done) {
      anotherAsyncThing.then(done);
    })
  ```
  Use this pattern instead:
  ```
    .perform(function(done) {
      anotherAsyncThing.then(function() {
        done();
      });
    })
  ```
  A bit more code, but the call to `done` is reliable this way. It is supposed that parameters forwarded to `done` when using it directly in a callback parameter are interpreted as errors and thus will make the test case fail.
* Nightwatch tests in Mocha format are one long function sequence. Commands, asserts, waits, everything is chained. The test execution is asynchronous, which makes chaining all calls to Nightwatch necessary.
  This test case
  ```
    browser
      .click('input#field')
      .setValue('input#field', 'something');  // set it
    browser
      .assert.value('input#field', 'something');  // expect it
  ```
  will not yield the expected result because both calls will run concurrently. Again, this is only the case when being executed through the Mocha testrunner. When using the Nightwatch testrunner, such calls are possible and will be executed in sequence.
