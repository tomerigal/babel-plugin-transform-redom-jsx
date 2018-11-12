function Test() {
	this["a"] = <MyComp>
		{this["b"] = <div></div>}
		{this["c"] = <div></div>}
		{this['a' + 'b'] = <div></div>}
	</MyComp>;
}