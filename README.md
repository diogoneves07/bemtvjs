<p align='center'>
  <img  src='https://github.com/diogoneves07/bentivejs/blob/main/assets/bemtv-logo.png'  alt='Bemtv logo'>
</p>

<br>
<p align='center'>
<a href="https://coveralls.io/github/diogoneves07/bemtvjs">
  <img alt="Coveralls" src="https://img.shields.io/coveralls/github/diogoneves07/bemtvjs?label=test%20coverage&style=for-the-badge">
  </a>
</p>

## Translations:

- [Português do Brasil](https://github.com/diogoneves07/bemtvjs/blob/main/translations/README-PT_BR.md)

<hr>

**Bemtv**(Abbreviation of the bird's name [Bem-te-vi](https://pt.wikipedia.org/wiki/Bem-te-vi)) is a JavaScript library that brings a new approach to creating interactive UIs.

Basically, it's the combination of
[Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy),
[Template literals (Template strings)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
added to syntactic sugars
and orchestrated “automagically” by a
[requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) loop.

## Why Bemtv?

Slightly opinionated, minimalistic, lightweight(<img alt="npm bundle size" height='20px' padding="0" src="https://img.shields.io/bundlephobia/minzip/bemtv?style=flat-square">) even with a markup language
and a CSS-in-JS library **integrated into the template**, and a Router,
fine-grained updates to the real DOM via a template change detection loop that
allows effortless reactivity.

Currently, the main objective is to be a tool specialized in the development of **small web applications**,
allowing the developer to use a great syntax,
direct and that can be learned in a few minutes rather than hours,
think about: “Just add Bemtv to your index.html and have fun building your application”.

## A brief look

**Counter** component:

```javascript
import { _ } from "bemtv";

_("Counter", ({ click$ }) => {
  let count = 0;

  click$(() => count++);

  return () => `button[Cliked: ${count}]`;
}).render();
```

<hr />

> **Please, if you liked the project, don't leave without leaving your star! it encourages us to keep developing.**

<hr />

<br>

<details>
  <summary><h2>Releases</h2></summary>
  <br>

- **v0.5.0**
  - [Router](#router) added!

</details>

<details>
  <summary><h2>Table of contents</h2></summary>

- [Installation](#installation)
- [Behavior(Under the hood)](#behaviorunder-the-hood)
- [Documentation](#documentation)
  - [Introducing Brackethtml](#introducing-brackethtml)
    - [Why Brackethtml?](#why-brackethtml)
    - [Brackethtml + CSS-in-JS (goober)](#brackethtml--css-in-js-goober)
    - [Usage rules](#usage-rules)
    - [Special characters](#special-characters)
  - [Components](#components)
    - [Rendering a Component](#rendering-a-component)
    - [Composing Components](#composing-components)
    - [Checking available components](#checking-available-components)
    - [Props](#props)
    - [Component children](#component-children)
    - [Stateful and stateless components](#stateful-and-stateless-components)
      - [Stateful](#stateful)
      - [Stateless](#stateless)
    - [Sharing data between components](#sharing-data-between-components)
      - [Sharing data](#sharing-data)
      - [Using data](#using-data)
      - [Re-sharing data](#re-sharing-data)
      - [Behavior(Under the hood)](#behaviorunder-the-hood-1)
      - [Data between components(Advanced)](#data-between-componentsadvanced)
  - [Handling events](#handling-events)
  - [DOM elements](#dom-elements)
    - [Handling element events](#handling-element-events)
  - [Lifecycle Hooks](#lifecycle-hooks)
    - [onMount](#onmount)
    - [onUpdate](#onupdate)
    - [onUnmount](#onunmount)
  - [Bootstrapping a Bemtv App](#bootstrapping-a-bemtv-app)
  - [Code-Splitting](#code-splitting)
  - [Using fallback](#using-fallback)
  - [Router](#router)
    - [Creating a route](#creating-a-route)
    - [Rendering routes](#rendering-routes)
    - [Creating links to routes](#creating-links-to-routes)
- [And That’s It](#and-thats-it)

</details>
<br>

## Installation

```bash

npm i bemtv

```

## Behavior(Under the hood)

The approach used to create components differs from the conventional one, we basically use the power of [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) and orchestrate the calls with a [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) loop:

```javascript
import { _ } from "bemtv";

_("Counter", () => {
  let count = 0;

  setInterval(() => count++, 1000);

  return function templateCreator() {
    return `button[Cliked: ${count}]`;
  };
}).render();
```

In the example above, notice that the `templateCreator()` function
is a **Closure**, which means it has access to the function scope external to it.
With that, whenever it is called it will return the _“Template string”_ with the most recent value of the variable `count`.

<del>
After creating the component, Bemtv starts calling the `templateCreator()` function every time before the next browser repaint and compares the _“Template string”_ with its previous value to determine if the template has changed.
</del>

<br/>
<br/>

As of **v0.3.0**, Bemtv uses a more sophisticated system to determine if there have been any changes to the template, continues using the browser repaint as a base, but reduces the number of checks as the user interacts with the page and the time the component takes to generate the template, this makes Bemtv much more efficient.

At first, we might think that this will overload the browser, however, there are best practices that we should follow to avoid this:

- Everything inside the template should be strings, numbers or light calculations.

- The function that generates the template must only be used for this.

By following these recommendations, your application will not be overloaded.

## Documentation

Bemtv strives to be minimalist and powerful,
the documentation is small enough to fit in this README,
but full of features like its own markup language,
CSS-in-JS library ([goober](https://github.com/cristianbote/goober)) **integrated into the template**,
DOM event management system,
Innovative API for sharing data between components,
lifecycle methods and syntactic sugars that will bring a great developer experience!

### Introducing Brackethtml

Consider this variable declaration:

```javascript
const btn = `button[Click me!]`;
```

This weird syntax is a normal `string`, but our library understands it and can convert it to HTML, we call it “Brackethtml”.

The equivalent HTML would be:

```javascript
const btn = `<button>Click me!</button>`;
```

#### Why Brackethtml?

The main goal is to reduce the redundancy of HTML and still be easily understandable as HTML.

Brackethtml supports HTML normally and you can even mix the two if you need to.

Basically, in the previous examples,
we removed the need for a closing tag for the `button` tag.

> We recommend that you give it a try because it is very similar to HTML and we want it to be an important feature of our library.

#### Brackethtml + CSS-in-JS ([goober](https://github.com/cristianbote/goober))

Brackethtml already comes with a built-in CSS-in-JS library. In the previous examples, if we wanted to add some style to our button we could do:

```javascript
const btn = `button[color:blue; ~ Click me!]`;
```

#### Usage rules

The list below describes the usage rules:

- The HTML tag name must be followed by square brackets:

```javascript
const btn = `button[]`;
```

- If the `~` symbol is not present, everything inside the tag's square brackets will be understood as its children:

```javascript
const btn = `h1[ span[ Hello world! ] ]`;
```

- The `~` symbol is responsible for separating the attributes and CSS-in-JS from the tag's children and must be used between whitespace:

```javascript
const btn = `button[color:blue; ~ Click me!]`;
```

- Everything before the `~` symbol is considered attributes and/or CSS-in-JS:

```javascript
const btn = `button[padding:50px; ~]`;
```

- Tag attributes must always come before CSS-in-JS:

```javascript
const btn = `button[data-username = "Bemtive" padding:50px; ~  Hello!]`;
```

- Attributes must only use double quotes `"`:

```javascript
const btn = `button[class="hello" ~ Click me!]`;
```

- CSS-in-JS must only use single quotes `'`:

```javascript
const btn = `button[class="hello" font-family:'Courier New'; ~ Click me!]`;
```

#### Special characters

Some characters must be escaped to be used without Brackethtml interpreting them
: `~`, `[` e `]`.

To escape them just wrap them in parentheses "()":

```javascript
const btn = `button[Click (~) me!]`;
```

```javascript
const btn = `button[Click ([) me!]`;
```

```javascript
const btn = `button[Click (]) me!]`;
```

```javascript
const btn = `button[Click ([]) me!]`;
```

> From now on you can interpret and use Brackethtml. We expect your productivity to increase considerably.

> In the near future, it would be awesome to have an extension that could highlight Brackethtml according to its rules, making it easier to visually separate each part.

### Components

Components let you split the UI into independent, reusable pieces, and think about each piece in isolation.

To create a component we can import the `_` symbol which is an alias of the `Component` function of the same module:

```javascript
import { _, Component } from "bemtv";

// They work the same way:

_("Counter", () => {});

Component("Counter", () => {});
```

> Throughout this documentation the examples will prefer the `_` symbol, however, feel free to choose in your projects.

The function accepts two arguments:

<dl>
  <dt><code>name</code></dt>
  <dd><br>
    <p>A <code>string</code> that is the name of the component.</p>
  </dd>
</dl>

It must always start with an uppercase character (CamelCase) and accepts all alphanumeric characters and the `:` symbol.

Component names act as a key to access their functions and therefore must be unique, to avoid conflicts you can use the `:` symbol to indicate a component that is related to something:

```javascript
import { _, Component } from "bemtv";

_("Jquery:Ajax", (self) => console.log(self.name));
// OR

_("Menu:Links", (self) => console.log(self.name));
```

<dl>
  <dt><code>componentManager</code></dt>
  <dd><br>
    <p>The <code>function</code> responsible for managing the component instance.</p>
  </dd>
</dl>

It must always return a `string` or a function that returns a `string`.

This function will get the component instance as its first and only argument.

```javascript
import { _, Component } from "bemtv";

_("Counter", (componentInstance) => console.log(componentInstance));
```

### Rendering a Component

After declaring the component, the returned instance has a `render()` method that can be called to render the component somewhere on the page:

```javascript
import { _ } from "bemtv";

_("Counter", () => `h1[Hello world!]`).render();
```

This method optionally accepts an argument that indicates an element or a selector (will use [querySelector](https://developer.mozilla.org/pt-BR/docs/Web/API/Document/querySelector) to find the element) to insert the component(Default is `document.body`) and returns the same instance.

We can also import the `render()` function which works in a similar way:

```javascript
import { _, render } from "bemtv";

_("Counter", () => `h1[Hello world!]`);

render("Counter", "#app");
```

The difference is that it accepts a template as the first argument and optionally a selector as the second.

### Composing Components

Components can refer to other components in their output. This lets us use the same component abstraction for any level of detail.

For example, we can create an App component that renders `Welcome` many times:

```javascript
import { _, render } from "bemtv";

_("Welcome", () => `h1[Hello world!] br[]`);

_("App", () => `Welcome[] Welcome[] Welcome[]`);

render("App", "#app");
```

### Checking available components

To check if a component is available, we can use the `hasComponent()` method which accepts an argument that is the name of the component:

```javascript
import { hasComponent } from "bemtv";

if (hasComponent("App")) {
  //...
}
```

### Props

Often our components need to receive data from the outside before rendering, props is a common way for parent components to pass values ​​to child components.

Normally in other libraries and frameworks props are passed as attributes of the child component, however, in our library this would not be possible, as it would only be possible to pass values ​​of type `string` or `number`.

to pass props to a component, we use the `defineProps()` method which is available in the component instance:

```javascript
import { _, render } from "bemtv";

_("App", ({ defineProps }) => {
  const key = defineProps({ message });

  return `Message${key}[]`;
});
```

The `defineProps()` method accepts an object as an argument and returns a key that can be used before the component's opening square bracket, so the component will receive the declared props:

```javascript
import { _, render } from "bemtv";

_("Message", ({ props }) => {
  const { message } = props;

  return `h1[${message}] br[]`;
});
```

We could also use the `p` property which is an alias of `props`:

```javascript
import { _, render } from "bemtv";

_("Message", ({ p }) => {
  const { message } = p;

  return `h1[${message}] br[]`;
});
```

### Component children

Components can also group children, but the parent component must decide whether to add them to its template.

The component can access its children via the `children` property which will always be a `string`:

```javascript
import { _, render } from "bemtv";

_("Message", ({ children }) => `h1[${children}]`);

_(
  "App",
  () => `
    Message[ Hello ]  br[]
    Message[ world ]  br[]
    Message[ !!! ]`
).render();
```

### Stateful and stateless components

There is a distinction between stateful and stateless components:

#### Stateful

Stateful components are those that return a function because their template is mutable:

```javascript
import { _, render } from "bemtv";

_("Counter", () => {
  let count = 0;

  setInterval(() => count++, 1000);

  return () => `Counter: ${count}`;
});
```

#### Stateless

Stateless components are those that return a `string` because their template will never change after being generated:

```javascript
import { _, render } from "bemtv";

_("Welcome", ({ props }) => {
  const { message } = props;

  return `strong[${message}]`;
});
```

### Sharing data between components

We can use props to pass data from the parent component to its children, but this usage can be cumbersome for certain types of props (like local preferences or UI theme), which are used by many components within the application.

The Sharing API provides a way to share data like this between the component above and all components below it, without having to explicitly pass props between each level.

#### Sharing data

To share the data we use the `share()` method which accepts an object with the properties to be shared:

```javascript
import { _, render } from "bemtv";

_("Parent", ({ share }) => {
  share({ message: " Hello world! " });

  return `Child[]`;
});
```

#### Using data

To use the shared properties we use the `use()` method which accepts a `string` which is the name of the property to be used:

```javascript
import { _, render } from "bemtv";

_("Child", ({ use }) => `strong[${use("message")}]`);
```

#### Re-sharing data

In some situations we may need the child component to fetch data and update, however while this data is not available the parent component should set a default value and once the data is available the child component should be able to change it.

For this we can use the `share()` method combined with the `reshare()` method which also accepts an object and updates the values ​​that were previously shared:

```javascript
import { _, render } from "bemtv";

_("Message", ({ reshare }) => {
  let message = "";

  setTimeout(() => {
    message = "Hello world!";
    reshare({ message });
  }, 1000);
  return () => `strong[The message is: ]`;
});

_("Parent", ({ share, use }) => {
  share({ message: "" });
  return () => `Message[] ${use("message")}`;
});
```

> It is important to remember that the `reshare()` method does not provide new properties, it just updates the existing ones.

#### Behavior(Under the hood)

Data sharing works by hierarchy, the component above shares the data with itself and everyone below it.

As a result, some questions may arise:

**What happens if multiple components that are above each other share the same property?**

The component below will consume the property of the closest component above.

> However, it is a good practice when sharing data between components to avoid repeating the name of properties.

The same happens when re-sharing a property, the updated value will be that of the closest component above.

<details>
  <summary><h4>Data between components(Advanced)</h4></summary>

[Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) can give access to values ​​contained in components so that the returned value will always be up to date.

First let's declare a Counter component:

```javascript
import { _ } from "bemtv";

_("Counter", () => {
  let count = 0;

  const getCounterValue = () => count;

  setInterval(() => count++, 1000);

  return () => `Current value: ${count}`;
});
```

Note within it the `getCounterValue()` function which, when called, will return the most recent value of the `count` variable, however we need to make it accessible from outside the component, for that we will use the `reshare()` method:

```javascript
import { _ } from "bemtv";

_("Counter", ({ reshare }) => {
  let count = 0;

  const getCounterValue = () => count;

  setInterval(() => count++, 1000);

  reshare({ getCounterValue });

  return () => `Current value: ${count}`;
});
```

The `reshare()` method will do the following, if a component above has shared a `getCounterValue()` property or method, update it with this new value.

Next, we'll create a DoubleCounter component that will use the `getCounterValue()` method to access the current value of the counter:

```javascript
import { _ } from "bemtv";

_("DoubleCounter", ({ use }) => {
  return () => ` Double value: ${use("getCounterValue")() * 2}`;
});
```

We can make use of the method inside DoubleCounter's template because its call results in light computation, however, if we run this code now, DoubleCounter would not have access to `getCounterValue()` because it can only access data shared by itself or by components above it.

To solve this we have to create a component that is above Counter and DoubleCounter:

```javascript
import { _ } from "bemtv";

_("App", () => `Counter[] br[] DoubleCounter[] `).render();
```

The component above the others has another responsibility to share the values, thus setting the default values:

```javascript
import { _ } from "bemtv";

_("App", ({ share }) => {
  share({ getCounterValue: () => 0 });

  return () => `Counter[] br[] Current value * 2: DoubleCounter[] `;
}).render();
```

The above steps describe that the above component sets the properties and
the components below can access and/or change them.

</details>

### Handling events

Handling events in Bemtv is very similar to handling events using
[addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener).

Event handlers can be injected into the component instance as a method and their naming is the same as in `addEventListener()`, however they must end with a `$` symbol.

When injecting event handlers into the component instance, Bemtv will add them to the first element it finds in the template:

```javascript
import { _ } from "bemtv";

_("Counter", ({ reshare, click$ }) => {
  let count = 0;

  click$(() => count++, {} /* AddEventListenerOptions */);

  return () => `button[Clicked: ${count}]`;
});
```

The accepted arguments also follow those of `addEventListener()`.

Bemtv will manage the event handlers and if the template changes, if necessary, it can add them again.

### DOM elements

It may be necessary to access the DOM element, for this we can use the `el()` method, which returns a tuple where the first item is an object and the second is the key that should be applied to the element:

```javascript
import { _ } from "bemtv";

_("Counter", ({ el }) => {
  const [btnManager, btnKey] = el();

  return () => `button[ ${btnKey}  My button]`;
});
```

The key can be used anywhere inside the tag's square brackets.

Optionally, the `el()` method accepts an argument that can be a DOM element or a selector (will use [querySelector](https://developer.mozilla.org/pt-BR/docs/Web/API/Document/querySelector) to find the element), then the method will only return one object:

```javascript
import { _ } from "bemtv";

_("Counter", ({ el }) => {
  const btnManager = el("#button");

  return () => `button[ id='button' ~ My button]`;
});
```

> If it is a selector, the element will be available once the component is mounted

The `btnManager` contains useful properties and methods for dealing with the DOM element:

<dl>
  <dt><code>it</code></dt>
  <dd><br>
     <p>Allows access to the actual DOM element, the default value is <code>null</code> and changes once the element is added to the DOM.</p>
  </dd>
</dl>

```javascript
import { _ } from "bemtv";

_("Counter", ({ el }) => {
  const [btnKey, btnManager] = el();

  setTimeout(() => btnManager.it.click());

  return () => `button[ ${btnKey}  My button]`;
}).render();
```

<dl>
  <dt><code>css</code></dt>
  <dd><br>
     <p>Allows you to add CSS-in-JS to the element. </p>
      <p>This method can be called even before the element is added to the DOM, the style will be scheduled and applied as soon as the element is available</p>
  </dd>
</dl>

```javascript
import { _ } from "bemtv";

_("Counter", ({ el }) => {
  const [btnKey, btnManager] = el();

  btnManager.css`color:blue;`;

  return () => `button[ ${btnKey}  My button]`;
}).render();
```

> This method is identical to the [goober - css()](https://goober.js.org/api/css/) method (see more details in the goober documentation)

#### Handling element events

As with the component instance, event handlers can be injected into the element instance (`btnManager`) as a method and their naming is the same as used in `addEventListener()`, however they must end with a `$` symbol .

```javascript
import { _ } from "bemtv";

_("Counter", ({ el }) => {
  const [btnKey, btnManager] = el();

  btnManager.click$(
    () => console.log("Clicked!"),
    {} /* AddEventListenerOptions */
  );

  return () => `button[ ${btnKey}  My button]`;
}).render();
```

### Lifecycle Hooks

Each instance of the Bemtv component goes through a series of steps. Along the way, it also runs functions called lifecycle hooks, giving users the opportunity to add their own code at specific stages.
.

#### onMount

Called only once after template elements are added to the DOM:

```javascript
import { _ } from "bemtv";

_("Counter", ({ onMount }) => {
  onMount(() => console.log("Mounted!"));

  return () => `button[ My button]`;
}).render();
```

#### onUpdate

Called whenever the template is changed and the changes are applied to the DOM:

```javascript
import { _ } from "bemtv";

_("Counter", ({ onMount }) => {
  let count = 0;

  setTimeout(() => (count = 1));

  onUpdate(() => console.log("Updated!"));

  return () => `button[value: ${count}]`;
}).render();
```

#### onUnmount

Called only once after all template elements have been removed from the DOM and component instance will be destroyed:

```javascript
import { _ } from "bemtv";

_("Counter", ({ onUnmount }) => {
  onUnmount(() => console.log("Unmounted!"));

  return () => `button[ My button]`;
}).render();
```

### Bootstrapping a Bemtv App

At Bemtv, components are declared globally and used from their declaration key (the component name), so we can use a component without importing its module as long as it has already been imported at some point in the application.

To ensure that a component has been imported, we can simply import it into the module where we want to use it:

```javascript
import "./components/Counter";

_("App", () => `Counter[]`).render();
```

> Note that the import only targets module side effects, ie component creation.

This practice will work very well, however, it can be tedious to do this in all the modules you will need the component, another solution is to create an initialization file and import all the components you will need into it:

`bootstrap.js`:

```javascript
import "./components/Counter";
import "./components/Message";
import "./components/HelloWorld";
import "./components/Menu";
import "./components/Footer";
import "./components/Header";
```

And in your application's main file, import the file that imports the components:

`main.js`:

```javascript
import "./bootstrap";

/* ... */
```

### Code-Splitting

To avoid sending components that at first may be unnecessary for the user, we can use [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)( dynamic import), which allows us to import a module at any time in our application.

To automate the component import process, Bemtv offers the `autoImportComponents()` function that accepts an object where the name of the properties must be the name of the components and their values ​​must be a function that imports the component using dynamic import:

```javascript
import { autoImportComponents } from "bemtv";

autoImportComponents({
  Counter() {
    import("./components/Counter");
  },
  Message() {
    import("./components/Message");
  },
});
```

Bemtv will import the component as soon as the component is used in a template, however, it will ignore the component until it is available.

```javascript
import { _ } from "bemtv";

_("App", () => () => `A messagem é: Message[]`).render();
```

In the example above, initially the page would display “Message is:”, as the `Message` component had not yet been downloaded, but as soon as it is available the template will be updated and the page will also display the `Message` component template.

### Using fallback

The `match()` function can be used to present an alternative while a certain component is not available, it accepts two arguments, the first is the component, if available, is returned as a value, and the second argument that must be a `string` that is only used as a return if the component is not available:

```javascript
import { _, match } from "bemtv";

_("App", () => () => {
  return `
        Dados: 
        ${match("Data[]", "<div>Carregando...</div>")}`;
}).render();
```

> This function is optimized so that we can use it directly in the template.

> **This function will trigger auto-import if the component is auto-import**.

### Router

A Router is used for navigation between views of various components
in a Bemtv application, allows you to change the browser's URL and keeps the UI synchronized with the URL.

To use the router, we should import the Router object:

```javascript
import { r, router } from "bemtv";
```

Note the `r` and `router` objects they are the same object the `r` is just a writing shortcut.

> Examples will prefer to use `r`, but feel free to choose.

#### Creating a route

To create a route we must add a function to the Router object.

This function takes the same arguments as the function [`match()`](#using-fallback) and has the same behavior in relation to the components.

The function name must be written in CamelCase, but when the route is added to the URL it will be in kebab-case.

The object is a Proxy, so we don't need to use the `=` assignment sign, we can just call the function:

```javascript
import { r } from "bemtv";

r.FirstPage("strong[Hey!]");
```

#### Rendering routes

To use the created routes we must have a place where its content can be rendered, for that we can use the Router component that does not need to be imported and can be used through the `#` symbol:

```javascript
import { _ } from "bemtv";

_("App", () => `#[]`);
```

The Router component is a normal component and can be reused many times. Once a route has been accessed, its content will be rendered in the Router component.

#### Creating links to routes

To create links that, when accessed, will take the user to the route, we can use the `#` symbol plus the route name, similar to a component:

```javascript
import { _ } from "bemtv";

_("HelloWorld", () => `#FirstPage[I am a link!]`);
```

Everything inside the `#FirstPage[]` component will be wrapped in an `a` tag with the `href` attribute pointing to the route.

ex:

```html
<a href="#/first-page">I am a link!</a>
```

There are situations where we may want to take the user to a certain route after a DOM event or something similar, for that we can use the return of the route function which is a function that whenever it is called will take the user to the route:

```javascript
import { r, _ } from "bemtv";

const goToFirstPage = r.FirstPage("strong[Hey!]");

_("App", ({ click$ }) => {
  click$(goToFirstPage);

  return `
      button[Click me!]
      br[] br[]

      #[]`;
});
```

## And that’s it

Thanks for getting here, if you have any questions, suggestions or want to help the project in other ways, just get in touch, soon news and improvements will come!

Don't forget to give the project your star up, as it encourages us to keep developing, see you soon!
