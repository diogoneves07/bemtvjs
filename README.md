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

Bemtv uses a template change detection system instead of detecting changes to variables or properties.

> **IMPORTANT: Bemtv is a recent project that is improving every day and seeking stability, read the releases to stay informed of what has changed.**

> Don't forget to give your star to the project, as this encourages me to continue developing.

## Why Bemtv?

Minimalist, lightweight (even with a markup language and a CSS-in-JS library **integrated into the template**), and a Router.

Fine-grained updates to the real DOM via a template change detection loop that
allows effortless developer reactivity.

---

<p align="center">
<i> “Before you play with Bemtv, do think twice and if you enjoy too much, don't be surprised.”</i>
</p>

---

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
