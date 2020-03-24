function Test() {
	this["a"] = new MyComp({prop:"a"},
		this["b"] = <div></div>,
		this["c"] = <div></div>,
		this['a' + 'b'] = <div></div>
	);
}