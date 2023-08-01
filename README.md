# Pinaka

A simple and small `JavaScript` library for creating dynamic web pages. It has very small footprint compare to other libraries.

- __[Reserved Words](#reserved-words)__
- __[Initialization](#initiliazation)__
- __[Hooks](#hooks)__
- __[Methods](#methods)__
- __[Syntax](#syntax)__

## Reserved Words

```md
# Prefix
--------------------------------------------------
'p:'    : prefix of reserved tags and props.
'use:'  : prefix for props for add 'Directive'.
'slot:' : prefix for creating slots for components.
'on:'   : prefix for creating event listeners.

# Tags
-------------------------------------------------- 
'p:slot'      : Denotes, slot are used.
'p:error'     : Handle errors in child components.
'p:portal'    : Render nodes elsewhere from normal flow.
'p:component' : Load dynamic component.
'p:each'      : Render List.
'p:case'      : Render nodes based on some condiions.
'p:comment'   : Add native Html comments.

# Reserved Props
--------------------------------------------------
'ref'     : Create HTMLElement reference.
'key'     : Useful for performance reason, will be used with 'p:each'.
'bind'    : Bind objects with elements and components, Handy, if using `p` otherwise may be used in future updates.
'each'    : Represent 'p:each' tag, will be used non-compiled template. 
'if'      : Represent 'p:case', will used with non-compiled template. 
'elseif'  : Represent 'p:case', will used with non-compiled template and must be prefixed with `if` or `elseif`.
'else'    : Represent 'p:case', will used with non-compiled template and must be prefixed with `if` or `elseif`. 
```

## Initiliazation

Initilialize `Pinaka` application instance. 

```ts
function createApp(component: Component, root: Element, options?: Options);

type Element = HTMLElement | SVGElement
type PinakaOptions = {
    config?: {
        allowComment?: boolean,
        isCustomTag?: (tag: stirng) => boolean,
    },
    errorHandler?: (err: ErrorObject) => void,
    initialProps?: Props,
    plugins?: Function[],
    directive?: { [name: string]: Directive },
    component?: { [name: string]: Component },
    global?: Record<string, any>
}

type DirectiveResult<T> = {
    update?: (value: T) => void,
    destroy?: () => void
}

type Directive<T> = (node: Element, value: T, options?: string[]) => DirectiveResult<T>

type Component = (props: Props, { slots: Slots, use: Directives, global: Record<string, any>}) => VNode | {[key: string]: any};

type Children = string | VNode  | Slot | Slots | Children[]

type Slot = () => Children
    
type Slots = Record<string, Slot>

type Directives = Record<string, Directive>

type Props = Record<string, (Primitive | Function | [fn: Function, options?: string[]])>

type Binding = (() => object) | object

type Primitive = string | boolean | number | symbol
```

## Hooks

- __[signal](#signal)__
- __[watch](#watch)__
- __[memo](#memo)__
- __[ref](#ref)__

### __`.createSignal()`__

Create reactive signals using `signal` hook. Easy to use, if you have already used reactJs, Then it'll easy to understant `signals`. `Signal` are same as reactJs `useState`.

```ts
function signal<T>(initialValue: T, equals?: boolean | ((prev: T, curr: T) => boolean)): [get() => T, set(v: T | ((o: T) => T)) => T]

type Getter<T> = () => T
type Setter<T> = (val: T | ((prev: T) => T)) => T
type Signal<T> = [get: Getter<T>, set: Setter<T>]
```

First argument is the initial value, value can be pritimive, array or object litrals. Second argument is optional, but can be a boolean value or a function (which'll take previous and current value of signal whenever the signal `Setter` called) which returns a boolean value. If boolean value is `false`, it'll trigger its dependecies to be execute. Signal hook return a array, first value of array is `Getter` function and second value is `Setter` function.

```js
const [count, setCount] = createSignal(10)

// get value by calling getter function
console.log(count()) // 10

// set value by calling setter function.
setCount(count() + 1) // or setCount(prev => prev + 1)

console.log(count()) // 11
```

__NOTE__: If using array or object litral as signal value. While changing signal value, always completly replace previous value, so `signal` can differentiate between previous and new value and trigger dependecies.

```js
const [user, setUser] = createSignal({ id: 1, name: "Anuj Kumar" })

// ❌ wrong way, will not trigger dependecies. Assuming you have not used second argument of `signal`.
user().name = 'PinakaUser'
user().id = 2
setUser(user())

// ✅ always create new value, `signals` can differentiate between previous and new value
setUser({ ...user(), id: 2 })

// or
setUser({ ...user(), name: 'PinakaUser' })

// or
setUser(prev => { ...prev, name: 'PinakaUser' })
```

### __`.createEffect()`__

Watch `signal` changes, and run whenver the `signal` changes. Usefull in component lifecyle, beacuse `watcher` run three times in component lifecyle. First immidiate after compoenent `mount`, second whenever `signal` changes. And last before the component destroy. So basically there are three lifecyle forms, `onMounted`, `onUpdated` and `onDestroy`.

```ts
function createEffect(fn: () => Function | undefined) : void
```

Watchers required only one parameter which must be a function. Function can return a anonymus function which will be run before the component'll destroy. One component can have one or more than one Watchers. Wactcher automatically trackes signals and run when one of them is changed.

```js
const [radius, setRadius] = createSignal(10)
const [area, setArea] = createSignal(200)

// Ex. 1
createEffect(() => console.log(radius())) // only updates when 'radius' signal changed.

// Ex. 1
createEffect(() => console.log(radius(), area())) // updates when 'radius' or 'area' signal changed.

// we can return a anonymus function.
createEffect(() => {
    let interval = setInterval(() => {
        setRadius(prev => prev + 1);
    })

    // this function runs only ones before the component destoy.
    // usefull for cleanup objects, timers or other async process.
    return () => clearInterval(interval)
})
```

### __`.createMemo()`__

Memorized hook `memo` is useful when you have a complex task and also depend on some `signals`. This hook can memorised previous computation and before calculating new value, we can use that previous value, for avoding unwanted calculation, whenever one its `signal` changes.

```ts
function memo<T>(fn: (v: T) => T, value?: T): () => T
```

Unlike `.createEffect()`, `.createMemo()` does not run immediatly. Calculation takes place only when it will use somewhere. Also `.createEffect()` doesn't return anything but `.createMemo()` returns a function for accessing calculated value. First argument is callback function, which'll do some CPU expensive task. And second argument is a default value that'll passed as argument to the callback function on first calculation.

```js
const [id, setId] = createSignal(10)

// this will run immediatly, whenever `signals` changes and before component destroy.
createEffect(() => doExpensiveTask(id()))

// but memo runs only when it'll be used and whenever `signals` changes 
const user = createMemo((prev) => {
    if (prev < 10) return;
    doExpensiveTask(id())
}, 0)

user() //  memorised function runs
```

### __`.createRef()`__

Refs are useful for holding DOM node reference. They are not reactive like other hooks.

```ts
function createRef(): (node?: Element) => HTMLElement | undefined

type Element = HTMLElement | SVGElement | Text
```

```js
const input = createRef();

h('div', { ref: input })
//<div ref={input}></div>
```

## Methods

- __[untrack](#untrack)__
- __[unbatch](#unbatch)__
- __[use](#use)__
- __[global](#global)__
- __[p](#p)__

### __`.untrack()`__

Untrack `signal` when using with `.createEffect()`, `.createMemo()` or with any expression, Where we just want `signal` value, but not want to add that perticular `signal` as expression dependency.

```ts
function untrack<T>(fn: Getter<T>): T
```

You just need to pass `Getter` function of `signal`.

```js
const [a, setA] = createSignal(true)
const [b, setB] = createSignal(true)

// has two dependency
createEffect(() => console.log(a(), b())) // true, true

// we can avoid one `signal` and can get value of that `signal`.
// has only one dependency
createEffect(() => console.log(a(), untrack(b))) // true, true

// ❌ passing getter function instead of `signal` value.
untrack(a()) 
untrack(b())

// ✅ always pass `signal` getter function only.
untack(a)
untrack(b)
```

### __`.unbatch()`__

May In some cases we want change `signal` value without doing batch. In that case we can use `.unbatch()`. It will bypass the batch process.

```ts
function unbatch(fn: function):void
```

```js
const [count, setCount] = createSignal(0)
let x = setInterval(() => unbatch(() => setCount(prev + 1)), 1000)
```

### __`.use()`__

```ts
function use<T>(directive: string | Function, value?: T, ...rest?: string[]): { handler: Function, value?: T, options?: string[]}
```

```js
// if global registered
use('html')
use('html', 123)
use('html', 1234, 'trim')

// or
use(() => {}, 123, 'trim')
```

### __`.global()`__

Get global registered values.

```ts
function global<T>(key: string): T
```

```js
// or <div>{ $.translate('hello', 'hi') }</div>
const translate = global('translate');
```

### __`.h()`__

Create virtual nodes that will render as actual DOM nodes after rendering.

```ts
function h(
    type: Component | string,
    props?: Props | null,
    children?: Children
): VNode
```

We can omit Props and directly use childrens, if you pass object `{}` as second argument, it will treated as props.

```js
// all arguments except the type are optional
h('div')

// omitting props
h('div', 'Hello Worlds!')
h('div', h('div'))
h('div', [h('div')])

// with props
h('div', {on: ['click', increament]})
h('div', {use: ['html', () => "<div>html code</div>"]})
h('div', {bind: value})
h('div', {name: "input-container"})
h('div', {user: () => users()[0]}) 

// with component
h(counter, (prop?: object) => "default value")
h(counter, {
    default: (prop?: object) => "default value",
    header: (prop?: object) => "header section"
})
```

## Syntax

Examples are divided into two groups, first when you are using `.h()` method and second when you are using `Pinaka` Compiler.

- __[normal](#normal)__
- __[events](#events)__
- __[dynamic props](#dynamic-props)__
- __[object binding](#object-binding)__
- __[style binding](#style-binding)__
- __[class binding](#class-binding)__
- __[list rendering](#list-rendering)__
- __[condiional rendering](#conditional-rendering)__
- __[refs](#refs)__
- __[directives](#directives)__
- __[components](#components)__
- __[slots](#slots)__
- __[built-in component & tags](#built-in-components--tags)__

### Normal

```js
h('div', 'Hello Worlds!')
h('div', h('div', 'Hello Worlds!'))
h('div',[ 
    h('div', 'Hello Worlds!'),
    h('div', 'Hello Worlds!')
])

// attributes
h('div', { id: 10, class: 'alert' }) 
h('div', { id: '10', class: 'alert' }, 'Alert message')
```
```html
<!-- TIP: we can use '<//>' as end tag for any start tag. -->
<div>Hello Worlds!</div>
<div><div>Hello Worlds!</div></div>
<div>
    <div>Hello Worlds!</div>
    <div>Hello Worlds!</div>
</div>

<!-- attributes -->
<div id="10" class="alert"></div>
<div id="10" class="alert">Hello Worlds!</div>
```

### Events

```js
// use 'on:' for defining element events
h('button', { 'on:click': () => console.log('Clicked') }, 'Click')

// with referenec
const clickHandler = () => console.log('Clicked')
h('button', { 'on:click': clickHandler }, 'Click')
```
```html
<button on:click={() => console.log('Clicked')}>Click</button>

<!-- with reference -->
<button on:click={clickHandler}>Click</button>
```

### Dynamic Props

```js
const [src, setSrc] = createSignal('./path/image.png')

h('img', { src, alt: "image" })
```

```html
<img src={src}  alt="image">
```

### Object binding

```js
// use 'bind' reserved props for binding objects
// we can use a function which returns a obejct or directly use a object.
const object = { id: 1, name: 'box' }

h('h1', { bind: object })

// use signal for dynamic binding
const [obj, setObj] = createSignal({ id: 1, name: 'box' })
h('h1', { bind: obj }) // you can also use it as, '{bind: obj()}', but this time, it will not track `signal` changes.

// we can use function
h('h1', { bind: () => ({ options: [], ...obj() }) })
```

```html
<h1 bind={object}></h1>

<!-- in compiler based, 'signals' are always tracked. -->
<h1 bind={obj()}></h1>

<h1 bind={{ id: 1 }}></h1>
```

### Class binding

```js
// can be string, array of strings or an object with key and boolean value.
const [error, setError] = createSignal(true)

// class binding
h('h2', { class: { error: error, success: false } })

const [cls, setCLS] = createSignal({  })
h('h2', { class: cls })
// or h('h2', { class: () => cls() })
```

```jsx
<h2 class={['val', 'err1']}></h2>
<h2 class={{ error: error, success: false }}></h2>
<h2 class={cls()}></h2>
```

### Style Binding
```js
const [style, setStyle] = createSignal({
    'font-size': '14px'
})

// class binding
h('h2', { style })
h('h2', { style: () => style() })
h('h2', { style: [() => style(), { }, ...] })
```

```html
<h2 style={style}></h2>
```

### List rendering

```js
// value must be Array or object litral
const [list, setList] = createSignal([
    { id: 1, text: 'user 1' },
    { id: 2, text: 'user 2' }
]);

h('p:each', { list: list, key: (item, i) =>  item.id}, (item, i) => h('li', item.text))
```

```html
<li each={list() as obj, index} key={obj.id}>
    { obj.text }
</li>
```

### Conditional rendering

```js
const [count, setCount] = createSignal(10)

h('p:case', [
    h('h2', { if: () => count() == 0 }, 'Equal to 0'),
    h('h2', { if: () => count() > 0 }, 'Greater than 0'),
    h('h2', 'Less than 0')
])
```
```jsx
<div if={count() == 0}>Equal to 0</div>
<div elseif={count() > 0}>Greater than 0</div>
<div else>Less than 0</div>
```

### Refs

```js
const input = createRef()

h('input', { ref: input })

console.log(input()) // HTMLInputElement
```
```html
<div ref={input}></div>
```

### Directives

```js
// see type Directive
const html = (el, value, options) => {
    // do something as element is rendered

    return {
        update(newValue) {
            //
        },
        destroy() {
            // element is going to destroy
        }
    }
}

// @see 'use' function.
// use('html', 123, 'other')
// [use(...), use(...), ...]
h('h2', { use: use(html) })
```
```html
<h2 use:html></h2>
<h2 use:html use:text></h2>
<h2 use:html:extra={cin}></h2>
```
### Components

```js
const Counter = () => {}

h(Counter, {}, () => 'Child Node')
```
```html
<Counter>Child Node<//>
```

### Slots

```js
const Counter = (props, { slots }) => {
    return [
        h('p:slot', { id: 10 }, slots.default || 'No default slot'),
        h('p:slot', { id: 10 }, slots.header || 'No header slot')
    ]
}

h(Counter, () => "Default content") // default slot
h(Counter, {
    default: ({ id }) => "default slot",
    header: ({ id }) => "header slot"
})
```
```jsx
<!-- Counter components -->
<p:slot id={10}>No default slot<//>
<p:slot id={10} name="header">No header slot<//>


<counter slot:={{ id }}>
    default slot
    <p:fragment slot:header={{ id }}>header slot<//>
<//>
```

### Built-in Components & Tags

```js 
// Native Fragment, directly use array
// P:fragment is allowed only in compiler based bundler.
[
    h('h2', 'Hello Worlds!'),
    h('h2', 'Hello Worlds!')
]

// create html comment
h('p:comment', 'Comment goes here')

// create portal
h('p:portal', { target: document.querySelector("#modal") }, "Content here")

// show dynamic component
h('p:component', {  
    keepAlive: 0, // least recently component will die
}, {
    default: Counter
    errorComponent: Error,
    loadingComponent: Loading
})
```
```html
<p:fragment>
    <h2>Hello Worlds!</h2>
    <h2>Hello Worlds!</h2>
<//>

<!-- comment goes here -->
<p:comment>comment goes here<//>

<p:portal target={document.querySelector('#modal')}>
    Content here    
<//>

<p:component keepAlive={0}>
    <Counter />
    <p:fragment slot:error />
    <p:fragment slot:loading />
<//>
```
