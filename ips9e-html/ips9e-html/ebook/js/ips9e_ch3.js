var MathJaxMap = {};


MathJaxMap['math_1'] = '<math display=\'block\'><mrow><mfrac><mrow><mn>12</mn></mrow><mrow><mn>120</mn></mrow></mfrac><mo>=</mo><mfrac><mrow><mn>200</mn></mrow><mi>N</mi></mfrac></mrow></math>';
MathJaxMap['math_2'] = '<math display=\'block\'><mrow><mi>N</mi><mo>=</mo><mn>200</mn><mo>&#x00D7;</mo><mfrac><mrow><mn>120</mn></mrow><mrow><mn>12</mn></mrow></mfrac><mo>=</mo><mn>2000</mn></mrow></math>';



for (var key in MathJaxMap) {
  
  if (MathJaxMap.hasOwnProperty(key)) {
    $('[data-math=' + key + ']').html(MathJaxMap[key]);
  }
}

$.ajaxSetup({
  cache: true
});

//configure the mathjax engine
window.MathJax = {
	"HTML-CSS": {
		mtextFontInherit: true,
		scale: 98,
		minScaleAdjust: 100,
		noReflows:false 
	},
	MathML: {
		useMathMLspacing: false
	},
	menuSettings: {
		zoom: "Click"	
	},
	MathMenu: {
		showFontMenu: true
	}
	
  };

$.getScript( "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"); 
