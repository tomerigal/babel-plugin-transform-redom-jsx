class Component {
	constructor() {
		this["el"] = list(new Ul({}).el, Li);
	}
}