# Backend Service Layer

The service layer is the main abstraction between the object persistence on the one end and the network/API communication layers on the other end of the application stack. It provides generic functions for accessing persisted objects as well as tool functions that fall in their area of responsibility. Introducing such a layer achieves, among other treats, two main purposes:

* The persistence layer is isolated and abstracted from the communication layer, which reduces repetitious code when accessing persistence and enforces validation and security routines.
* The service layer offers a common interface and the implementations behind these functions can be easily switched out by the service factory. When run in "test" environment, all functions that access remote resources like external network sites are replaced by mock functions that load static resources from the local filesystem. This is mainly to have dependable tests, but also useful for other problems.

_The interface declarations and implementations are still in development and will most definitely undergo some changes. Therefore, the excerps included in this document should not be treated as an API documentation of any kind. Please take a look at the real source code for any details, files and folders from all examples used here are linked from this document._

## Services

Service<br/>name | DB | Main<br/>model | Purpose
---------------- |:--:|:--------------:| -------
[Article](/src/app/services/article/ArticleService.ts) | ✖ | [🔗](/src/base/Article.ts) | Download external articles, store and load article objects
[End User](/src/app/services/enduser/EndUserService.ts) | ✖ | [🔗](/src/base/EndUser.ts) | Controls end user objects (persons that use the feedback frontend)
[Feedback](/src/app/services/feedback/FeedbackService.ts) | ✖ | [🔗](/src/base/Feedback.ts) | Store and load feedback objects, various queries for statistics
[Parser](/src/app/services/parser/ParserService.ts) | - | | Control the parser engine, parse articles into objects
[Suggestion](/src/app/services/suggestion/SuggestionService.ts) | ✖ | [🔗](/src/base/Suggestion.ts) | Store and load comments from the suggestion box
[Template](/src/app/services/template/TemplateService.ts) | - | | Provide templates for frontend and mail formatting
[User](/src/app/services/user/UserService.ts) | ✖ | [🔗](/src/base/User.ts) | Store and load user objects, authentification
[Website](/src/app/services/website/WebsiteService.ts) | ✖ | [🔗](/src/base/Website.ts) | Store and load website objects, control depending services

_DB = Does this service use the database to persist objects?_ If yes, a link to the main model interface for its objects can be found in the next column. See [the section about persistence](#persisting-services) for more details.

## Implementation and Conventions

The service factory resides in [/src/app/services/] and the service interfaces and implementations have their respective subfolders there. The service factory controls which variant of a service is provided, depending on the environment that the backend app is currently running on.

Requesting a service is easy, all imports go through the factory:
```javascript
import { articleService } from 'app/services';
```

In the [factory module](/src/app/services/index.ts), all services are exported at once. The imports depend on the environment and are dynamically constructed:
```javascript
const env : string = app.env === 'test' ? 'mock' : 'live';
...
// tslint:disable no-require-imports

export const articleService : ArticleService
	= require(`./article/ArticleService.${env}`);
...
```

Each service is first specified by a TypeScript interface that defines all exported functions. The above syntax `const articleService : ArticleService ...` ensures that the IDE and compiler will catch any missing function implementations immediately.

Example, [article service interface](/src/app/services/article/ArticleService.ts):
```javascript
interface ArticleService extends BasicPersistingService <Article> {
	download(url : ArticleURL) : Promise <string>;
	fetch(website : Website, url : ArticleURL) : Promise <Article>;

	get(url : ArticleURL, version : string) : Promise <Article>;
	save(website : Website, article : Article) : Promise <void>;
}
```

As seen above, the factory choses an implementation based on the environment, this means that there will always be two files (`[service name].live.ts` and `[service name].mock.ts`) with different suffixes inside a service sub folder, that define which functions are exported for which environment. So for example, if a service is not yet implemented completely, it can reuse some of the mock functions to provide a complete live interface, and then these functions could be implemented one after another until two different complete implementations exist. All the while, tests can be run on top of the new service to ensure that the new implementation behaves exactly as specified with the mock functions (assuming the test has full coverage).

By further convention, there are three different possible sub folders inside a service folder which contain the modules with the function implementations:
* `common` – contains functions that are used in both environments, those that have no direct reliance on external resources (example: [fetch()](/src/app/services/article/common/fetch.ts))
* `live` – implementations with network/resource access
* `mock` – replacing network/resource responses with static content

## Persisting Services <a name="persisting-services"/>

Like the name implies, these services are able to persist the objects they are responsible for to the database. They also offer several common functions and queries as well as specialized (= unique for a service) query functions.

All common functions are defined in the interface [BasicPersistingService](/src/app/services/BasicPersistingService.ts) and their implementations, as far as it is possible to have generic code for them, can be found in [createPersistingService](/src/app/services/createPersistingService.ts), which is used to apply these functions to the export set of a service.

Example, [article service live implementation](/src/app/services/article/ArticleService.live.ts):
```javascript
const service : ArticleService
	= createPersistingService <ArticleDocument, ArticleService, Article> (
		ArticleModel, {
			download,
			fetch,
			...
		}
	);
```

The function `createPersistingService` takes three generic type arguments:
* The sub type of a [Mongoose Document](http://mongoosejs.com/docs/api.html#document-js) as defined in [models.ts](/src/app/db/models.ts)
* The service interface, for type casting the compiled object and fulfilling the export type
* The object model of the service's main object, mostly for function return types

The two function parameters are:
* The [Mongoose model](http://mongoosejs.com/docs/api.html#model-js) instance, created from its according schema (again, from [models.ts](/src/app/db/models.ts))
* An object with a map of the remaining functions that have to be implemented additionally to those of `createPersistingService` to create a full, valid implementation of the service interface.

If this all sounds a bit complicated, think of this structure as a means of creating singleton instances that inherit from a common supertype (`BasicPersistingService`). Due to JavaScript not really being class-based, this implementation is closer to the core and also allows for easy and transparent implementation of a sort of "multiple inheritance" or mixins in the future, should we need it.

## Data Access Objects (DAO)

All the persisting services follow the pattern that their database access functions are declared together in a module which is called a "DAO". Those function could be declared in individual modules, but this would introduce a lot of repetition for example with the import declarations, which are mostly the same. Hence, all database functions of a (live) service share the same module.

The DAO implements all functions which are unique to a certain service, or which can't be implemented generically in [createPersistingService](/src/app/services/createPersistingService.ts).

_Please be aware that at this time of writing, most of the **live** as well as **mock** share the database code. This means that even when executed in "test" environment, the code will try to access the configured database. **This is especially important to remember, because the database tests executed in `run/test --db` will clear all collections and write new objects for testing purposes**._

If you don't want this to happen when executing the tests, tune the database to write to a different destination (means, change the `MONGODB_URL` environment variable either in development mode or test mode, use one for testing (can be overwritten) and one to hold you development data.
