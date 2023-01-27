<p align='center'>
  <img  src='https://github.com/diogoneves07/bentivejs/blob/main/assets/bemtv-logo-2.png'  alt='Bemtv logo' height='200px'>
  <a href="https://coveralls.io/github/diogoneves07/bemtvjs">
</a>
</p>

<p align="center">Before you play with Bemtv, do think twice and if you enjoy too much, don't be surprised!
</p>

<p align="center">

<img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/bemtv?style=for-the-badge">

<img alt="Coveralls" src="https://img.shields.io/coverallsCoverage/github/diogoneves07/bemtvjs?label=Test%20coverage&style=for-the-badge">
</p>

## Translations:

- [Português do Brasil](https://github.com/diogoneves07/bemtvjs/blob/main/translations/README-PT_BR.md)

<hr>

## Why Bemtv?

Currently in the Javascript ecosystem there are excellent tools for developing the user interface. Bemtv reuses much of what these tools brought and brings, however, it is not a copy, it is something totally new.

## Key Features

- Cleaner syntax than other UI libraries and frameworks.

- No “props”. A new way for parent component to pass data to child components.

- Instead of a common routing system or based on files, Bemtv brings a new innovative routing system that is capable of “transforming” a component into a route automatically according to its use in the application.

- Separation of logic related to DOM events from the component template.

- Semi-automatic Code-Splitting.

- CSS-In-JS and CSS-In-Template.

- The design of the components allows the export of all the methods belonging to it, which allows the use of these methods in any part of the application.

- Easy two-way binding between component variables and HTML element properties and attributes.

- Hooks.

- Transformation functions that separate data structures like Array, Set, Map and Object from their markup for the template.

- Brackethtml markup language: instead of `<div>Hey!</div>` do this: `div[Hey!]`.

- Declarative syntactic sugars through the component template.

- It's just Javascript, no JSX or build-time needed, just add it to your `index.html` and have fun!

## Show me some code!

All component methods can be exported and used in other parts of the application:

```javascript
import { _ } from "bemtv";

export const { click$, onMount, route, css, template } = _`Home`();
```

> This allows you to separate the component logic into several functions that can use the component's lifecycle, state, manipulate DOM elements, styling, routing, DOM events...

Adding CSS and DOM events:

```javascript
import { _ } from "bemtv";

export const { click$, css, template } = _`Button`();

click$(() => console.log("Clicked!!!"));

css`
  color: blue;
`;

template`button[ I am a button! ]`;
```

Bind element's DOM property with component's:

```javascript
import { _ } from "bemtv";

const { $, template } = _`Input`({
  inputValue: 0,
});

template`input[type="number" $inputValue<value]`;
```

Show a fallback while the component is being imported:

```javascript
import { _ } from "bemtv";

const { template } = _`App`();

template`UserData[](Loading...)`;
```

Creating a route link:

```javascript
import { _ } from "bemtv";

const { template } = _`App`();

template`#AboutUs[ Link to about us ]`;
```

> Bemtv uses an innovative automatic route creation system, this is possible because the components can behave like routes/pages.

Counter component:

```javascript
import { _ } from "bemtv";

export const { click$, $, template } = _`Counter`({ count: 0 });

click$(() => $.count++);

template`button[Clicked: $count ]`;
```

**This is just the tip of the iceberg, many of Bemtv's features really show their power with practice and when combined with others!**

## What's next

Bemtv is a recent and little-known project, I have several ideas to continue the development of it and other projects around it, such as a syntax highlighting extension.

I currently work full time at Bemtv and do not receive any financial compensation, if you like Bemtv please consider supporting the project, your help will determine if the project can continue to reach greater heights.

If you have some free time, come and be part of building Bemtv!

All help is appreciated!

> Don't forget to give your star to the project, as this encourages me to continue developing.
