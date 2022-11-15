<p align='center'>
  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/bemtv?style=for-the-badge">
  <img  src='https://github.com/diogoneves07/bentivejs/blob/main/assets/bemtv-logo-2.png'  alt='Bemtv logo' height='200px'>
  <a href="https://coveralls.io/github/diogoneves07/bemtvjs">
  <img alt="Coveralls" src="https://img.shields.io/coveralls/github/diogoneves07/bemtvjs?label=test%20coverage&style=for-the-badge">
  </a>
</p>

## Translations:

- [Português do Brasil](https://github.com/diogoneves07/bemtvjs/blob/main/translations/README-PT_BR.md)

<hr>

**Bemtv**(Abbreviation of the bird's name [Bem-te-vi](https://pt.wikipedia.org/wiki/Bem-te-vi)) is a JavaScript library that brings a new approach to creating interactive UIs.

## Why Bemtv?

Minimalist, lightweight (even with a markup language and a CSS-in-JS library **integrated into the template**), and a Router.

Fine-grained updates to the actual DOM via a template change detection loop that
allows effortless developer reactivity.

Think about it: “Just add Bemtv to your index.html and have fun building your application”.

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

template`button[Cliked: $count ]`;

render();
```

## Installation

### NPM

```bash

npm i bemtv

```

## CDN Links

```html
<script type="module">
  import { _ } from "https://www.unpkg.com/bemtv/dist/bemtv.es.js";
</script>
```

## Documentation

Bemtv allows the developer to use a nice and clean syntax that can be learned in a few minutes rather than hours.

### Introducing Brackethtml

Consider this variable declaration:

```javascript
const btn = `button[Click me!]`;
```

This syntax is a normal `string`, bemtv understands and can convert to HTML, we call it “Brackethtml” it reduces the redundancy of HTML and still can be easily understood as HTML, besides supporting HTML normally.

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

- The `~` symbol must be used inside tags that can contain children to separate attributes and CSS-in-JS from their children and should be used between whitespace:

```javascript
const btn = `h1[color:blue; ~ Hey!] img[src="my-avatar.png"]`;
```

- Tag attributes must always come before CSS-in-JS and use only double quotes `"`:

```javascript
const btn = `button[data-username = "Bemtv" padding:50px; ~Hello!]`;
```

- CSS-in-JS must only use single quotes `'`:

```javascript
const btn = `button[class="hello" font-family:'Courier New'; ~ Click me!]`;
```

#### Special characters

Some characters should be escaped to be used without Brackethtml interpreting them: `~`, `[`, `]`, `#`, `@`, and `$`.

To escape them just wrap them in parentheses `(` `)`:

```javascript
const btn = `button[Click (~) me!]`;
```

### Creating components

To create a component we can import the symbol/function `_`,
it takes the name of the component (using tagged templates) as the first argument which must always start
with an uppercase character (CamelCase) and accepts all alphanumeric characters and the `:` symbol.

```javascript
import { _ } from "bemtv";

_`App`;
```

The component names must be unique, to avoid conflicts we can use the `:` symbol to indicate a component that is related to something:

```javascript
import { _ } from "bemtv";

_`Menu:Links`;
```

### Component instance

The function that creates components returns another function that optionally takes an argument and returns an instance that we will use to access special methods and properties, one of these methods is `template()`:

```javascript
import { _ } from "bemtv";

const { template } = _`App`();
```

#### Defining the template

The `template()` method should be used to define the content that the component renders.

It accepts an argument that must be a `string`, `TemplateStringsArray` or a function:

```javascript
import { _ } from "bemtv";

const { template } = _`App`();

template`Hello world!`;
```

We should only use a function when the content of the template can be changed by a variable above:

```javascript
import { _ } from "bemtv";

let count = 0;

const { template } = _`App`();

setInterval(() => count++, 1000);

template(() => `Count is: ${count}`);
```

#### Rendering

To render the component we can use the `render()` function.

Optionally we can pass a DOM element or a Selector to indicate where the component should be rendered, the default is `document.body`:

```javascript
import { _ } from "bemtv";

const { template, render } = _`App`();

template`Hello world!`;

// It can be called many times
render();
```

Another alternative is to import the `render()` method from the main module, it works similarly, but takes a `string` as the first argument and the render location as the second:

```javascript
import { render } from "bemtv";

const { template } = _`App`();

template`Hello world!`;

render("App[]", "#my-content");
```

### Styling the component

In addition to the style that can be applied directly to the template,
a great option is to use the `css()` method:

```javascript
import { _ } from "bemtv";

const { css, template } = _`App`();

css`
  color: blue;
  font-size: 20px;
`;

template`h1[Hello world!]`;
```

### Isolated and special variables

To create a component that renders values ​​in isolation in each rendering we must pass a second argument to the function that creates components, this must be an object with the properties that will be isolated:

```javascript
import { _ } from "bemtv";

_`Counter`({ count: 0 });
```

These properties behave like isolated variables for each component render.

**We will now refer to these variables as `compVars`(component variables)**

### Super component

One of the goals of creating components is to be able to use them many times in your application.
The instance returned after creating a component is called a SuperComponent, because internally each time the component is used a lightweight instance is created that manages this new rendering of the component, these instances take “control” whenever an action occurs in them where the reaction is the execution of a previously passed callback, normally in Hooks and DOM events.

> Don't worry, it will become clearer as you go through the examples and practice.

### Hooks

Each component instance goes through a series of steps, we can execute functions called hooks in each of these steps:

```javascript
import { _ } from "bemtv";

const { onInit, onMount, onUpdate, onUnmount } = _`App`();

onInit(() => {
  // Called(only once) when the instance is initialized.
});

onMount(() => {
  // Called(only once) after the component template has been mounted in the DOM.
});

onUpdate(() => {
  // Called after the template update is applied to the DOM.
});

onUnmount(() => {
  // Called(only once) after the component is removed/unmounted from the template it was in.
});
```

### Handling events

The event handlers can be used from the component instance its nomenclature is the same as used in [`addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) , however, they must end with a `$` symbol, the arguments received also follow those of `addEventListener()`:

```javascript
import { _ } from "bemtv";

const { click$, mouseover$, $ } = _`Counter`({ count: 0 });

click$(() => $.count++, { capture: true });

mouseover$(() => console.log("Hey!"));
```

Bemtv will manage and add them to the first element it finds in the template.

To remove just call the returned function:

```javascript
import { _ } from "bemtv";

const { click$ } = _`Hey`();

const removeClickListener = click$(() => {});

removeClickListener();
```

### Handling `compVars`

After creating the component and the `compVas` they are available through an object and accessible by the `$` symbol, with which we can access, change the values ​​of the properties and add others.

This is a special object that can only be used in known callbacks of the component instance, it will normally be used in Hooks and in callbacks in DOM events.

```javascript
import { _ } from "bemtv";

const { onInit, $ } = _`Counter`({ count: 0 });

onInit(() => {
  console.log($.count);
});
```

The responsibility of this object is to keep the values ​​isolated for each rendering of the component and **only when necessary** to create clones of data structures such as array, Map, Set and object:

### Using `compVars` in the template

To use `compVars` in the template we will use a special shortcut, using `$` plus the property name/path:

```javascript
import { _ } from "bemtv";

const { $, template } = _`Hero`({
  hero: {
    name: "Black Panther",
  },
});

template`button[Cliked: $hero.name ]`;
```

To mark the property as optional just add a `?` to the end:

```javascript
template`button[Cliked: $hero.name? `;
```

### Variables that are attributes

If a variable has the same name as an attribute and its value is intended for it, we can use the `@` and the variable name so that it is used as the attribute name and value:

```javascript
import { _ } from "bemtv";

const { $, template } = _`Img`({
  src: "avatar.png",
  data: {
    alt: "User avatar",
  },
});

template`img[ @src @data.alt ]`;
```

### DOM Elements

To access a DOM element we use the `useEl()` method, which returns a tuple where the first item is a special key that must be applied to the tag and the second is a function:

```javascript
import { _ } from "bemtv";

const { useEl, template } = _`Hey`();
const [key, getEl] = useEl();

template`h1[ ${key} Hey!]`;
```

> The key can be used anywhere inside the tag's square brackets.

The `getEl()` function should only be called on callbacks known to the component instance,
when calling the function we get an instance that can be used to manipulate the element/tag that has the key:

```javascript
import { _ } from "bemtv";

const { useEl, onMount template } = _`Hey`();
const [key, getEl] = useEl();

onMount(()=>{
  const manageEl = getEl();
})

template`h1[ ${key} Hey!]`;
```

`manageEl` contains useful properties and methods for dealing with the DOM element:

<dl>
  <dt><code>it</code></dt>
  <dd><br>
      <p>Allows access to the actual DOM element, the default value is <code>null</code> and it changes once the element is added to the DOM.</p>
  </dd>
</dl>

<dl>
  <dt><code>css</code></dt>
  <dd><br>
    <p>Allows you to add CSS-in-JS to the element. </p>
      <p>This method can be called even before the element is added to the DOM, the style will be scheduled and applied as soon as the element is available</p>
  </dd>
</dl>

Optionally, the `useEl()` method accepts an argument that can be a DOM element or a selector (will use [querySelector](https://developer.mozilla.org/en-BR/docs/Web/API/Document/querySelector) to find the element), then the method will return the instance:

```javascript
import { _ } from "bemtv";

const { useEl } = _`Hey`();
const manageEl = useEl("#my-app");
```

#### Handling element events

As with the component instance, event handlers can be used from the element instance.

```javascript
import { _ } from "bemtv";

const { useEl, onMount, template } = _`Hey`();
const [key, getEl] = useEl();

onMount(() => {
  const { click$ } = getEl();

  click$(() => {});
});

template`button[ ${key} Click me!]`;
```

### props

Often our components need to receive data from the outside before rendering, props is a common way for parent components to pass values ​​to child components.

to pass props to a component we use the `defineProps()` method, it takes an object as an argument and returns a key that can be used before the component's opening square bracket, then the component will receive the declared props:

```javascript
import { _ } from "bemtv";

const { defineProps, template } = _`Hey`();

const p = defineProps({ src: "user.png" });

template`Avatar${p}[]`;
```

#### Using the props

The `props` are accessible through the `$` object:

```javascript
import { _ } from "bemtv";

const { onInit, $ } = _`Avatar`();

onInit(() => {
  console.log($.props.src);
});
```

#### Handling the props

To manipulate the props we can use the `props()` function that receives a function that will take the props as the first argument and must return the result of the manipulation that will become the props:

```javascript
import { _ } from "bemtv";

const { props, $ } = _`Avatar`();

props((p) => {
  p.src = "my-avatar.png";
  return p;
});
```

#### Props that are attributes

If a prop has the same name as an attribute and its value is intended for it, we can use the `@` and the prop name so that it is used as the attribute name and value:

```javascript
import { _ } from "bemtv";

const { template } = _`Avatar`();

template`img[ @src ]`;
```

### Children of the component

The `children` are accessible through the `$` object they will always be a `string`:

```javascript
import { _ } from "bemtv";

const { onInit, $ } = _`Container`();

onInit(() => {
  console.log($.children);
});
```

#### Manipulating children

To manipulate the `children` we can use the `children()` function which receives a function that will take the `children` as the first argument and must return the result of the manipulation that will become the `children`:

```javascript
import { _ } from "bemtv";

const { children, $ } = _`Avatar`();

children((c) => {
  return c + "Hey!";
});
```

### Sharing data between components

The share API provides a way to share data like this between the component above and all components below it, without having to explicitly pass props between each level.

#### Sharing data

To share the data we use the `share()` method which accepts an object with the properties to be shared:

```javascript
import { _ } from "bemtv";

const { share, $ } = _`App`();

share({ message: "Hey!" });
```

#### Using the data

To use the shared properties we use the `use()` method which accepts a `string` which is the name of the property to be used:

```javascript
import { _ } from "bemtv";

const { onInit, use, $ } = _`Message`();

onInit(() => {
  console.log(use("message")); // Hey!
});
```

#### Re-sharing data

To share and then update the value of a property we can use the `share()` method:

```javascript
import { _ } from "bemtv";

const { share, $ } = _`App`();

share({ message: "Hey!" });
```

And the `reshare()` method which also accepts an object and updates the values ​​that were previously shared:

```javascript
import { _ } from "bemtv";

const { onInit, reshare, $ } = _`Message`();

onInit(() => {
  reshare({ message: "New message!" });
});
```

> The `reshare()` method does not provide new properties, it just updates the existing ones.

### Transformation Functions

When storing values ​​in data structures like array, Map, Set or object we may want to create a markup (Brackethtml) and add it to the template, for that we can use transform functions that inject a property (using Symbol) into the data structure and tells **Bemtv** to transform the data structure only when used in the template.

To create a transformation function we use the `tFn()` function which takes as its first argument a function that must handle the data structure and returns a function.

```javascript
import { tFn } from "bemtv";

const tListJoin = tFn((list) => list.join(" br[] "));
```

To use the function just pass a list and it will return the same list with a Symbol injected:

```javascript
import { _ } from "bemtv";

const tListJoin = tFn((list) => list.join(" br[] "));

const { template } = _`Counter`({
  list: tListJoin(["user1", "user2", "user3"]),
});

template`div[Users: $list ]`;
```

Whenever this list is changed (eg `$.list.push(item)`), Bemtv will detect and use the transform function again and rederize the change.

> The transform functions can be incredibly powerful because with Brackethtml we can even return the CSS-In-JS markup so we can focus on the data structure.

#### Built-in transform functions

```javascript
import { tOl, tUl, tDl } from "bemtv";

// Works with arrays and Sets and transform them into an ordered list.
tOl([] || new Set());

// Works with arrays and Sets and transform them into an unordered list.
tUl([] || new Set());

// Works with objects and Maps and transform them into a definition list.
tDl({} || new Map());
```

Whenever you create a transform function it is good practice to export the normal function that does the transform immediately:

```javascript
import { toOl, toUl, toDl } from "bemtv";

// Works with arrays and Sets and transform them into an ordered list immediately.
toOl([] || new Set());

// Works with arrays and Sets and transform them into an unordered list immediately.
toUl([] || new Set());

// Works with objects and Maps and transform them into a definition list immediately.
toDl({} || new Map());
```

### Keeping the instance running

If inside the hook or the DOM event we need to use a function that does not execute immediately we must use the `keepInst()` function, it wraps the function that must be executed and returns a callback that when executed executes the involved function:

```javascript
import { _ } from "bemtv";

const { click$, keepInst, $, template } = _`Counter`({ count: 0 });

click$(() => {
  setTimeout(
    keepInst(() => $.count++),
    1000
  );
});

template`button[Cliked: $count ]`;
```

### FunctionalComponent

Bemtv allows a second way to create components, using a function this function will be called whenever the component is used and will receive as an argument a new instance of the SuperComponent, so we don't need to use `keepInst()`.

The first form we've shown so far is called **CleanComponent**, as the component's construction is visually cleaner and the second form is **FunctionalComponent** because it uses a function to encapsulate the component's construction. We currently prefer CleanComponent, but feel free to choose the one that best fits a given component.

When using the FunctionalComponent, it will return an instance that has a `render()` method.

**FunctionalComponent:**

```javascript
const { render } = _`Counter`(({ click$, css, template }) => {
  let count = 0;

  click$(() => count++);

  css`
    padding: 20px;
    color: red;
  `;

  template(() => `button[Cliked: ${count} ]`);
});

render();
```

**CleanComponent:**

```javascript
import { _ } from "bemtv";

const { click$, $, css, template, render } = _`Counter`({ count: 0 });

click$(() => $.count++);

css`
  padding: 20px;
  color: blue;
`;

template`button[Cliked: $count ]`;

render();
```

### Using a fallback

The `match()` function can be used to present an alternative while a certain component is not available, it accepts two arguments, the first is the component, if available, is returned as a value, and the second argument that must be a `string` that is only used as a return if the component is not available:

```javascript
import { _ } from "bemtv";

const { template } = _`Hero`();

template(() => `Dados: ${match("Data[]", "<div>Carregando...</div>")}`);
```

> **This function will trigger auto-import if the component is auto-import**.

### Router

A Router is used for navigation between views of various components
in a Bemtv application, allows you to change the browser's URL and keeps the UI synchronized with the URL.

#### Creating a route

To create a route we must add a function to the Router object which is a Proxy.

This function takes the same arguments as the `match()` function and has the same behavior.

The function name must be written in CamelCase, but when the route is added to the URL it will be in kebab-case:

```javascript
import { router } from "bemtv";

router.FirstPage("strong[Hey!]");
```

##### Using an object for the route

We can define properties to define the behavior of the route:

```javascript
import { router } from "bemtv";

router.FirstPage({
  use: "Hello world!", // Required. What the route should display.

  title: "Hey!", // The title of the document.

  concat: "1234567/hey/89", // Allows you to concatenate a `string` in the route link
});
```

> We can also pass an object as the second argument of the route, but it doesn't support the `concat` property.

#### Rendering routes

To use the created routes we must have a place where its content can be rendered, for that we can use the `#` symbol:

```javascript
import { _ } from "bemtv";

const { template } = _`App`();

template`#[]`;
```

#### Creating links to routes

To create links that, when accessed, will take the user to the route, we can use the `#` symbol plus the route name, similar to a component:

```javascript
import { _ } from "bemtv";

const { template } = _`App`();

template`#FirstPage[I am a link!]`;
```

Everything inside the `#FirstPage[]` component will be wrapped in an `a` tag with the `href` attribute linking to the route.

The return of the route function which is a function that whenever it is called will take the user to the route:

```javascript
import { router } from "bemtv";

const goToFirstPage = router.FirstPage("strong[Hey!]");
```

#### Capturing errors

Whenever the route is unknown, Bemtv will warn you through the `onRouteUnfound()` function which accepts a listener/callback as the first argument:

```javascript
import { onRouteUnfound } from "bemtv";

onRouteUnfound(() => {
  console.log("We are on an unknown route :(");
});
```

### Checking available components

To check if a component is available, we can use the `hasComponent()` method which accepts an argument that is the name of the component:

```javascript
import { hasComponent } from "bemtv";

if (hasComponent("App")) {
  //...
}
```

### Bootstrapping a Bemtv App

We recommend creating an initialization file and importing all the components you will need into it, ensuring that all components have already been imported:

`bootstrap.js`:

```javascript
import "./components/Counter";
import "./components/Message";
```

### Code-Splitting

To automate the component import process, Bemtv offers the `autoImportComponents()` function which accepts an object where the properties name must be the components name and their values ​​must be a function that imports the component using [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import):

```javascript
import { autoImportComponents } from "bemtv";

autoImportComponents({
  Counter() {
    import("./components/Counter");
  },
});
```

Bemtv will import the component as soon as the component is used in a template, however, it will ignore the component until it is available.

## And that’s it

Thanks for getting here, if you have any questions, suggestions or want to help the project in other ways, just get in touch, soon news and improvements will come!

Don't forget to give the project your star up, as it encourages us to keep developing, see you soon!
