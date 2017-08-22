# Conventions

These are our project guidelines, in alphabetical order:

## Branches

We follow and use naming conventions of [Git Flow](http://nvie.com/posts/a-successful-git-branching-model/) for branches. So normally when beginning a normal task, chose `feature/` as a prefix for the name. If you work on a bugfix, use the `fix/` prefix.

Chose a descriptive yet short name for the branch, use the `-` dash for concatenating words, no underscores or other characters. This is for keeping branch names consistent. If you work on something from our internal ticket system, omit the ticket number from the branch name to keep it short. Rather open a new pull request after initially pushing the branch and put a link to the ticket into its description.

## Dependencies

A friendly daemon called [Greenkeeper](https://greenkeeper.io/) is taking care of dependency upgrades. For it to work correctly, and more importantly, for a stable project, it is essential that **all dependencies added to `package.json` must have fixed versions**. It is not unusual that setting up a new workspace or building the project on a CI has failed because of the use of version ranges. To avoid this, use fixed versions _on everything_ so that everybody and every system is working with the exact same packages.

There is one exception to this rule, it applies to some packages and tools which are used only during development and that aren't required for example for build steps. These packages are listed in the _Greenkeeper ignore section_ in `package.json`. So in general: if a package is listed there, it's dependency declaration _can_ have a version range. If it is _not_ listed there, it _must_ be declared with a fixed version.

## Linter

There is a lint script in `run/lint` which will run different code checkers that are mandatory to pass. The same checks are executed in the continuous integration, which means that one linter error will fail the whole build. To save build runs (they occupy the build pipelines and potentially delay others) it is highly recommended to execute the linter manually before each `git push` to ensure it doesn't throw any errors. As a matter of fact, having lots of commits in Github with these red crossed "No pass!" markers next to them doesn't look very good either.
