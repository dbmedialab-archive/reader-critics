## Tests

*Tests are good! Tests let you sleep better! Have many of 'em!*

All test suites are located in _/test_ and grouped into
* Library tests in _/test/libs_
* Base unit tests in _/test/base_
* App unit tests in _/test/app_ (does not exist yet)
* Frontend E2E tests in _/test/frontend_

All files that declare test cases have to end with the suffix `*.test.ts` for
all backend related tests and `*.test.js` for frontend tests. The Nightwatch
suite does not (yet) support TypeScript.

#### Unit Tests

Tests for the app (all things backend) use
* Mocha
* _Chai.assert_

TypeScript requires additional libraries on the way, these are included though
Mocha's `require` command line parameters (see the _*.opts_ files in _/test_)
* `ts-node/register` - instant compiling of TS sources
* `tsconfig-paths/register` - takes `paths` from _tsconfig.json` and maps them

##### Special Case: Library Tests

Often when a new, unknown library is used, the developer needs to write a few
snippets to understand its functions, how return values are formatted, and so
forth.

It is convenient to embed these snippets and "proving" functions into small
test cases. This way, two things are achieved:
* Developers new to the project and/or the library will get some free examples
* The CI will catch breaking changes in the library's API (this has happened!)

#### Frontend E2E Tests

Tests for the frontend use
* Nightwatch
* Selenium WebDriver
* Chromedriver and Geckodriver for local tests
* Browserstack for remote tests (**TBD!**)

Test cases should be grouped into directories denoting the component that they
test or that this test is closest related to.

Example:
```
/test
  ► ArticleElement
     ► TextDiff.test.js
  ► ArticleEditForm
     ► FormResetAfterEdit.test.js
```
The same way, the test case's first `describe()` call should print the name
of that particular component.

Things learned when writing tests for Nightwatch:
* If the test finishes too quickly, something likely has gone south. It has
  been observed that certain `assert.value(...)` calls just interrupt the
  test case and **let the result appear to be OKAY**. This means basically that
  the test is **not finishing** but at the same time claims to be good. Such
  a test is not only _worthless_, but rather _dangerous_ and _deceiving_.
  Always check that the test is really doing what it is supposed to to when
  writing a new one!
* Frontend tests actually behave like a person sitting in front of a browser.
  Therefore, tests need to follow the _exact_ behaviour of a human user.
  Example, the following sequence will _do nothing_:
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
* There is a convenient function named `perform()` in the Nightwatch API, that
  can execute arbitrary stuff during a test sequence. It is also possible to
  do asynchronous things inside here, and the test runner will await the `done`
  callback if this parameter to `perform()` is used:
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
  A bit more code, but the call to `done` is reliable this way. It is supposed
  that parameters forwarded to `done` when using it directly in a callback
  parameter are interpreted as errors and thus will make the test case fail.
