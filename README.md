<p align='center'>
  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/bemtv?style=for-the-badge">
  <img  src='https://github.com/diogoneves07/bentivejs/blob/main/assets/bemtv-logo-2.png'  alt='Bemtv logo' height='200px'>
  <a href="https://coveralls.io/github/diogoneves07/bemtvjs">
<img alt="Coveralls" src="https://img.shields.io/coverallsCoverage/github/diogoneves07/bemtvjs?label=Test%20coverage&style=for-the-badge">
</a>
</p>

## Translations:

- [Português do Brasil](https://github.com/diogoneves07/bemtvjs/blob/main/translations/README-PT_BR.md)

<hr>

**Bemtv**(Abbreviation of the bird's name [Bem-te-vi](https://pt.wikipedia.org/wiki/Bem-te-vi)) is a JavaScript library that brings a new approach to creating interactive UIs.

> **IMPORTANT: Bemtv is a recent project that is improving every day and seeking stability, read the releases to stay informed of what has changed.**

> Don't forget to give your star to the project, as this encourages me to continue developing.

## What's new?

Currently in the Javascript ecosystem there are excellent tools for developing the user interface. Bemtv reuses much of what these tools brought and brings, however, it is not a copy, it is something totally new.

When looking at a block of code, you will see that the news already starts with the syntax, it may even seem strange at first, but Bemtv's syntax was thought to be minimalist, that is, when doing anything with Bemtv you will only use the number of lines which is really necessary.

Fine-grained updates to the real DOM through template-based reactivity that allows for effortless reactivity.

---

<p align="center">
<i> “Before you play with Bemtv, do think twice and if you enjoy too much, don't be surprised.”</i>
</p>

---

## Key Features

- Cleaner syntax than other UI libraries and frameworks.

- Brackethtml markup language: instead of `<div>Hey!</div>` do this: `div[Hey!]`.

- CSS-In-JS and CSS-In-Template

- Separation of logic related to DOM events from the component template.

- Instead of a common routing system or based on files, Bemtv brings a new innovative routing system that is capable of “transforming” a component into a route automatically according to its use in the application.

- A new way to share data between components through a built-in system.

- Declarative syntactic sugars through the component template.

- Transform functions that separate data structures like Array, Set, Map and Object from their markup for the template.

- Semi-automatic Code-Splitting

- Easy two-way binding between component variables and HTML element properties and attributes

- Hooks

## A brief look

**Counter** component:

```javascript
import { _ } from "bemtv";

const { click$, $, css, template, render } = _`Counter`({ count: 0 });

click$(() => $.count++);

css`
  padding: 20px;
  color: blue;
`;

template`button[Clicked: $count ]`;

render();
```

## Resources

- [Overview](https://dev.to/diogoneves07/bemtvjs-overview-e51)

- [Documentation](https://bemtv.gitbook.io/bemtvjs/)
