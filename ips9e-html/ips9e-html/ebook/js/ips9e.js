xBookUtils.bookID = "ips9e";

var Player_subtype = Player_manuscript_type.extend({
    
    //cfg_removeRawHtmlDivs: "on",

    //cfg_showAnswer: "on",
    //cfg_showAnswerAutoWrapThis: "off",
    
    //cfg_Box_moveTitle: "all",
    //cfg_Box_moveTitleExclude: "",

    //cfg_Figures_targetDefault: "_blank",
    //cfg_Figures_resizeDivWidth: "off",

    //cfg_Figures_autoHtml: "on",
    //cfg_LH_autoHtml: "on",

    //cfg_LH_externalTargetDefault: "_pop",
    //cfg_LH_internalTargetDefault: "_pop",
    //cfg_LH_ebookTargetDefault: "_pop",
    //cfg_LH_imageTargetDefault: "_blank",

    cfg_LH_useOpenContent: "on",
    //cfg_LH_useLinksFile: "on",
    
    //cfg_Glossary_hoverTerms: "on",
    //cfg_Glossary_useStickyDiv: "on",
    //cfg_Glossary_hoverTermsNoClick: "",

    initialize_sections: function() {
	
	// Do not delete this
	this._super();
	
        // Add custom JS code below. Anything that needs to be done before
	// the page displays should be done here.


	
	
    }, // end initialize_sections
    
    /* 
       You will most likely not make any changes to the initialize method.
    */
    initialize: function(id) {
	
	// Do not delete this
	this._super(id);

	// Don't delete these unless you know exactly what you are doing :-)
	this.xrefs = new XRefs_manuscript_subtype();
	this.glossary = new Glossary_manuscript_subtype();
        this.figures = new Figures_manuscript_subtype();
	this.tables = new Tables_manuscript_subtype();
	
    }, // end initialize
    
    initialize2: function() {
	
	// Do not delete this
    this._super();

	// You will most likely not want to delete this
	var link_handler = new LinkHandler();

	// Add custom JS code below. Anything that can be done after the
	// page displays should be done here.



    // all figures displaying on main page
    // figures aligned left need flagged as such (use a non digfir flag)
    // Why not just say "left"? Why not just take all values for align?
	$('[data-type="figure"][data-layout-align="left"]').each(function() {
		var left = $(this);
    		left.attr({align : left.attr('data-layout-align')});
	});
	// get rid of digfir styling
	$('[data-type="figure"]').removeAttr("data-layout-align");
	$('[data-type="figure"]').removeAttr("data-layout-width");
	$('[data-type="figure"]').removeAttr("style");
	// $('[data-block_type="h1"] [data-caption-compass]').removeAttr( "data-type" );
	$('[data-type="figure"] > img').removeAttr("data-layout-width");

	//now change the size of the image by a percentage
	//$('[data-block_type="h1"] [data-caption-compass]').each(function() {
	//	var scale = .20;
	//	image = $(this).find('img') //update... this will find caption images too. 
	//	var h = image.height() * scale;
	//	var w = image.width() * scale;
	//	image.css({ height: h, width: w });
	//});

	//if image needs caption "West" (to the left of table) flip caption and image so that caption comes first
	//and place extra div around img
	$('[data-block_type="h1"] [data-caption-compass*="W"]').each(function() {
		caption = $(this).find('div[data-type="figure_text"]');
		$(this).prepend(caption);
		$(this).remove('img + div[data-type="figure_text"]');
	});
	$('[data-block_type="h1"] [data-caption-compass*="W"] > img').wrap("<div class='compassImg'></div>");

        
    // common code for all popup requests - size/position of popup
    var pop_content = function(url, w, h) {
        var path = window.location.pathname;
	    var newWin = window.open(url,'_blank','width='+w+',height='+h+',menubar=0,location=0,scrollbars=yes','');
	    newWin.moveTo(150, 150);
    };


//EXAMPLE LINKS
        // add link to popup on the example number
        $('[data-block_type="EXP"] > [data-type="box_inner"] > [data-block_type="EXP-N"]').click(function() {
            var exnum = $(this).find('p').text().replace(/EXAMPLE ([\d\.]+)/i, "$1");
            var supp_win = exnum.replace(/(\d+)\.(\d+)/, "asset/ch$1/supp_wins/examples/example_$1_$2.html");
	    pop_content(supp_win, "1020px", "500px");
        });


//NUMBERED FIGURE LINKS
	// add link on the figure image so it popup (
	$('[data-block_type="h1"] [data-caption-compass]  > .compassImg img').click(function() {
            var fignum = $(this).attr('src').replace(/fig_([\d_]+)/i, "$1");
            var supp_win = fignum.replace(/.*0?(\d+)_0?(\d+)\.jpg/, "asset/ch$1/supp_wins/figures/figure_$1_$2.html");
	    pop_content(supp_win, "1015px", "700px");
        });
        // add link on the figure image to popup 
	$('[data-block_type="h1"] [data-caption-compass]  > img').click(function() {
            var fignum = $(this).attr('src').replace(/fig_([\d_]+)/i, "$1");
            var supp_win = fignum.replace(/.*0?(\d+)_0?(\d+)\.jpg/, "asset/ch$1/supp_wins/figures/figure_$1_$2.html");
	    pop_content(supp_win, "1015px", "700px");
        });
	// add link on the figure number to popup
	$('[data-block_type="h1"] [data-caption-compass] [data-block_type="FG-N-ri"]').click(function() {
            var fignum = $(this).text().replace(/FIGURE ([\d\.]+)/i, "$1");
            var supp_win = fignum.replace(/(\d+)\.(\d+)/, "asset/ch$1/supp_wins/figures/figure_$1_$2.html");
	    pop_content(supp_win, "1015px", "700px");
        });
        
/* Create some sample HTML files for the different figures. Delete this code when done */
	
//now change the size of the image in the supp window by a percentage
	//15%
	$('body#supp_win > #manuscript > img.fifteen').each(function() {
		var scale = .23;
		image = $(this) //update... this will find caption images too. 
		var h = image.height() * scale;
		var w = image.width() * scale;
		image.css({ height: h, width: w });
	});
	
	//25%
	$('body#supp_win > #manuscript > img.twentyfive').each(function() {
		var scale = .25;
		image = $(this) //update... this will find caption images too. 
		var h = image.height() * scale;
		var w = image.width() * scale;
		image.css({ height: h, width: w });
	});
	//35%
	$('body#supp_win > #manuscript > img.thirtyfive').each(function() {
		var scale = .27;
		image = $(this) //update... this will find caption images too. 
		var h = image.height() * scale;
		var w = image.width() * scale;
		image.css({ height: h, width: w });
	});
$('[data-block_type="image1512"]').click(function() {
            var supp_win = "asset/ch1/supp_wins/figures/figure_1_12_15.html";
	    pop_content(supp_win, "1015px", "700px");
        });	
$('[data-block_type="image2512"]').click(function() {
            var supp_win = "asset/ch1/supp_wins/figures/figure_1_12_25.html";
	    pop_content(supp_win, "1015px", "700px");
        });
$('[data-block_type="image3512"]').click(function() {
            var supp_win = "asset/ch1/supp_wins/figures/figure_1_12_35.html";
	    pop_content(supp_win, "1015px", "700px");
        });
$('[data-block_type="image1514"]').click(function() {
            var supp_win = "asset/ch1/supp_wins/figures/figure_1_14_15.html";
	    pop_content(supp_win, "1015px", "700px");
        });	
$('[data-block_type="image2514"]').click(function() {
            var supp_win = "asset/ch1/supp_wins/figures/figure_1_14_25.html";
	    pop_content(supp_win, "1015px", "700px");
        });
$('[data-block_type="image3514"]').click(function() {
            var supp_win = "asset/ch1/supp_wins/figures/figure_1_14_35.html";
	    pop_content(supp_win, "1015px", "700px");
        });
$('[data-block_type="image1516"]').click(function() {
            var supp_win = "asset/ch1/supp_wins/figures/figure_1_16_15.html";
	    pop_content(supp_win, "1015px", "700px");
        });	
$('[data-block_type="image2516"]').click(function() {
            var supp_win = "asset/ch1/supp_wins/figures/figure_1_16_25.html";
	    pop_content(supp_win, "1015px", "700px");
        });
$('[data-block_type="image3516"]').click(function() {
            var supp_win = "asset/ch1/supp_wins/figures/figure_1_16_35.html";
	    pop_content(supp_win, "1015px", "700px");
        });







	
	// New feature to allow table columns to align content by character.
	// This should always come after any custom JS code you add.  If you
	// do not have any tables that need to be aligned by character then you
	// can comment this out.
	this.tables.align_columns();
	
    } // end initialize2
    
}); // end Player_subtype


// Do not delete this
player = new Player_subtype();
