function Test() {
	<MyComp this="a" prop="a">
		<div this="b"></div> 
		{<div this="c"></div>}
		<div this={'a' + 'b'}></div>
	</MyComp>
}