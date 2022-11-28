<p align='center'>
  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/bemtv?style=for-the-badge">
  <img  src='https://github.com/diogoneves07/bentivejs/blob/main/assets/bemtv-logo-2.png'  alt='Bemtv logo' height='200px'>
  <a href="https://coveralls.io/github/diogoneves07/bemtvjs">
  <img alt="Coveralls" src="https://img.shields.io/coverallsCoverage/github/diogoneves07/bemtvjs?label=Test%20coverage&style=for-the-badge">

  </a>
</p>

**Bemtv**(Abreviação do nome do pássaro [Bem-te-vi](https://pt.wikipedia.org/wiki/Bem-te-vi)) é uma biblioteca JavaScript que traz uma nova abordagem para a criação de UIs interativas.

Bemtv utiliza um sistema de detecção de alterações no template, ao invés de detectar alterações em variáveis ​​ou propriedades.

> **IMPORTANTE: A Bemtv é um projeto recente que está melhorando a cada dia e buscando a estabilidade, leia os lançamentos para ficar informado do que mudou.**

> Não se esqueça de dar sua estrela ao projeto, pois isso me incentiva a continuar desenvolvendo.

## Por que Bemtv?

Minimalista, leve(mesmo com uma linguagem de marcação e uma biblioteca CSS-in-JS **integrada ao template**), e um Router.

Atualizações refinadas para o DOM real por meio de um loop de detecção de alteração no template que
permite reatividade sem esforço do desenvolvedor.

Pense em: “Apenas adicionar a Bemtv ao seu index.html e se divertir construindo sua aplicação”.

## Um breve olhar

Componente **Counter**:

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

## Instalação

### Início rápido (recomendado)

Podemos iniciar um aplicativo simples executando o seguinte em seu terminal:

Bemtv App Javascript:

```bash
npx degit diogoneves07/bemtv-templates/js  my-app
cd my-app
npm i # ou fio ou pnpm
npm run dev # ou yarn ou pnpm
```

Bemtv App TypeScript:

```bash
npx degit diogoneves07/bemtv-templates/ts my-app
cd my-app
npm i # ou fio ou pnpm
npm run dev # ou yarn ou pnpm
```

Isso criará um aplicativo mínimo renderizado pelo cliente desenvolvido por [Vite](https://vitejs.dev/).

### NPM

```bash

npm i bemtv

```

### CDN Links

```html
<script type="module">
  import { _ } from "https://www.unpkg.com/bemtv/dist/bemtv.es.js";
</script>
```

> O link CDN acima sempre fornecerá a versão mais recente da Bemtv.

## Documentação

Bemtv permite ao desenvolvedor utilizar uma sintaxe agradável, limpa e que possa ser aprendida em poucos minutos e não em horas.

### Introduzindo Brackethtml

Considere esta declaração de variável:

```javascript
const btn = `button[Click me!]`;
```

Essa sintaxe é chamada de “Brackethtml” ela de reduz a redundância do HTML e ainda pode ser facilmente entendida como HTML, além de suportar HTML normalmente.

#### Brackethtml + CSS-in-JS ([goober](https://github.com/cristianbote/goober))

A Brackethtml já vem com uma biblioteca CSS-in-JS integrada(built-in), Nos exemplos anteriores, se quiséssemos adicionar algum estilo ao nosso botão poderíamos fazer:

```javascript
const btn = `button[color:blue; ~ Click me!]`;
```

#### Regras de uso

A lista abaixo descreve as regras de uso:

- O nome da tag HTML deve ser seguido por colchetes:

```javascript
const btn = `button[]`;
```

- O símbolo `~` deve ser usado dentro de tags que podem conter filhos para separar atributos e CSS-in-JS de seus filhos e deve ser usado entre espaços em branco:

```javascript
const btn = `h1[color:blue; ~ Hey!] img[src="my-avatar.png"]`;
```

- Os atributos da tag devem sempre vim antes do CSS-in-JS e usar apenas aspas duplas `"`:

```javascript
const btn = `button[data-username = "Bemtv" padding:50px; ~  Hello!]`;
```

- O CSS-in-JS devem usar apenas aspas simples `'`:

```javascript
const btn = `button[class="hello" font-family:'Courier New'; ~ Click me!]`;
```

#### Caracteres especiais

Alguns caracteres devem ser escapados para serem usados ​​sem que a Brackethtml os interprete: `~`, `[`, `]`, `#`, `@`, e `$`.

Para escapá-los basta envolvê-los entre parênteses `(` `)`:

```javascript
const btn = `button[Click (~) me!]`;
```

### Criando componentes

Para criar um componente podemos importar o símbolo/função `_`,
ela recebe o nome do componente(usando tagged templates) como primeiro argumento que deve sempre começar
com um caractere maiúsculo (CamelCase) e aceita todos os caracteres alfanuméricos e o símbolo `:`.

```javascript
import { _ } from "bemtv";

_`App`;
```

Os nomes dos componentes devem ser únicos, para evitar conflitos podemos usar o símbolo `:` para indicar um componente que esteja relacionado a algo:

```javascript
import { _ } from "bemtv";

_`Menu:Links`;
```

### Instância do componente

A função que cria componentes retorna outra função que opcionalmente recebe um argumento e retorna uma instância que usaremos para acessar métodos e propriedades especiais, um desses métodos é o `template()`:

```javascript
import { _ } from "bemtv";

const { template } = _`App`();
```

#### Definindo o template

O método `template()` deve ser usado para definir o conteúdo que o componente renderiza.

Ele aceita um argumento que deve ser uma `string`, `TemplateStringsArray` ou uma função:

```javascript
import { _ } from "bemtv";

const { template } = _`App`();

template`Hello world!`;
```

Só devemos usar uma função quando o conteúdo do template puder ser alterado por uma variável acima:

```javascript
import { _ } from "bemtv";

let count = 0;

const { template } = _`App`();

setInterval(() => count++, 1000);

template(() => `Count is: ${count}`);
```

#### Renderizando

Para renderizar o componente podemos usar a função `render()` .

Opcionalmente, podemos passar um elemento DOM ou um Seletor para indicar o local que o componente deve ser renderizado, o padrão é `document.body`:

```javascript
import { _ } from "bemtv";

const { template, render } = _`App`();

template`Hello world!`;

// Ela pode ser chamada inúmeras vezes
render();
```

Outra alternativa é importar o método `render()` do módulo principal, ele funciona de forma semelhante, porém leva uma `string` como primeiro argumento e o local de renderização como segundo:

```javascript
import { _, render } from "bemtv";

const { template } = _`App`();

template`Hello world!`;

render("App[]", "#my-content");
```

### Estilizando o componente

Além do estilo que pode ser aplicado diretamente no template,
uma ótima opção é utilizar o método `css()`:

```javascript
import { _ } from "bemtv";

const { css, template } = _`App`();

css`
  color: blue;
  font-size: 20px;
`;

template`h1[Hello world!]`;
```

### Variáveis isoladas e especiais

Para criar um componente que renderiza valores de forma isolada em cada renderização devemos passar um segundo argumento para a função que cria componentes, este deve ser um objeto com as propriedades que devem ser isoladas:

```javascript
import { _ } from "bemtv";

_`Counter`({ count: 0 });
```

Essas propriedades se comportam como variáveis especiais e ​​isoladas para cada renderização do componente.

**Passaremos a nos referir a essas variáveis ​​como `compVars` (variáveis de ​​componentes)**

### Super component

Um dos objetivos da criação de componentes é poder usá-los muitas vezes em sua aplicação.
A instância retornada após a criação de um componente é chamada de SuperComponent, pois internamente cada vez que o componente é utilizado é criada uma instância leve que gerencia essa nova renderização do componente, essas instâncias assumem “controle” sempre que ocorre uma ação nelas onde a reação é a execução de um callback passado anteriormente, normalmente em Hooks e eventos DOM.

> Não se preocupe, ficará mais claro à medida que você passar pelos exemplos e praticar.

### Hooks

Cada instância do componente passa por uma série de etapas, podemos executa funções chamadas hooks em cada uma dessas etapas:

```javascript
import { _ } from "bemtv";

const { onInit, onMount, onUpdate, onUnmount } = _`App`();

onInit(() => {
  // Chamada(apenas uma vez) quando a instância é inicializada.
});
onMount(() => {
  // Chamada(apenas uma vez) depois que o template do componente foi montado no DOM.
});
onUpdate(() => {
  // Chamada após a atualização do template ser aplicada ao DOM.
});
onUnmount(() => {
  // Chamado(apenas uma vez) depois que o componente é removido/desmontado do template em que estava.
});
```

### Manipulando eventos

Os manipuladores de eventos podem ser usados da instância do componente sua nomenclatura é a mesma usada em [`addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener), porém, eles devem terminar com um símbolo `$`, os argumentos recebidos também seguem os de `addEventListener()`:

```javascript
import { _ } from "bemtv";

const { click$, mouseover$, $ } = _`Counter`({ count: 0 });

click$(() => $.count++, { capture: true });

mouseover$(() => console.log("Hey!"));
```

Bemtv irá gerenciar e adicioná-los ao primeiro elemento que encontrar no template.

Para remover basta chamar a função retornada:

```javascript
import { _ } from "bemtv";

const { click$ } = _`Hey`();

const removeClickListener = click$(() => {});

removeClickListener();
```

### Manipulando as `compVars`

Após a criação do componente e das `compVars` elas ficam disponíveis através de um objeto e acessíveis pelo símbolo `$`, com ele podemos acessar, alterar os valores das propriedades e adicionar outras.

Este é um objeto especial que só pode ser usado em callbacks conhecidos da instância do componente, normalmente será usado em Hooks e em callbacks nos eventos DOM.

```javascript
import { _ } from "bemtv";

const { onInit, $ } = _`Counter`({ count: 0 });

onInit(() => {
  console.log($.count);
});
```

A responsabilidade deste objeto é manter os valores isolados para cada renderização do componente e **somente quando necessário** criar clones de estruturas de dados como array, Map, Set e object:

### Usando as `compVars` no template

Para usar o `compVars` no template usaremos um atalho especial, usando `$` mais o nome/caminho da propriedade:

```javascript
import { _ } from "bemtv";

const { $, template } = _`Hero`({
  hero: {
    name: "Black Panther",
  },
});

template`button[Clicked: $hero.name ]`;
```

Para marcar a propriedade como opcional basta adicionar um `?` ao ​​final:

```javascript
template`button[Clicked: $hero.name? ]`;
```

### Variáveis que são atributos

Se uma variável tiver o mesmo nome de um atributo e seu valor for destinado a ele, podemos usar o `@` e o nome da variável para que ela seja usada como nome e valor do atributo:

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

### Elementos DOM

Para acessar um elemento DOM usamos o método `useEl()`, que retorna uma tupla onde o primeiro item é uma chave especial que deve ser aplicada a tag e o segundo é uma função:

```javascript
import { _ } from "bemtv";

const { useEl, template } = _`Hey`();
const [key, getEl] = useEl();

template`h1[ ${key} Hey!]`;
```

> A chave pode ser usada em qualquer lugar dentro dos colchetes da tag.

A função `getEl()` só deve ser chamada em callbacks conhecidos pela instância do componente,
ao chamar a função obtemos uma instância que pode ser usada para manipular o elemento/tag que possui a chave:

```javascript
import { _ } from "bemtv";

const { useEl, onMount template } = _`Hey`();
const [key, getEl] = useEl();

onMount(()=>{
  const manageEl = getEl();
})

template`h1[ ${key} Hey!]`;
```

A `manageEl` contém propriedades e métodos úteis para lidar com o elemento DOM:

<dl>
  <dt><code>it</code></dt>
  <dd><br>
      <p>Permite acesso ao elemento DOM real, o valor padrão é <code>null</code> e é alterado assim que o elemento é adicionado ao DOM.</p>
  </dd>
</dl>

<dl>
  <dt><code>css</code></dt>
  <dd><br>
      <p>Permite adicionar CSS-in-JS ao elemento. </p>
      <p>Este método pode ser chamado antes mesmo do elemento ser adicionado ao DOM, o estilo será agendado e aplicado assim que o elemento estiver disponível</p>
  </dd>
</dl>

Opcionalmente, o método `useEl()` aceita um argumento que pode ser um elemento DOM ou um seletor(usará [querySelector](https://developer.mozilla.org/pt-BR/docs/Web/API/Document/querySelector) para encontrar o elemento), então o método retornará a instância:

```javascript
import { _ } from "bemtv";

const { useEl } = _`Hey`();
const manageEl = useEl("#my-app");
```

#### Manipulando eventos do elemento

Assim como na instância do componente, os manipuladores eventos podem ser usados da instância do elemento.

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

### Props

Muitas vezes nossos componentes precisam receber dados de fora antes de renderizar, props é uma forma comum de componentes pai passarem valores para componentes filho.

para passar props para um componente usamos o método `defineProps()`, ele recebe um objeto como argumento e retorna uma chave que pode ser usada antes do colchete de abertura do componente, então o componente receberá as props declaradas:

```javascript
import { _ } from "bemtv";

const { defineProps, template } = _`Hey`();

const p = defineProps({ src: "user.png" });

template`Avatar${p}[]`;
```

#### Usando as props

As `props` são acessíveis através do objeto `$`:

```javascript
import { _ } from "bemtv";

const { onInit, $ } = _`Avatar`();

onInit(() => {
  console.log($.props.src);
});
```

#### Manipulando as props

Para manipular as props podemos usar a função `props()` que recebe uma função, esta função receberá as props como primeiro argumento e deve retornar o resultado da manipulação, que então se tornará as props:

```javascript
import { _ } from "bemtv";

const { props, $ } = _`Avatar`();

props((p) => {
  p.src = "my-avatar.png";
  return p;
});
```

#### Props que são atributos

Se uma prop tiver o mesmo nome de um atributo e seu valor for destinado a ele, podemos usar o `@` e o nome da prop para que ela seja usada como nome e valor do atributo:

```javascript
import { _ } from "bemtv";

const { template } = _`Avatar`();

template`img[ @src ]`;
```

### Filhos do componente

Os `children` são acessíveis através do objeto `$` eles sempre serão uma `string`:

```javascript
import { _ } from "bemtv";

const { onInit, $ } = _`Container`();

onInit(() => {
  console.log($.children);
});
```

#### Manipulando children

Para manipular os `children` podemos usar a função `children()` que recebe uma função, esta função receberá os `children` como primeiro argumento e deve retornar o resultado da manipulação, que então se tornará os `children`:

```javascript
import { _ } from "bemtv";

const { children, $ } = _`Avatar`();

children((c) => {
  return c + "Hey!";
});
```

### Compartilhando dados entre componentes

A API de compartilhamento fornece uma maneira de compartilhar dados como esses entre o componente acima e todos os componentes abaixo dele, sem precisar passar explicitamente props entre cada nível.

#### Compartilhando dados

Para compartilhar os dados usamos o método `share()` que aceita um objeto com as propriedades a serem compartilhadas:

```javascript
import { _ } from "bemtv";

const { share, $ } = _`App`();

share({ message: "Hey!" });
```

#### Usando os dados

Para usar as propriedades compartilhadas usamos o método `use()` que aceita uma `string` que é o nome da propriedade a ser usada:

```javascript
import { _ } from "bemtv";

const { onInit, use, $ } = _`Message`();

onInit(() => {
  console.log(use("message")); // Hey!
});
```

#### Re-compartilhando dados

Para compartilhar e depois atualizar o valor de uma propriedade podemos usar o método `share()`:

```javascript
import { _ } from "bemtv";

const { share, $ } = _`App`();

share({ message: "Hey!" });
```

E o método `reshare()` que também aceita um objeto e atualiza os valores que foram compartilhados anteriormente:

```javascript
import { _ } from "bemtv";

const { onInit, reshare, $ } = _`Message`();

onInit(() => {
  reshare({ message: "New message!" });
});
```

> O método `reshare()` não disponibiliza novas propriedades, apenas atualiza as já existentes.

### Funções de transformação

Ao armazenar valores em estruturas de dados como array, Map, Set ou object podemos querer criar uma marcação (Brackethtml) e adicioná-la ao template, para isso podemos usar funções de transformação que injetam uma propriedade(usando Symbol) na estrutura de dados e informa à **Bemtv** para transformar a estrutura de dados somente quando usada no template.

Para criar uma função de transformação usamos a função `tFn()`, ela recebe como primeiro argumento uma função que faz a transformação da estrutura de dados e retorna outra função que envolve a função passada como argumento:

```javascript
import { tFn } from "bemtv";

const tListJoin = tFn((list) => list.join(" br[] "));
```

Para usar a função basta passar uma lista e ela retornará a mesma lista com um Symbol injetado:

```javascript
import { _, tFn } from "bemtv";

const tListJoin = tFn((list) => list.join(" br[] "));

const { template } = _`List`({
  list: tListJoin(["user1", "user2", "user3"]),
});

template`div[Users: $list ]`;
```

Sempre que essa lista for alterada(ex: `$.list.push(item)`), a Bemtv detectará e usará a função de transformação novamente e rederizará a alteração.

> As funções de transformação podem ser incrivelmente poderosas porque com Brackethtml podemos até retornar a marcação com CSS-In-JS, com isso podemos focar na estrutura de dados.

#### Funções de transformação built-in

```javascript
import { tOl, tUl, tDl } from "bemtv";

// Funciona com arrays e Sets e os transforma em uma lista ordenada.
tOl([] || new Set());

// Funciona com arrays e Sets e os transforma em uma lista não ordenada.
tUl([] || new Set());

// Funciona com objects e Maps e os transforma em uma lista de definição.
tDl({} || new Map());
```

Sempre que você criar uma função de transformação é uma boa prática exportar a função normal que faz a transformação imediatamente:

```javascript
import { toOl, toUl, toDl } from "bemtv";

// Funciona com arrays e Sets e os transforma em uma lista ordenada imediatamente.
toOl([] || new Set());

// Funciona com arrays e Sets e os transforma em uma lista não ordenada imediatamente.
toUl([] || new Set());

// Funciona com objects e Maps e os transforma em uma lista de definição imediatamente.
toDl({} || new Map());
```

### Mantendo a instância em execução

Se dentro do hook ou do evento DOM precisarmos usar uma função que não executa imediatamente devemos usar a função `keepInst()`, ela envolve a função que deve ser executada e retorna um callback que quando executado executa a função envolvida:

```javascript
import { _ } from "bemtv";

const { click$, keepInst, $, template } = _`Counter`({ count: 0 });

click$(() => {
  setTimeout(
    keepInst(() => $.count++),
    1000
  );
});

template`button[Clicked: $count ]`;
```

### Componente baseado em função

Bemtv permite uma segunda forma de criar componentes, usando uma função esta função será chamada sempre que o componente for usado e receberá como argumento uma nova instância do SuperComponent, portanto não precisamos usar `keepInst()`.

A primeira forma que mostramos até agora chama-se **CleanComponent**, pois a construção do componente é visualmente mais limpa e a segunda forma é **FunctionalComponent** porque utiliza uma função para encapsular a construção do componente. Atualmente, damos preferência a CleanComponent, mas fique à vontade para escolher aquela que melhor se adapta a um determinado componente.

Ao usar a FunctionalComponent, ela retornará uma instância que possui um método `render()`.

**FunctionalComponent:**

```javascript
import { _ } from "bemtv";

const { render } = _`Counter`(({ click$, css, template }) => {
  let count = 0;

  click$(() => count++);

  css`
    padding: 20px;
    color: red;
  `;

  template(() => `button[Clicked: ${count} ]`);
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

template`button[Clicked: $count ]`;

render();
```

### Roteador(Router)

Um Router é usado para navegação entre visualizações de vários componentes
em uma aplicação Bemtv, permite alterar a URL do navegador e mantém a UI sincronizada com a URL.

A Bemtv utiliza um inovador sistema de criação automática de rotas, isso é possível porque os componentes
podem se comportar como rotas/páginas.

#### Roteamento automático

O Bemtv é capaz de descobrir automaticamente quando um componente “normal” também deve ser tratado como uma rota:

Um componente normal:

```javascript
import { _ } from "bemtv";

const { template } = _`AboutUs`();

template`We are cool!`;
```

O componente responsável por rendrizar o App:

```javascript
import { _ } from "bemtv";

const { template, render } = _`App`();

template`
      Welcome!  br[]br[]

      #[] br[]br[]
      
      #AboutUs[ Link to about us ]`;

render();
```

O segundo componente apresenta a utilização do simbolo `#[]`, é dentro dele que as rotas são renderizadas.

Observe o `#AboutUs[...]`, é aqui que a “mágica” acontece.
Primeiro, a Bemtv lerá o template de componente `App` e descobrirá que o componente `AboutUs`
também é uma rota (graças ao `#` antes dele), e quando o template for renderizado, tudo dentro do componente `#AboutUs[...]` será envolvido em uma tag `a` com o atributo `href` apontando para a rota.

O endereço da rota será o nome do componente em kebab-case: `/about-us`.

Quando o usuário clicar no link, o componente `AboutUs` será renderizado em `#[]`.

A Bemtv também descobrirá que o componente é uma rota sempre que acessarmos algum método do componente que se destine a rotas, mesmo que não seja chamado graças a Proxies.

##### Definindo propriedades para a rota

Podemos definir propriedades para definir o comportamento da rota:

```javascript
import { _ } from "bemtv";

const { route, template } = _`AboutUs`();

route({
  title: "About us!", // O título do documento.
  concat: "1234567/hey/89", // Permite concatenar uma `string` no link da rota
});

template`We are cool!`;
```

#### Indo para a rota

Para renderizar a rota sem uma ação do usuário, podemos usar o método `renderRoute()`:

```javascript
import { _ } from "bemtv";

const { renderRoute, template } = _`AboutUs`();

setTimeout(() => {
  renderRoute();
}, 3000);

template`We are cool!`;
```

#### Route/component Root

Caso defina um componente com o nome `Root`, ele será renderizado sempre que não houver outra rota ativa.

#### Capturando erros

Sempre que a rota for desconhecida, a Bemtv irá avisá-lo através da função `onRouteUnfound()` que aceita um ouvinte/callback como primeiro argumento:

```javascript
import { onRouteUnfound } from "bemtv";

onRouteUnfound(() => {
  console.log("Estamos em uma rota não conhecida :(");
});
```

### Verificando componentes disponíveis

Para verificar se um componente está disponível, podemos usar o método `hasComponent()` que aceita uma argumento que é o nome do componente:

```javascript
import { hasComponent } from "bemtv";

if (hasComponent("App")) {
  //...
}
```

### Inicializando(Bootstrapping) um App Bemtv

Recomendamos criar um arquivo de inicialização e nele importar todos os componentes que irá precisar garantindo que todos os componetes já foram importados:

`bootstrap.js`:

```javascript
import "./components/Counter";
import "./components/Message";
```

### Dividindo o Código (Code-Splitting)

Para automatizar o processo de importação de componentes, a Bemtv oferece a função `autoImportComponents()` que aceita um objeto onde o nome das propriedades deve ser o nome dos componentes e seus valores devem ser uma função que importa o componente usando [importações dinâmicas](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)(dynamic import):

```javascript
import { autoImportComponents } from "bemtv";

autoImportComponents({
  Counter() {
    import("./components/Counter");
  },
});
```

A Bemtv fará a importação do componente assim que componente for utilizado em um template, porém, irá ignorar o componente até o momento em que estiver disponível.

### Usando fallback(Plano B)

A função `match()` pode ser usada para apresentar uma alternativa enquanto um determinado componente não estiver disponível, ela aceita dois argumentos, o primeiro é o componente de interesse que se estiver disponível é retornado como valor, e o segundo argumento que deve ser uma `string` que só é usado como retorno se o componente não estiver disponível:

```javascript
import { _, match } from "bemtv";

const { template } = _`Hero`();

template(() => `Dados: ${match("Data[]", "<div>Carregando...</div>")}`);
```

> **Esta função acionará a importação automática se o componente for autoimportável**.

## Fechamento

Obrigado por chegar até aqui, se tiver alguma dúvida, sugestão ou quiser ajudar o projeto de outras formas, é só entrar em contato, em breve novidades e melhorias virão!

Não se esqueça de dar sua estrela ao projeto, pois isso me incentiva a continuar desenvolvendo.

Até mais!
