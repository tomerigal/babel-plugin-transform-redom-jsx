'use strict';

module.exports = function (babel) {
	var t = babel.types;
	return {
		name: "ast-transform",
		visitor: {
			JSXElement: function JSXElement(path) {
				var thisAttr = [];
				var notThisAttr = [];
				path.node.openingElement.attributes.forEach(function (attr) {
					return (attr.name.name === 'this' ? thisAttr : notThisAttr).push(attr);
				});

				if (thisAttr.length) {
					var assignToThis = t.assignmentExpression('=', t.memberExpression(t.thisExpression(), thisAttr[thisAttr.length - 1].value, true), path.node);
					path.node.openingElement.attributes = notThisAttr;
					path.replaceWith(path.parent.type === 'JSXElement' ? t.jSXExpressionContainer(assignToThis) : assignToThis);
				}
			}
		}
	};
};