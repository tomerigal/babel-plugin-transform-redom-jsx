'use strict';

module.exports = function (babel) {
	var t = babel.types;
	return {
		name: "ast-transform",
		visitor: {
			JSXElement: function JSXElement(path) {
				var thisAttr = [];
				var restAttr = [];
				path.node.openingElement.attributes.forEach(function (attr) {
					return (attr.name.name === 'this' ? thisAttr : restAttr).push(attr);
				});

				if (thisAttr.length) {
					var attr = thisAttr[thisAttr.length - 1];
          				var thisMember = t.isJSXExpressionContainer(attr.value) ? attr.value.expression : attr.value;
          				var assignToThis = t.assignmentExpression('=', t.memberExpression(t.thisExpression(), thisMember, true), path.node);            
        				path.node.openingElement.attributes = restAttr;  
        				path.replaceWith(t.isJSXElement(path.parent) ? t.jSXExpressionContainer(assignToThis) : assignToThis);
				}
			}
		}
	};
};
