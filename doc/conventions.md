# Conventions

These are our project guidelines, in alphabetical order:

## Branches

We follow and use the naming conventions of [Git Flow](http://nvie.com/posts/a-successful-git-branching-model/) for branches. So normally when beginning to implement something new, chose `feature/` as a prefix for the branch name. If you're correcting a bug, use the `fix/` prefix.

Chose a descriptive yet short name for the branch, use the `-` dash for concatenating words, no underscores or other characters. This is for keeping branch names consistent. If you work on something from our internal ticket system, omit the ticket number from the branch name to keep it short. Rather open a new pull request after initially pushing the branch and put a link to the ticket into its description.

If you come across small problems while implementing a certain features (this includes small changes in the syntax, indentation, etc) then instead of committing them along with your work, open a new branch based off main, fix these things and have it merged. The rest of the team will profit earlier from these improvements, they don't collide with similar changes someone else might be doing at the same time (identical changes will disappear after a merge, so the first one to commit wins the rat race) and most important, they keep your feature branch free from unrelated changes.

## Dependencies

A friendly daemon called [Greenkeeper](https://greenkeeper.io/) is taking care of dependency upgrades. For it to work correctly, and more importantly, for a stable project, it is essential that **all dependencies added to `package.json` must have fixed versions**. It is not unusual that setting up a new workspace or building the project on a CI has failed because of the use of version ranges. To avoid this, use fixed versions _on everything_ so that everybody and every system is working with the exact same packages.

There is one exception to this rule, it applies to some packages and tools which are used only during development and that aren't required for example for build steps. These packages are listed in the _Greenkeeper ignore section_ in `package.json`. So in general: if a package is listed there, it's dependency declaration _can_ have a version range. If it is _not_ listed there, it _must_ be declared with a fixed version.

## Linter

There is a lint script in `run/lint` which will run different code checkers that are mandatory to pass. The same checks are executed in the continuous integration, which means that one linter error will fail the whole build. To save build runs (they occupy the build pipelines and potentially delay others) it is highly recommended to execute the linter manually before each `git push` to ensure it doesn't throw any errors. As a matter of fact, having lots of commits in Github with these red crossed "No pass!" markers next to them doesn't look very good either.

## Pull Requests

When working on a new feature, open a pull request early to let others know something is going on. Also, these can be referenced better in other pull requests that rely on the currently implemented feature, or other external systems like Jira. When implementing something from this ticket system, put a link to the related ticket into the description text. Jira will automatically pick up the reference and link to the pull request from the ticket view itself.

Same hints like for branch naming apply here. Don't just take the decoded branch name but rather give the pull request and concise, short name. Of course this can (and should) relate to the branch name, but be even more "human readable". Imagine scrolling through a list of possibly hundreds of closed PRs to find _that one thing_ you implemented two months ago. You'd want to find distinctive names there, certainly not "Fix API" in five different variants.

Pull requests ideally should be short, contain only a handful of commits and affect only a few files. Sometimes it is necessary to include a lot of changes, but it shouldn't be the general case. If a new feature touches different parts of the system, try to implement them separately in different branches and pull requests.

Open requests lying around for more than a few days bear the risk of getting out of sync with the main branch. So remember to pull the main branch continuously, not only before finishing your work.

Currently, pull requests coming from outside of the core team require active approval. In general, all pull requests are restricted so they can only be merged after the continuous integration and other code checker systems have approved the changes.
