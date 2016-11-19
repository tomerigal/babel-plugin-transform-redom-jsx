### Usage

``` bash
npm install babel-plugin-redom-jsx --save-dev
```

babel config:

``` json
{
    "plugins": [
        "babel-plugin-redom-jsx",
        ["transform-react-jsx", {
            "pragma": "el"
        }]
    ]
}
```

The plugin transpiles the following JSX:

``` jsx
<h1 class="hello-world">Hello World</h1>;
```

To the following JavaScript:

``` js
el(
  'h1',
  { 'class': 'hello-world' },
  'Hello World'
);
```

### Assign to this

The plugin transpiles the following JSX:

``` jsx
class AssignExample {
  constructor () {
    this.el = <div>
      <span this="target">Hello World</span>
      {this.input = <input type="text" />}
    </div>
  }
}
```

To the following JavaScript:

``` js
class AssignExample {
  constructor () {
    this.el = el(
        'div',
        null,
        this['target'] = el(
            'span',
            null,
            'Hello World'
        ),
        this.input = el('input', { type: 'text' })
    );
  }
}
```