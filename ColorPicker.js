(function() {
	"use strict";
	var someOpen=false;

	var FORMAT_RGB = 'rgb';
	var FORMAT_HSL = 'hsl';
	var FORMAT_HEX = 'hex';


	var ColorPicker = function(o) {
		var me = this;
		o = o || {};

		if(o.input) {
			me.input = o.input;
			me.input.addEventListener("click", function(e) {
				var startColor = e.target.value;
				me.open(startColor);
			}, false);
		}

		me.format = o.format || FORMAT_HEX;
		me.autoUpdate = o.autoUpdate || true;
		me.onchange = o.onchange || null;

		me.values = {
			r:0, g:0, b:0,
			h:0, s:0, v:0,
			a: 1
		};

	};


	ColorPicker.prototype = {

		open: function(startColor) {
			console.debug("create tool");
			someOpen=true;
			this.close();

			this.startValue = startColor;

			if(this.input) {
				this.keyDownBinding = this.keyDown.bind(this);
				this.input.addEventListener("keydown", this.keyDownBinding, false);
			}


			this.picker = document.createElement("div");
			this.picker.classList.add("xcp_picker");
			this.picker.addEventListener("mousedown", this.pickerMouseDown.bind(this));
			this.picker.css({top: 10, left: 400});
			document.body.appendChild(this.picker);

			this.main = document.createElement("div");
			this.main.classList.add("xcp_main");
			this.picker.appendChild(this.main);

			this.color = document.createElement("div");
			this.color.classList.add("xcp_color");
			this.main.appendChild(this.color);

			this.saturation = document.createElement("div");
			this.saturation.classList.add("xcp_saturation");
			this.color.appendChild(this.saturation);

			this.value = document.createElement("div");
			this.value.classList.add("xcp_value");
			this.value.dataset.component = "saturation/value";
			this.saturation.appendChild(this.value);

			this.saturationMark = document.createElement("div");
			this.saturationMark.classList.add("xcp_mark", "xcp_saturation_marker");
			this.saturationMark.dataset.component = "saturation";
			this.value.appendChild(this.saturationMark);

			this.valueMark = document.createElement("div");
			this.valueMark.dataset.component = "value";
			this.valueMark.classList.add("xcp_mark", "xcp_value_marker");
			this.value.appendChild(this.valueMark);

			this.colorPoint = document.createElement("div");
			this.colorPoint.dataset.component = "saturation/value";
			this.colorPoint.classList.add("xcp_point");
			this.value.appendChild(this.colorPoint);

			this.hue = document.createElement("div");
			this.hue.classList.add("xcp_hue");
			this.hue.dataset.component = "hue";
			this.main.appendChild(this.hue);

			this.hueMark = document.createElement("div");
			this.hueMark.classList.add("xcp_mark", "xcp_hue_marker");
			this.hueMark.dataset.component = "hue";
			this.hue.appendChild(this.hueMark);

			this.footer = document.createElement("div");
			this.footer.classList.add("xcp_footer");
			this.picker.appendChild(this.footer);



			if(this.startValue) {
				this.before = document.createElement("div");
				this.before.classList.add("xcp_before");
				this.footer.appendChild(this.before);

				this.arrow = document.createElement("div");
				this.arrow.classList.add("xcp_arrow");
				this.footer.appendChild(this.arrow);
			}

			this.result = document.createElement("div");
			this.result.classList.add("xcp_result");
			this.footer.appendChild(this.result);

			this.fields = document.createElement("div");
			this.fields.classList.add("xcp_fields");
			this.footer.appendChild(this.fields);

			this.btnOk = document.createElement("button");
			this.btnOk.type = "button";
			this.btnOk.classList.add("xcp_button");
			this.btnOk.innerHTML = "OK";
			this.btnOk.addEventListener("click", this.clickOk.bind(this));
			this.footer.appendChild(this.btnOk);

			this.btnCancel = document.createElement("button");
			this.btnCancel.type = "button";
			this.btnCancel.classList.add("xcp_button");
			this.btnCancel.innerHTML = "Cancel";
			this.btnCancel.addEventListener("click", this.clickCancel.bind(this));
			this.footer.appendChild(this.btnCancel);

			this.outputRGB = document.createElement("div");
			this.outputRGB.classList.add("output");
			this.fields.appendChild(this.outputRGB);

			this.outputHEX = document.createElement("div");
			this.outputHEX.classList.add("output");
			this.fields.appendChild(this.outputHEX);



			if(this.startValue) {
				this.parseInput(this.startValue);
				this.before.style.backgroundColor = this.getRGB();
			} else {
				this.updateInputs();
				this.updateMarkers();
			}
		},

		updateInputs: function() {
			this.outputRGB.innerHTML = this.getRGB();
			this.outputHEX.innerHTML = this.getHex();

			if(this.autoUpdate) {
				this.updateInput();
			}

			this.result.style.backgroundColor = this.getRGB();
			this.color.style.backgroundColor = 'hsl('+360*(this.values.h)+',100%,50%)';
		},

		getRGB: function() {
			var r=this.values.r,
				g=this.values.g,
				b=this.values.b,
				a=this.values.a;

			if(a<1) {
				return "rgba("+r+","+g+","+b+","+a+")";
			} else {
				return "rgb("+r+","+g+","+b+")";
			}
		},

		getHSL: function() {
			var h=Math.round(this.values.h*360),
				s=Math.round(this.values.s*100),
				l=Math.round(this.values.v*100),
				a=this.values.a;

			if(a<1) {
				return "hsla("+h+","+s+"%,"+l+"%,"+a+")";
			} else {
				return "hsl("+h+","+s+ "%,"+l+"%)";
			}
		},

		getHex: function() {
			var r = componentToHex(this.values.r),
				g = componentToHex(this.values.g),
				b = componentToHex(this.values.b);
			return "#"+r+g+b;

			function componentToHex(dec) {
				var hex = dec.toString(16);
				if(hex.length==1) hex="0"+hex;
				return hex;
			}
		},


 		updateMarkers: function() {
			var width = 200;
			var hueWidth = Math.round(width/8);

			var hueTop = (1-this.values.h) * width;
			var saturationLeft = this.values.s * width;
			var valueTop = (1-this.values.v) * width;

			this.hue.css({width:hueWidth});
			this.hueMark.css({width:hueWidth, top:hueTop-2});

			this.saturationMark.css({height:(width-2), left:saturationLeft-2});
			this.valueMark.css({width:(width), top:valueTop-2});
			this.colorPoint.css({top:valueTop-6, left:saturationLeft-6, backgroundColor: this.getHex()});
		},


		setRGB: function(r, g, b) {
			this.values.r = r;
			this.values.g = g;
			this.values.b = b;
			var hsv = rgb2hsv(r, g, b);
			this.values.h = hsv.h;
			this.values.s = hsv.s;
			this.values.v = hsv.v;
			console.log("Set color", this.values);
			this.updateInputs();
			this.updateMarkers();
		},

		updateRGB: function() {
			var rgb = hsv2rgb(this.values.h, this.values.s, this.values.v);
			this.values.r = Math.round(rgb.r);
			this.values.g = Math.round(rgb.g);
			this.values.b = Math.round(rgb.b);
			this.updateInputs();
			this.updateMarkers();
		},

		setHex: function(newHex) {
			if(!newHex) this.setRGB(255,255,255);
			newHex = newHex.trim().replace("#","");
			var r,g,b;
			if(newHex.search(/^[A-F0-9]{3}$/i)==0) {
				r = parseInt(newHex.substr(0,1), 16);
				g = parseInt(newHex.substr(1,1), 16);
				b = parseInt(newHex.substr(2,1), 16);
				console.log(r, g, b);
			} else if(newHex.search(/^[A-F0-9]{6}$/i)==0) {
				r = parseInt(newHex.substr(0,2), 16);
				g = parseInt(newHex.substr(2,2), 16);
				b = parseInt(newHex.substr(4,2), 16);
				console.log(r, g, b);
			} else {
				console.warn("Invalid Hex color:", newHex);
				return false;
			}
			this.setRGB(r, g, b);
		},

		parseInput: function(input) {
			var div = document.createElement('div'), m;
			div.style.color = input;
			console.debug("parseColor", input, div.style.color, div);
			m = div.style.color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
			if(m) {
				this.setRGB(parseInt(m[1]),parseInt(m[2]),parseInt(m[3]));
				return;
			}

			m = div.style.color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9]*[.][0-9]+)\s*\)$/i);
			if(m) {
				this.values.a = m[4];
				this.setRGB(parseInt(m[1]),parseInt(m[2]),parseInt(m[3]));
				return;
			} else {
				throw new Error("Color "+input+" could not be parsed.");
			}
		},

		pickerMouseDown: function(e) {
			var me = this;
			if(e.button!==0) return;
			console.debug("pickerMouseDown", e.target);

			var action = e.target.dataset.component;
			if(!action) return;

			addEventListener("mousemove", pickerMouseMove, false);
			addEventListener("mouseup", pickerMouseUp, false);
			pickerMouseMove(e);
			e.stopPropagation();


			function pickerMouseUp(e) {
				console.debug("pickerMouseUp");
				action="";
				removeEventListener("mousemove", pickerMouseMove, false);
				removeEventListener("mouseup", pickerMouseUp, false);
			}

			function pickerMouseMove(e) {
				console.log("move", action);
				var width = 200;

				if(action==="hue") {
					var offsetY = e.pageY - me.hue.position().top - me.picker.position().top;
					if(offsetY<0) offsetY=0;
					else if(offsetY>width) offsetY=width;
					me.values.h = 1-offsetY/width;
				} else {
					if(action==="saturation/value" || action==="saturation") {
						var offsetX = e.pageX - me.color.position().left - me.picker.position().left;
						if(offsetX<0) offsetX=0;
						else if(offsetX>width) offsetX=width;
						me.values.s = offsetX/width;
					}
					if(action==="saturation/value" || action==="value") {
						var offsetY = e.pageY - me.color.position().top - me.picker.position().top;
						if(offsetY<0) offsetY=0;
						else if(offsetY>width) offsetY=width;
						me.values.v = 1-offsetY/width;
					}
				}
				me.updateRGB();
				e.preventDefault();
			}
		},

		clickOk: function(e) {
			this.updateInput();
			this.close();
		},

		updateInput: function() {
			var output = "";
			switch(this.format) {
				case FORMAT_RGB: output = this.getRGB(); break;
				case FORMAT_HSL: output = this.getHSL(); break;
				default: output = this.getHex();
			}
			if(this.onchange) {
				this.onchange(output);
			} else if(this.input) {
				this.input.value = output;
			}
		},

		clickCancel: function() {
			if(this.autoUpdate) {
				if(this.input) {
					this.input.value = this.startValue;
				} else if(this.onchange) {
					this.onchange(this.startValue);
				}
			}
			this.close();
		},


		keyDown: function(e) {
			switch(e.which) {
				case 13: //Enter
				this.clickOk();
				console.log("click ok");
				e.preventDefault();
				break;

				case 27: //Esc
				this.clickCancel();
				break;
			}
		},

		close: function() {
			if(this.picker) {
				document.body.removeChild(this.picker);
				this.picker=null;
			}
			if(this.input) {
 				this.input.removeEventListener("keydown", this.keyDownBinding, false);
			}
		}


	}





	window.ColorPicker = ColorPicker;


	function elem(id) {
		return document.getElementById(id);
	}

	function hsv2rgb(h, s, v){
		var r, g, b;

		var i = Math.floor(h * 6);
		var f = h * 6 - i;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);

		switch(i % 6){
			case 0: r = v, g = t, b = p; break;
			case 1: r = q, g = v, b = p; break;
			case 2: r = p, g = v, b = t; break;
			case 3: r = p, g = q, b = v; break;
			case 4: r = t, g = p, b = v; break;
			case 5: r = v, g = p, b = q; break;
		}

		return {r:r*255, g:g*255, b:b*255};
	}

	function rgb2hsv(r, g, b){
		r = r/255, g = g/255, b = b/255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, v = max;

		var d = max - min;
		s = max == 0 ? 0 : d / max;

		if(max == min){
			h = 0; // achromatic
		}else{
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}

		return {h:h, s:s, v:v};
	}


	Element.prototype.css = function(settings) {
		var pixelProps = ["left", "top", "right", "bottom", "width", "height"];
		var elem = this;
		for (var prop in settings) {
			if(pixelProps.indexOf(prop)!=-1) {
				elem.style[prop] = settings[prop] + "px";
			}
			elem.style[prop] = settings[prop];
		}
	};
	Element.prototype.position = function() {
		var elem = this;
		return {top:elem.offsetTop, left:elem.offsetLeft};
	};

}());