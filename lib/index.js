module.exports = function(babel) {
  var t = babel.types;

  return {
    inherits: require("@babel/plugin-syntax-jsx").default,
    name: "transform-redom-jsx",
    visitor: {
      JSXElement(path, file) {
        const thisAttr = [];
        const restAttr = [];
        const isComponent = path.node.openingElement.name.name.match(/^[A-Z]/);
        let node = path.node;

        for (const attr of path.node.openingElement.attributes) {
          if (t.isJSXSpreadAttribute(attr)) {
            restAttr.push(attr);
          } else if (attr.name.name === "this") {
            thisAttr.push(attr);
          } else {
            restAttr.push(attr);
          }
        }

        if (isComponent) {
          var attribObj = restAttr.length
            ? buildOpeningElementAttributes(restAttr, file)
            : t.objectExpression([]);
          var children = t.react.buildChildren(path.node).map(node => {
            if (t.isLiteral(node)) {
              return t.callExpression(t.identifier("text"), [node]);
            }
            return node;
          });

          node = t.newExpression(
            t.identifier(path.node.openingElement.name.name),
            [attribObj].concat(children)
          );
        }

        if (thisAttr.length) {
          const attr = thisAttr[thisAttr.length - 1];
          const thisMember = t.isJSXExpressionContainer(attr.value)
            ? attr.value.expression
            : attr.value;
          const assignToThis = t.assignmentExpression(
            "=",
            t.memberExpression(t.thisExpression(), thisMember, true),
            node
          );
          path.node.openingElement.attributes = restAttr;
          node = t.isJSXElement(path.parent)
            ? t.jSXExpressionContainer(assignToThis)
            : assignToThis;
        }

        if (node !== path.node) {
          path.replaceWith(node);
        }
      }
    }
  };

  function convertAttributeValue(node) {
    if (t.isJSXExpressionContainer(node)) {
      return node.expression;
    } else {
      return node;
    }
  }

  function convertAttribute(node) {
    let value = convertAttributeValue(node.value || t.booleanLiteral(true));

    if (t.isStringLiteral(value) && !t.isJSXExpressionContainer(node.value)) {
      value.value = value.value.replace(/\n\s+/g, " ");
    }

    if (t.isValidIdentifier(node.name.name)) {
      node.name.type = "Identifier";
    } else {
      node.name = t.stringLiteral(node.name.name);
    }

    return t.inherits(t.objectProperty(node.name, value), node);
  }

  function buildOpeningElementAttributes(attribs, file) {
    let _props = [];
    let objs = [];

    let useBuiltIns = file.opts.useBuiltIns || false;
    if (typeof useBuiltIns !== "boolean") {
      throw new Error(
        "transform-react-jsx currently only accepts a boolean option for useBuiltIns (defaults to false)"
      );
    }

    function pushProps() {
      if (!_props.length) return;

      objs.push(t.objectExpression(_props));
      _props = [];
    }

    while (attribs.length) {
      let prop = attribs.shift();
      if (t.isJSXSpreadAttribute(prop)) {
        pushProps();
        objs.push(prop.argument);
      } else {
        _props.push(convertAttribute(prop));
      }
    }

    pushProps();

    if (objs.length === 1) {
      // only one object
      attribs = objs[0];
    } else {
      // looks like we have multiple objects
      if (!t.isObjectExpression(objs[0])) {
        objs.unshift(t.objectExpression([]));
      }

      const helper = useBuiltIns
        ? t.memberExpression(t.identifier("Object"), t.identifier("assign"))
        : file.addHelper("extends");

      // spread it
      attribs = t.callExpression(helper, objs);
    }

    return attribs;
  }
};
