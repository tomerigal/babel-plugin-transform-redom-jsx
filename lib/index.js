module.exports = function(babel) {
  var t = babel.types;

  return {
    inherits: require("@babel/plugin-syntax-jsx").default,
    name: "redom-jsx-transform",
    visitor: {
      JSXElement(path) {
        const thisAttr = [];
        const restAttr = [];
        for (const attr of path.node.openingElement.attributes) {
          if (t.isJSXSpreadAttribute(attr)) {
            restAttr.push(attr);
          } else if (attr.name.name === "this") {
            thisAttr.push(attr);
          } else {
            restAttr.push(attr);
          }
        }

        if (thisAttr.length) {
          const attr = thisAttr[thisAttr.length - 1];
          const thisMember = t.isJSXExpressionContainer(attr.value)
            ? attr.value.expression
            : attr.value;
          const assignToThis = t.assignmentExpression(
            "=",
            t.memberExpression(t.thisExpression(), thisMember, true),
            path.node
          );
          path.node.openingElement.attributes = restAttr;
          path.replaceWith(
            t.isJSXElement(path.parent)
              ? t.jSXExpressionContainer(assignToThis)
              : assignToThis
          );
        }
      }
    }
  };
};
