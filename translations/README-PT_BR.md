<p align='center'>
  <img  src='https://github.com/diogoneves07/bentivejs/blob/main/assets/bemtevi-logo.png'  alt='Bemtevi logo'>
</p>

Bemtevi é uma biblioteca JavaScript que traz uma nova abordagem para a criação de UIs interativas.

Basicamente, é a junção de
[Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy),
[Template literals (Template strings)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
somados a açúcares sintáticos
e orquestrados “automagicamente” por um
[requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) loop.

## Por que Bemtevi?

Ligeiramente opinativo, minimalista, leve(**gzip: 6.5 KiB**) mesmo com uma linguagem de marcação
e uma biblioteca CSS-in-JS **integrada ao template**,
atualizações refinadas para o DOM real por meio de um loop de detecção de alteração no template que
permite reatividade sem esforço do desenvolvedor.

Atualmente, o principal objetivo é ser uma ferramenta especializada no desenvolvimento de **pequenas aplicações web**,
permitindo ao desenvolvedor utilizar uma sintaxe agradável,
direta e que possa ser aprendida em poucos minutos e não em horas,
pense em: “Apenas adicionar a Bemtevi ao seu index.html e se divertir construindo sua aplicação”.

## Um breve olhar

Componente **Counter**:

```javascript
import { _ } from "bemtevi";

_("Counter", ({ click$ }) => {
  let count = 0;

  click$(() => count++);

  return () => `button[Cliked: ${count}]`;
}).render();
```

<hr />

> **Por favor, se você gostou do projeto, não vá embora sem deixar sua estrela! Ela nos encoraja a continuar desenvolvendo.**

<hr />

<br>
<details>
  <summary><h2>Índice</h2></summary>

- [Instalação](#instalação)
- [Funcionamento(Sob o capô)](#funcionamentosob-o-capô)
- [Documentação](#documentação)
  - [Introduzindo Brackethtml](#introduzindo-brackethtml)
    - [Por que Brackethtml?](#por-que-brackethtml)
    - [Brackethtml + CSS-in-JS (goober)](#brackethtml--css-in-js-goober)
    - [Regras de uso](#regras-de-uso)
    - [Caracteres especiais](#caracteres-especiais)
  - [Componentes](#componentes)
    - [Renderizando um Componente](#renderizando-um-componente)
    - [Compondo Componentes](#compondo-componentes)
    - [Verificando componentes disponíveis](#verificando-componentes-disponíveis)
    - [Props](#props)
    - [Filhos do componente](#filhos-do-componente)
    - [Componentes com e sem estado](#componentes-com-e-sem-estado)
      - [Com estado](#com-estado)
      - [Sem estado](#sem-estado)
    - [Compartilhando dados entre componentes](#compartilhando-dados-entre-componentes)
      - [Compartilhando dados](#compartilhando-dados)
      - [Usando os dados](#usando-os-dados)
      - [Re-compartilhando dados](#re-compartilhando-dados)
      - [Funcionamento(Sob o capô)](#funcionamentosob-o-capô-1)
      - [Dados entre componentes](#dados-entre-componentesavançado)
  - [Manipulando eventos](#manipulando-eventos)
  - [Elementos DOM](#elementos-dom)
    - [Manipulando eventos do elemento](#manipulando-eventos-do-elemento)
  - [Ciclo de Vida(Lifecycle) Hooks](#ciclo-de-vidalifecycle-hooks)
    - [onMount](#onmount)
    - [onUpdate](#onupdate)
    - [onUnmount](#onunmount)
  - [Inicializando(Bootstrapping) um App Bemtevi](#inicializandobootstrapping-um-app-bemtevi)
  - [Dividindo o Código (Code-Splitting)](#dividindo-o-código-code-splitting)
  - [Usando fallback(Plano B)](#usando-fallbackplano-b)
- [Fechamento](#fechamento)

</details>
<br>

## Instalação

```bash

npm i bemtevi

```

## Funcionamento(Sob o capô)

A abordagem usada para criar componentes difere da convencional, basicamente usamos o poder de [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) e orquestramos as chamadas com um [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) loop:

```javascript
import { _ } from "bemtevi";

_("Counter", () => {
  let count = 0;

  setInterval(() => count++, 1000);

  return function templateCreator() {
    return `button[Cliked: ${count}]`;
  };
}).render();
```

No exemplo acima, observe que a função `templateCreator()` ela
é um **Closure**, o que significa que ela tem acesso ao escopo da função externa a ela.
Com isso, sempre que for chamada ela retornará a _“Template string”_ com o valor mais recente da variável `count`.

Após criar o componente, Bemtevi começa a chamar a função `templateCreator()` toda vez antes da próxima repaint (repintura) do navegador e compara a _“Template string”_ com o seu valor anterior para determinar se há alteração no template.

A princípio, podemos pensar que isso sobrecarregará o navegador, no entanto, existem boas práticas que devemos seguir para evitar isso:

- Tudo dentro do template deve ser strings, números ou cálculos leves.

- A função que gera o template só deve ser usada para isso.

Seguindo essas recomendações, sua aplicação não sofrerá sobrecarga.

## Documentação

A Bemtevi se esforça para ser minimalista e poderosa,
a documentação é pequena o suficiente para caber neste README,
mas cheia de recursos como sua própria linguagem de marcação,
biblioteca CSS-in-JS ([goober](https://github.com/cristianbote/goober)) **integrada ao template**,
sistema de gerenciamento de eventos do DOM,
API inovadora para compartilhamento de dados entre componentes,
métodos de ciclo de vida e açúcares sintáticos que trarão uma ótima experiência ao desenvolvedor!

### Introduzindo Brackethtml

Considere esta declaração de variável:

```javascript
const btn = `button[Click me!]`;
```

Essa sintaxe estranha é uma `string` normal, porém nossa biblioteca a entende e pode converter para HTML, chamamos de “Brackethtml”.

O HTML equivalente seria:

```javascript
const btn = `<button>Click me!</button>`;
```

#### Por que Brackethtml?

O objetivo principal é reduzir a redundância do HTML e ainda ser facilmente compreensível como HTML.

Brackethtml suporta HTML normalmente e você pode até misturar os dois se precisar.

Basicamente, nos exemplos anteriores,
removemos a necessidade de uma tag de fechamento para a tag `button`.

> Recomendamos que experimente porque é muito semelhante ao HTML e queremos que seja uma característica importante da nossa biblioteca.

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

- Se o símbolo `~` não estiver presente tudo que estiver dentro dos colchetes da tag será entendido como seus filhos:

```javascript
const btn = `h1[ span[ Hello world! ] ]`;
```

- O símbolo `~` é responsável por separar os atributos e CSS-in-JS dos filhos da tag e deve ser usado entre espaços em branco:

```javascript
const btn = `button[color:blue; ~ Click me!]`;
```

- Tudo antes do símbolo `~` é considerado atributos e/ou CSS-in-JS:

```javascript
const btn = `button[padding:50px; ~]`;
```

- Os atributos da tag devem sempre vim antes do CSS-in-JS:

```javascript
const btn = `button[data-username = "Bemtive" padding:50px; ~  Hello!]`;
```

- Os atributos devem usar apenas aspas duplas `"`:

```javascript
const btn = `button[class="hello" ~ Click me!]`;
```

- O CSS-in-JS devem usar apenas aspas simples `'`:

```javascript
const btn = `button[class="hello" font-family:'Courier New'; ~ Click me!]`;
```

#### Caracteres especiais

Alguns caracteres devem ser escapados para serem usados ​​sem que a Brackethtml os interprete: `~`, `[` e `]`.

Para escapá-los basta envolvê-los entre parênteses "()":

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

> A partir de agora você já consegue interpretar e usar a Brackethtml. Esperamos que sua produtividade aumente consideravelmente.

> Em um futuro próximo, seria incrível ter uma extensão que pudesse destacar a Brackethtml de acordo com suas regras, facilitando a separação visual de cada parte.

### Componentes

Componentes permitem você dividir a UI em partes independentes, reutilizáveis e pensar em cada parte isoladamente.

Para criar um componente podemos importar o símbolo `_` que é um alias da função `Component` do mesmo módulo:

```javascript
import { _, Component } from "bemtevi";

// Eles funcionam da mesma maneira:

_("Counter", () => {});

Component("Counter", () => {});
```

> Ao longo desta documentação os exemplos darão preferência ao símbolo `_`, no entanto, fique à vontade para escolher em seus projetos.

A função aceita dois argumentos:

<dl>
  <dt><code>name</code></dt>
  <dd><br>
      <p>Uma  <code>string</code> que é o nome do componente.</p>
  </dd>
</dl>

Deve sempre começar com um caractere maiúsculo (CamelCase) e aceita todos os caracteres alfanuméricos e o símbolo `:`.

Os nomes dos componentes funcionam como uma chave para acessar suas funções e, portanto, devem ser únicos, para evitar conflitos você pode usar o símbolo `:` para indicar um componente que esteja relacionado a algo:

```javascript
import { _, Component } from "bemtevi";

_("Jquery:Ajax", (self) => console.log(self.name));
// ou

_("Menu:Links", (self) => console.log(self.name));
```

<dl>
  <dt><code>componentManager</code></dt>
  <dd><br>
     <p>A <code>function</code> responsável por gerenciar a instância do componente.</p>
  </dd>
</dl>

Deve sempre retornar uma `string` ou uma função que retorna uma `string`.

Esta função terá a instância do componente como seu primeiro e único argumento.

```javascript
import { _, Component } from "bemtevi";

_("Counter", (componentInstance) => console.log(componentInstance));
```

### Renderizando um Componente

Após declarar o componente, a instância retornada possui um método `render()` que pode ser chamado para renderizar o componente em algum lugar da página:

```javascript
import { _ } from "bemtevi";

_("Counter", () => `h1[Hello world!]`).render();
```

Este método aceita opcionalmente um argumento que indica um elemento ou um seletor(usará [querySelector](https://developer.mozilla.org/pt-BR/docs/Web/API/Document/querySelector) para encontrar o elemento) para inserir o componente(O padrão é `document.body`) e retorna a mesma instância.

Também podemos importar a função `render()` que funciona de maneira semelhante:

```javascript
import { _, render } from "bemtevi";

_("Counter", () => `h1[Hello world!]`);

render("Counter", "#app");
```

A diferença é que ela recebe um template como primeiro argumento e opcionalmente um seletor como segundo.

### Compondo Componentes

Componentes podem se referir a outros componentes em seu template. Isso nos permite usar a mesma abstração de componente para qualquer nível de detalhe.

Por exemplo, nós podemos criar um componente App que renderiza Welcome muitas vezes:

```javascript
import { _, render } from "bemtevi";

_("Welcome", () => `h1[Hello world!] br[]`);

_("App", () => `Welcome[] Welcome[] Welcome[]`);

render("App", "#app");
```

### Verificando componentes disponíveis

Para verificar se um componente está disponível, podemos usar o método `hasComponent()` que aceita uma argumento que é o nome do componente:

```javascript
import { hasComponent } from "bemtevi";

if (hasComponent("App")) {
  //...
}
```

### Props

Muitas vezes nossos componentes precisam receber dados de fora antes de renderizar, props é uma forma comum de componentes pai passarem valores para componentes filho.

Normalmente em outras bibliotecas e frameworks props são passados ​​como atributos do componente filho, porém, em nossa biblioteca isso não seria possível, pois, só seria possível passar valores do tipo `string` ou `number`.

para passar props para um componente, usamos o método `defineProps()` que está disponível na instância do componente:

```javascript
import { _, render } from "bemtevi";

_("App", ({ defineProps }) => {
  const key = defineProps({ message });

  return `Message${key}[]`;
});
```

O método `defineProps()` recebe um objeto como argumento e retorna uma chave que pode ser usada antes do colchete de abertura do componente, então o componente receberá as props declaradas:

```javascript
import { _, render } from "bemtevi";

_("Message", ({ props }) => {
  const { message } = props;

  return `h1[${message}] br[]`;
});
```

Também poderíamos usar a propriedade `p` que é um alias de `props`:

```javascript
import { _, render } from "bemtevi";

_("Message", ({ p }) => {
  const { message } = p;

  return `h1[${message}] br[]`;
});
```

### Filhos do componente

Componentes também podem agrupar filhos, mas cabe ao componente que irá recebê-los decidir se irá adicioná-los ao seu template.

O componente pode acessar seus filhos através da propriedade `children` que sempre será uma `string`:

```javascript
import { _, render } from "bemtevi";

_("Message", ({ children }) => `h1[${children}]`);

_(
  "App",
  () => `
    Message[ Hello ]  br[]
    Message[ world ]  br[]
    Message[ !!! ]`
).render();
```

### Componentes com e sem estado

Há uma distinção entre componentes com estado e sem estado:

#### Com estado

Componentes com estado são aqueles que retornam uma função porque seu template é mutável:

```javascript
import { _, render } from "bemtevi";

_("Counter", () => {
  let count = 0;

  setInterval(() => count++, 1000);

  return () => `Counter: ${count}`;
});
```

#### Sem estado

Componentes sem estado são aqueles que retornam uma `string` porque seu template nunca mudará após ser gerado:

```javascript
import { _, render } from "bemtevi";

_("Welcome", ({ props }) => {
  const { message } = props;

  return `strong[${message}]`;
});
```

### Compartilhando dados entre componentes

Podemos usar props para passar dados do componente pai para seus filhos, mas esse uso pode ser complicado para certos tipos de props (como preferências locais ou tema de UI), que são utilizadas por muitos componentes dentro da aplicação.

A API de compartilhamento fornece uma maneira de compartilhar dados como esses entre o componente acima e todos os componentes abaixo dele, sem precisar passar explicitamente props entre cada nível.

#### Compartilhando dados

Para compartilhar os dados usamos o método `share()` que aceita um objeto com as propriedades a serem compartilhadas:

```javascript
import { _, render } from "bemtevi";

_("Parent", ({ share }) => {
  share({ message: " Hello world! " });

  return `Child[]`;
});
```

#### Usando os dados

Para usar as propriedades compartilhadas usamos o método `use()` que aceita uma `string` que é o nome da propriedade a ser usada:

```javascript
import { _, render } from "bemtevi";

_("Child", ({ use }) => `strong[${use("message")}]`);
```

#### Re-compartilhando dados

Em algumas situações, podemos precisar que o componente filho busque dados e atualize, no entanto, enquanto esses dados não estiverem disponíveis, o componente pai deve definir um valor padrão e, assim que os dados estiverem disponíveis, o componente filho deverá poder alterar.

Para isso podemos usar o método `share()` combinado com o método `reshare()` que também aceita um objeto e atualiza os valores que foram compartilhados anteriormente:

```javascript
import { _, render } from "bemtevi";

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

> É importante lembrar que o método `reshare()` não disponibiliza novas propriedades, apenas atualiza as já existentes.

#### Funcionamento(Sob o capô)

O compartilhamento de dados funciona por hierarquia, o componente acima compartilha os dados consigo mesmo e com todos abaixo dele.

Com isso, algumas questões podem surgir:

**O que acontece se vários componentes que estão acima de outro compartilharem a mesma propriedade?**

O componente abaixo consumirá a propriedade do componente acima mais próximo.

> No entanto, é uma boa prática ao compartilhar dados entre componentes evitar repetir o nome das propriedades.

O mesmo acontece ao re-compartilhar uma propriedade, o valor atualizado será o do componente acima mais próximo.

<details>
  <summary><h4>Dados entre componentes(Avançado)</h4></summary>

[Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) podem dar acesso a valores contidos em componentes de forma que o valor retornado sempre estará atualizado.

Primeiro vamos declarar um componente Counter:

```javascript
import { _ } from "bemtevi";

_("Counter", () => {
  let count = 0;

  const getCounterValue = () => count;

  setInterval(() => count++, 1000);

  return () => `Current value: ${count}`;
});
```

Observe dentro dele a função `getCounterValue()` que, quando chamada, retornará o valor mais recente da variável `count`, no entanto, precisamos torná-la acessível de fora do componente, para isso usaremos o método `reshare()`:

```javascript
import { _ } from "bemtevi";

_("Counter", ({ reshare }) => {
  let count = 0;

  const getCounterValue = () => count;

  setInterval(() => count++, 1000);

  reshare({ getCounterValue });

  return () => `Current value: ${count}`;
});
```

O método `reshare()` fará o seguinte, se um componente acima compartilhou uma propriedade ou método `getCounterValue()`, atualize-o com este novo valor.

Em seguida, criaremos um componente DoubleCounter que usará o método `getCounterValue()` para acessar o valor atual do contador:

```javascript
import { _ } from "bemtevi";

_("DoubleCounter", ({ use }) => {
  return () => ` Double value: ${use("getCounterValue")() * 2}`;
});
```

Podemos fazer uso do método dentro do template de DoubleCounter porque sua chamada resulta em computação leve, no entanto, se executarmos este código agora, o DoubleCounter não teria acesso a `getCounterValue()` porque ele só pode acessar dados compartilhados por ele mesmo ou por componentes acima dele.

Para resolver isso temos que criar um componente que esteja acima de Counter e DoubleCounter:

```javascript
import { _ } from "bemtevi";

_("App", () => `Counter[] br[] DoubleCounter[] `).render();
```

O componente acima dos demais tem outra responsabilidade a de compartilhar os valores definindo assim os valores padrão:

```javascript
import { _ } from "bemtevi";

_("App", ({ share }) => {
  share({ getCounterValue: () => 0 });

  return () => `Counter[] br[] Current value * 2: DoubleCounter[] `;
}).render();
```

As etapas acima descrevem que o componente acima define as propriedades e
os componentes abaixo podem acessá-las e/ou alterá-las.

</details>

### Manipulando eventos

Manipular eventos em Bemtevi é muito semelhante a manipular eventos usando
[addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener).

Os manipuladores de eventos podem ser injetados na instância do componente como um método e sua nomenclatura é a mesma usada em `addEventListener()`, porém, eles devem terminar com um símbolo `$`.

Ao injetar manipuladores de eventos na instância do componente, Bemtevi irá adicioná-los ao primeiro elemento que encontrar no template:

```javascript
import { _ } from "bemtevi";

_("Counter", ({ reshare, click$ }) => {
  let count = 0;

  click$(() => count++, {} /* AddEventListenerOptions */);

  return () => `button[Clicked: ${count}]`;
});
```

Os argumentos recebidos também seguem os de `addEventListener()`.

O Bemtevi gerenciará os manipuladores de eventos e se o template mudar, se necessário, poderá adicioná-los novamente.

### Elementos DOM

Pode ser necessário acessar o elemento DOM, para isso podemos utilizar o método `el()`, que retorna uma tupla onde o primeiro item é um objeto e o segundo é a chave que deve ser aplicada ao elemento:

```javascript
import { _ } from "bemtevi";

_("Counter", ({ el }) => {
  const [btnManager, btnKey] = el();

  return () => `button[ ${btnKey}  My button]`;
});
```

A chave pode ser usada em qualquer lugar dentro dos colchetes da tag.

Opcionalmente, o método `el()` aceita um argumento que pode ser um elemento DOM ou um seletor(usará [querySelector](https://developer.mozilla.org/pt-BR/docs/Web/API/Document/querySelector) para encontrar o elemento), então o método retornará apenas um objeto:

```javascript
import { _ } from "bemtevi";

_("Counter", ({ el }) => {
  const btnManager = el("#button");

  return () => `button[ id='button' ~ My button]`;
});
```

> Se for um seletor, o elemento estará disponível assim que o componente for montado

O `btnManager` contém propriedades e métodos úteis para lidar com o elemento DOM:

<dl>
  <dt><code>it</code></dt>
  <dd><br>
      <p>Permite acesso ao elemento DOM real, o valor padrão é <code>null</code> e é alterado assim que o elemento é adicionado ao DOM.</p>
  </dd>
</dl>

```javascript
import { _ } from "bemtevi";

_("Counter", ({ el }) => {
  const [btnKey, btnManager] = el();

  setTimeout(() => btnManager.it.click());

  return () => `button[ ${btnKey}  My button]`;
}).render();
```

<dl>
  <dt><code>css</code></dt>
  <dd><br>
      <p>Permite adicionar CSS-in-JS ao elemento. </p>
      <p>Este método pode ser chamado antes mesmo do elemento ser adicionado ao DOM, o estilo será agendado e aplicado assim que o elemento estiver disponível</p>
  </dd>
</dl>

```javascript
import { _ } from "bemtevi";

_("Counter", ({ el }) => {
  const [btnKey, btnManager] = el();

  btnManager.css`color:blue;`;

  return () => `button[ ${btnKey}  My button]`;
}).render();
```

> Este método é idêntico ao método [goober - css()](https://goober.js.org/api/css/) (veja mais detalhes na documentação do goober)

#### Manipulando eventos do elemento

Assim como na instância do componente, os manipuladores eventos podem ser injetados na instância do elemento(`btnManager`) como um método e sua nomenclatura é a mesma usada em `addEventListener()`, porém, eles devem terminar com um símbolo `$`.

```javascript
import { _ } from "bemtevi";

_("Counter", ({ el }) => {
  const [btnKey, btnManager] = el();

  btnManager.click$(
    () => console.log("Clicked!"),
    {} /* AddEventListenerOptions */
  );

  return () => `button[ ${btnKey}  My button]`;
}).render();
```

### Ciclo de Vida(Lifecycle) Hooks

Cada instância do componente Bemtevi passa por uma série de etapas como montar o template e atualizar o DOM quando os dados forem alterados. Ao longo do caminho, ela também executa funções chamadas ganchos de ciclo de vida, dando aos usuários a oportunidade de adicionar seu próprio código em estágios específicos.

#### onMount

Chamada apenas uma vez depois que os elementos do template são adicionados ao DOM:

```javascript
import { _ } from "bemtevi";

_("Counter", ({ onMount }) => {
  onMount(() => console.log("Mounted!"));

  return () => `button[ My button]`;
}).render();
```

#### onUpdate

Chamada sempre que o template é alterado e as alterações forem aplicadas ao DOM:

```javascript
import { _ } from "bemtevi";

_("Counter", ({ onMount }) => {
  let count = 0;

  setTimeout(() => (count = 1));

  onUpdate(() => console.log("Updated!"));

  return () => `button[value: ${count}]`;
}).render();
```

#### onUnmount

Chamada apenas uma vez depois que todos os elementos do modelo foram removidos do DOM e instância do componente será destruída:

```javascript
import { _ } from "bemtevi";

_("Counter", ({ onUnmount }) => {
  onUnmount(() => console.log("Unmounted!"));

  return () => `button[ My button]`;
}).render();
```

### Inicializando(Bootstrapping) um App Bemtevi

Na Bemtevi, os componentes são declarados globalmente e usados ​​a partir de sua chave de declaração (o nome do componente), então podemos usar um componente sem importar seu módulo desde que ele já tenha sido importado em algum momento da aplicação.

Para garantir que um componente foi importado, podemos simplesmente importá-lo para o módulo onde queremos usá-lo:

```javascript
import "./components/Counter";

_("App", () => `Counter[]`).render();
```

> Observe que a importação visa apenas os efeitos colaterais do módulo, ou seja, a criação do componente.

Essa prática funcionará muito bem, porém, pode ser tedioso fazer isso em todos os módulos que você irá precisar do componente, outra solução é criar um arquivo de inicialização e nele importar todos os componentes que irá precisar:

`bootstrap.js`:

```javascript
import "./components/Counter";
import "./components/Message";
import "./components/HelloWorld";
import "./components/Menu";
import "./components/Footer";
import "./components/Header";
```

E no arquivo principal da sua aplicação, importe o arquivo que importa os componentes:

`main.js`:

```javascript
import "./bootstrap";

/* ... */
```

### Dividindo o Código (Code-Splitting)

Para evitar o envio de componentes que a princípio podem ser desnecessários para o usuário, podemos usar [importações dinâmicas](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)(dynamic import), que nos permite importar um módulo a qualquer momento em nossa aplicação.

Para automatizar o processo de importação de componentes, a Bemtevi oferece a função `autoImportComponents()` que aceita um objeto onde o nome das propriedades deve ser o nome dos componentes e seus valores devem ser uma função que importa o componente usando importação dinâmica:

```javascript
import { autoImportComponents } from "bemtevi";

autoImportComponents({
  Counter() {
    import("./components/Counter");
  },
  Message() {
    import("./components/Message");
  },
});
```

A Bemtevi fará a importação do componente assim que componente for utilizado em um template, porém, irá ignorar o componente até o momento em que estiver disponível.

```javascript
import { _ } from "bemtevi";

_("App", () => () => `A messagem é: Message[]`).render();
```

No exemplo acima, inicialmente a página exibiria “A mensagem é:”, pois o componente `Message` ainda não havia sido baixado, mas assim que estivesse disponível o template seria atualizado e a página também exibiria o template do componente `Message`.

### Usando fallback(Plano B)

A função `match()` pode ser usada para apresentar uma alternativa enquanto um determinado componente não estiver disponível, ela aceita dois argumentos, o primeiro é o componente de interesse que se estiver disponível é retornado como valor, e o segundo argumento que deve ser uma `string` que só é usado como retorno se o componente não estiver disponível:

```javascript
import { _, match } from "bemtevi";

_("App", () => () => {
  return `
        Dados: 
        ${match("Data[]", "<div>Carregando...</div>")}`;
}).render();
```

> Esta função está otimizada para que possamos usá-la diretamente no template.

> **Esta função acionará a importação automática se o componente for autoimportável**.

## Fechamento

Obrigado por chegar até aqui, se tiver alguma dúvida, sugestão ou quiser ajudar o projeto de outras formas, é só entrar em contato, em breve novidades e melhorias virão!

Não se esqueça de dar a sua estrelinha para o projeto, pois isso nos incentiva a continuar desenvolvendo, até mais!
