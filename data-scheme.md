# Backend Data Scheme

## Entities

#### Customer / Organisation

* `name` (string)
* _Indexing configuration_

#### Author

* `name` (string)
* `e-mail address` (string)
* 1..n :arrow_right: Organisation
* _possible extension: account information for login_

#### Article

* `permalink url`
* `client version` (string)
* `internal version` (int) _for ordering of arbitrary client version string, like UUIDs_
* `date` (datetime)
* m..n :arrow_left: :arrow_right: Author

#### Article Tags

* `text` (string)
* 1..n :arrow_right: Article

#### Article Element

* `order` (int) _to keep the element order within an article_
* `type` (enum) _like "headline", "image", "paragraph"_
* `metadata` (json) _element specific data like "text" for a paragraph or "caption" for an image_
* 1..n :arrow_right: Article

#### User Comment

* `text` (string)
* m..n :arrow_left: :arrow_right: Article Element
* 1..n :arrow_right: User Feedback

#### User Feedback

* `date` (datetime)
* `metadata` (json) _tracking information specific to this feedback_
* 1..n :arrow_right: User

#### User

* `user name` _or UUID from session cookie if anonymous_
* `real name` _or *null* if anonymous_
* `e-mail address`
* `metadata` (json) _tracking information_
* _possible extension: account information for login_

## Possible extensions

* Account information for login on `Author` and `User`
* `Administrators` table for users with privileges; cross-referenced with `Author` or individual?
* Messaging between `Author`s and `User`s
