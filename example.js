(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";


	function State(options) {
		if (typeof options == "object") {

		}
	}

	var cmColor = new ColorPicker({
		onChange: cmColorChange,
		autoUpdate: false
	});

	CodeMirror.defineOption("colorpicker", false, function(cm, val, old) {
		if (old && old != CodeMirror.Init) {
			cm.state.colorpicker = null;
			cm.off("cursorActivity", cursorActivity);
		}
		if (val) {
			cm.state.colorpicker = new State(val);
			cm.on("cursorActivity", cursorActivity);
		}
	});

	function cmColorChange(color) {
		console.log("colorchange", color);
		cm.doc.replaceSelection(color, "around");
	}

	function cursorActivity(me) {
		//console.log("cursorActivity", me);

		var selection = me.doc.getSelection();
		console.log("select", selection);

		if(selection.search(/^#?[A-F0-9]{6}$/i)==0 ||
		  selection.search(/^rgba?\(.*?\)$/i)==0 ||
		  selection.search(/^hsla?\(.*?\)$/i)==0) {
			cmColor.open(selection);
		} else {
			cmColor.close();
		}
	}
});








var blobb = document.getElementById("blobb");
var picker = new ColorPicker({
	onChange: blobbOnChange,
	format: 'rgb',
	useAlpha: false
});

blobb.addEventListener("click", function(e) {
	var startColor = getComputedStyle(e.target).backgroundColor;
	picker.open(startColor);
});

function blobbOnChange(value) {
	console.log("value change", value);
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

var textarea = document.getElementById("textarea");
var cm = CodeMirror.fromTextArea(textarea, {
	lineNumbers: true,
	colorpicker: true
});








var form = document.forms[0];
form.addEventListener("submit", function(e) {
	console.log("submit, abort");
	e.preventDefault();
});