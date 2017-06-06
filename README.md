# babel-plugin-transform-redom-jsx

## Installation

``` bash
npm install babel-plugin-transform-redom-jsx --save-dev
```

## Usage

### Babel config:

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

### Component

The plugin transpiles the following JSX:

``` jsx
import { el, text, mount } from 'redom';
class A{
  constructor(attr, text) {
    <div this="el">
      <h3>{attr.title}</h3>
      <span this="span">Hello</span> {text}
    </div>;
  }
  update(){
    this.span.textContent = "Hi";
  }
}

class B{
  constructor() {
    <div this="el">
      <A this="a" title="Hello World example">
        <span this="span">World</span>
      </A>
    </div>;
  }
  update() {
    this.span.textContent = "You";
    this.a.update();
  }
}

const b = <B />;

mount(document.body, b);

b.update();
```

To the following JavaScript:
``` js
import { el, text, mount } from 'redom';
class A{
  constructor(attr, text) {
    this["el"] = el(
      "div",
      null,
      el(
        "h3",
        null,
        attr.title
      ),
      this["span"] = el(
        "span",
        null,
        "Hello"
      ),
      " ",
      text
    );
  }
  update(){
    this.span.textContent = "Hi";
  }
}

class B{
  constructor() {
    this["el"] = el(
      "div",
      null,
      this["a"] = new A({ title: "Hello World example" }, this["span"] = el(
        "span",
        null,
        "World"
      ))
    );
  }
  update() {
    this.span.textContent = "You";
    this.a.update();
  }
}

const b = new B({});

mount(document.body, b);

b.update();
```

### Assign to this

The plugin transpiles the following JSX:

``` jsx
import { el, mount } from 'redom';

// define Login component
class Login {
  constructor () {
    <form this="el" id="login" onsubmit={(e) => {
      e.preventDefault();
      const email = this.email.value;
      const pass = this.pass.value;
      console.log(email, pass);
    }}>
      <input type="email" class="email" this="email" />
      <input type="password" class="pass" this="pass" />
      <button type="submit">Sign in</button>
    </form>
  }
}

// mount to DOM
mount(document.body, <Login/>);
```

To the following JavaScript:

``` js
import { el, mount } from 'redom';

// define Login component
class Login {
  constructor () {
    this["el"] = el(
      "form",
      { id: "login", onsubmit: (e) => {
          e.preventDefault();
          const email = this.email.value;
          const pass = this.pass.value;
          console.log(email, pass);
      } },
      this["email"] = el("input", { type: "email", "class": "email" }),
      this["pass"] = el("input", { type: "password", "class": "pass" }),
      el(
        "button",
        { type: "submit" },
        "Sign in"
      )
    );
  }
}

// mount to DOM
mount(document.body, new Login());
```
