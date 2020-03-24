function Test() {
	this["a"] = new MyComp({},
		this["b"] = <div></div>, 
		this["c"] = <div></div>,
		this['a' + 'b'] = <div></div> 
	);
}