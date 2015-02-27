

var color1 = document.getElementById("color1");
var picker1 = new ColorPicker(color1);

var color2 = document.getElementById("color2");
var picker2 = new ColorPicker(color2);

var color3 = document.getElementById("color3");
var picker3 = new ColorPicker(color3, "rgb");

var color4 = document.getElementById("color4");
var picker4 = new ColorPicker(color4, "hsl");

var color5 = document.getElementById("color5");
var picker5 = new ColorPicker(color5, "hsl");


var form = document.forms[0];
form.addEventListener("submit", function(e) {
	console.log("submit, abort");
	e.preventDefault();
});