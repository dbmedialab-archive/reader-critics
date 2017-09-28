# Localization

The multi-language support is based on [the react-intl package](https://github.com/yahoo/react-intl/wiki#locale-data-in-nodejs).
It provides helper files for the most common languages.

## Structure of the language file

All translations are stored in a single file in `resources/localization.json5`.

The file is in JSON5 format and has a hierarchical structure. The first level contains a grouping into different parts of the
whole application, next to a "common" section which contains strings that are used in more than one part.

Currently these sections are:
* `admin` - Admin user interface
* `app` - Backend, localized exceptions and errors, API responses
* `common` - String used in several parts of the app
* `frontend` - The public frontend: feedback and static pages

Inside the top level grouping are several other different groupings that put translations of related topics together. The
innermost structure contains the translated strings as values with the locale as key.

Example:
```
{
	frontend: {
		label: {
			'article-el': {
				paragraph: {
					en: 'Paragraph #{order}',
					nb: 'Avsnitt #{order}',
				},
			},
		},
	},
}
```

Notice the trailing commas and missing quotes on (almost all) of the key definitions. These are features of the JSON5 format
which make it easier to write. You can also expect comments on some of the declarations. When extending the file, you are
encouraged to keep the format in this way.

## Adding a new language

The underlying package uses the [ISO-639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) standard for defining
locales. For the localization to work, it is necessary that the new locale is supported by _react-intl_, otherwise it will use
its fallback mechanism and the results might be unexpected, for example when formatting numbers or dates.

Adding new strings to the language file is quite simple: it basically is adding a new key-value like
```
...
locale: 'translated string',
...
```
to each inner structure that already contains other translated strings.

## Fallbacks

The default fallback if a string cannot be resolved is to display it in English. Also the feedback pages are normally localized
according to the website they are referring to (see multi-hosting support) and thus their primary language is that of the website.
They have an additional fallback for unresolved strings: before going right to English, the system locale is taken first, should
it be different from the website locale.

**Example:** The system locale is set to Norwegian and a feedback page is displayed belonging to a Danish website. So for any
unresolved string, the app will first try to show the Norwegian translation before finally reverting back to English.

