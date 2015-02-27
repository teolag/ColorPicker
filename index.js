var blobb = document.getElementById("blobb");
var picker = new ColorPicker({
	onchange: blobbOnChange
});

blobb.addEventListener("click", function(e) {
	var startColor = getComputedStyle(e.target).backgroundColor;
	picker.open(startColor);
});

function blobbOnChange(value) {
	blobb.style.backgroundColor = value;
}





var color1 = document.getElementById("color1");
var picker1 = new ColorPicker({input:color1});

var color2 = document.getElementById("color2");
var picker2 = new ColorPicker({input:color2});

var color3 = document.getElementById("color3");
var picker3 = new ColorPicker({input:color3, format:"rgb"});

var color4 = document.getElementById("color4");
var picker4 = new ColorPicker({input:color4, format:"hsl"});

var color5 = document.getElementById("color5");
var picker5 = new ColorPicker({input:color5, format:"hsl"});


var form = document.forms[0];
form.addEventListener("submit", function(e) {
	console.log("submit, abort");
	e.preventDefault();
});