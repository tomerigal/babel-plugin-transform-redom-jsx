# babel-plugin-transform-react-jsx

## Installation

``` bash
npm install babel-plugin-redom-jsx --save-dev
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

### Assign to this

The plugin transpiles the following JSX:

``` jsx
import { el, mount } from 'redom';

// define Login component
class Login {
  constructor () {
    this.el = <form id="login" onsubmit={(e) => {
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

// create login
const login = new Login();

// mount to DOM
mount(document.body, login);
```

To the following JavaScript:

``` js
import { el, mount } from 'redom';

// define Login component
class Login {
  constructor () {
    this.el = el(
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

// create login
const login = new Login();

// mount to DOM
mount(document.body, login);
```