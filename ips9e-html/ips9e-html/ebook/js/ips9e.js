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
    cfg_LH_useLinksFile: "on",
    
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

        //*****************DEVLIONS***********************

	var chapter_number = $('#manuscript').attr("data-chapter-number");

        // remove all default DF click/mouseup events from image tags
	$('img').unbind();


        //TABLES
        // Adjust table widths according to the percentage specified in the "data-attr" attribute
	$('div[data-type="table"]').each(function () {
	    var twidth = $(this).attr('data-attr') * 6.75; // assuming 675px width of main content (not including page margins)
	    $(this).find('table').css('width', twidth);
	});

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


	//if image needs caption "West" (to the left of table) flip caption and image so that caption comes first
	//and place extra div around img
	$('[data-block_type="h1"] [data-caption-compass*="W"]').each(function() {
		caption = $(this).find('div[data-type="figure_text"]');
		$(this).prepend(caption);
		$(this).remove('img + div[data-type="figure_text"]');
	});
	$('[data-block_type="h1"] [data-caption-compass*="W"] > img').wrap("<div class='compassImg'></div>");


        //All the links to exercises/examples/figures/tables/chapters/sections/pages shall be done here
        //popup requests to pages/sections/chapters will use the default digfir functionality
        //popup requests to exercises/examples/figures/tables will use the "pop_content()" function defined below
        //The reasoning: ebook navigation between sections has to follow a strict protocol due to Macmillan's Launchpad tool. Therefore we must
        //use the functions provided by digfir to popup pages/sections/chapters. But with other items (ie. exercises) there is
        //no such restriction, and Macmillan would like more flexibility (controlling the size of the popup windows, how many, etc.).

        //chapter references
        //assumes a specific xml filename was used by vendor in the <link> tag
        //assumes link to the first section in the chapter
	$('a[href^="scc9e-ch"][href$=".xml"]').each(function () {
	    var newhref = $(this).attr('href').replace(/.*ch0?(\d+).*/i, "scc9e_ch$1_1.html");
	    //certain chapters have parts as the first section, so in those cases, adjust the url to link to the second section
	    if (/ch(1|10|17|21)_/.test(newhref)) { newhref = newhref.replace(/(.*)_1.html/, "$1_2.html"); }
	    $(this).attr('href', newhref);
	});

        //section references...  
        //difficult to automate. We will see how the vendor codes this in the XML.
        //May be a manual thing? Not sure how vendor could get right... they won't know the html filename to link to

        //page references
        //No need to do anything. XML supplied by vendor should be good. Linking functionality taken care of by digfir

        //turn in text references from <a> to <spans> (avoiding digfir default linking)
	$('a[href^="table_"], a[href^="figure_"], a[href^="exercise_"], a[href^="example_"]').each(function () {
	    var text = $(this).html();
	    $(this).replaceWith("<span data_href=" + $(this).attr("href") + ">" + text + "</span>");
	});


        // SUPPLEMENTAL WINDOW CLICK EVENTS
        //popup requests to supplemental windows for examples/exercises/figures/table will use this function.
        //Input is URL, width/height of window
	var pop_content = function (url, w, h) {
	    var path = window.location.pathname;
	    var newWin = window.open(url, '_blank', 'width=' + w + ',height=' + h + ',menubar=0,location=0,scrollbars=yes', '');
	    newWin.moveTo(150, 150);
	};

        //Table references
        // Number in caption of table needs linked, along with title
	$('[data-block_type="TABLE"] [data-type="table_caption"]').click(function () {
	    //need table number
	    var filename = $(this).closest('[data-type="table"]').attr("data-filename");
	    var supp_win = "asset/ch" + chapter_number + "/supp_wins/tables/" + filename;
	    pop_content(supp_win, "1020px", "500px");
	});
        // add link on table references in the text
	$('span[data_href^="table_"]').click(function () {
	    var filename = $(this).attr('data_href');
	    //var ch = filename.replace(/table_(\d+).*/i, "$1");
	    var supp_win = "asset/ch" + chapter_number + "/supp_wins/tables/" + filename;
	    pop_content(supp_win, "1020px", "700px");
	});


        //Links to example
        // The example box has a title and number, add links
	$('[data-block_type="EXP"] > [data-type="box_inner"] > [data-block_type="EXP-N"]').click(function () {
	    var filename = $(this).closest('[data-block_type="EXP"]').attr("data-filename");
	    var supp_win = "asset/ch" + chapter_number + "/supp_wins/examples/" + filename;
	    pop_content(supp_win, "1020px", "500px");
	});
	$('[data-block_type="EXP"] > [data-type="box_inner"] [data-block_type="EXP-T-ri"]').click(function () {
	    var filename = $(this).closest('[data-block_type="EXP"]').attr("data-filename");
	    var supp_win = "asset/ch" + chapter_number + "/supp_wins/examples/" + filename;
	    pop_content(supp_win, "1020px", "500px");
	});
        // add link on example reference in the text
	$('span[data_href^="example_"]').click(function () {
	    var filename = $(this).attr('data_href');
	    //var ch = filename.replace(/example_(\d+).*/i, "$1");
	    var supp_win = "asset/ch" + chapter_number + "/supp_wins/examples/" + filename;
	    pop_content(supp_win, "1020px", "500px");
	});


        //Exercises
        //add link on exercise numbers and titles

        //"use your knowledge" exercises found throughout sections
	$('[data-type="question"] [data-block_type="EXR-QUE-N-ri"]').click(function () {
	    var filename = $(this).closest('[data-type="question"]').attr('data-block_type');
	    var supp_win = "asset/ch" + chapter_number + "/supp_wins/exercises/" + filename;
	    pop_content(supp_win, "1020px", "500px");
	});
	$('[data-type="question"] [data-block_type="EXR-QUE-T-ri"]').click(function () {
	    var filename = $(this).closest('[data-type="question"]').attr('data-block_type');
	    var supp_win = "asset/ch" + chapter_number + "/supp_wins/exercises/" + filename;
	    pop_content(supp_win, "1020px", "500px");
	});

        //"now it's your turn" exercises found throughout sections
	$('[data-type="question"] [data-block_type="BX2-QUE-N-ri"]').click(function () {
	    //need question number	               
	    var exernum = $(this).text().replace(/ *(\d+)\.(\d+).*/i, "exercise_$1_$2.html");
	    var supp_win = "asset/ch" + exernum.replace(/exercise_(\d+)_.*/, "$1") + "/supp_wins/exercises/" + exernum;
	    pop_content(supp_win, "1020px", "500px");
	});
        //these are at end of section groups and chapters
	$('[data-type="question"] [data-block_type="SR-XH"]').click(function () {
	    //need question number	               
	    var filename = $(this).closest('[data-type="question"]').attr('data-block_type');
	    var supp_win = "asset/ch" + chapter_number + "/supp_wins/exercises/" + filename;
	    pop_content(supp_win, "1020px", "500px");
	});
        // add link on exercise references in the text
	$('span[data_href^="exercise_"]').click(function () {
	    var filename = $(this).attr('data_href');
	    var ch = filename.replace(/exercise_(\d+).*/i, "$1");
	    var supp_win = "asset/ch" + ch + "/supp_wins/exercises/" + filename;
	    pop_content(supp_win, "1015px", "700px");
	});


        //NUMBERED FIGURE LINKS
        //// add link on the figure image
        //    $('[data-caption-compass]  > .compassImg img').click(function() {
        //        var fignum = $(this).attr('src').replace(/fig_([\d_]+)/i, "$1");
        //        var supp_win = fignum.replace(/.*0?(\d+)_0?(\d+)\.jpg/, "asset/ch$1/supp_wins/figures/figure_$1_$2.html");
        //        pop_content(supp_win, "1015px", "700px");
        //    });
        //// add link on the figure image (sometimes img is not inside "compass"... occurs when caption in default place under figure)
        //    $('[data-caption-compass]  > img').click(function() {
        //        var fignum = $(this).attr('src').replace(/fig_([\d_]+)/i, "$1");
        //        var supp_win = fignum.replace(/.*0?(\d+)_0?(\d+)\.jpg/, "asset/ch$1/supp_wins/figures/figure_$1_$2.html");
        //        pop_content(supp_win, "1015px", "700px");
        //    });

        // add link on the figure number in caption
	$('[data-caption-compass] [data-block_type="FG-N-ri"]').click(function () {
	    var fignum = $(this).text().replace(/FIGURE ([\d\.]+)/i, "$1");
	    var supp_win = fignum.replace(/(\d+)\.(\d+)/, "asset/ch$1/supp_wins/figures/figure_$1_$2.html");
	    pop_content(supp_win, "1015px", "700px");
	});
    // add link on figure references in the text	                
	$('span[data_href^="figure_"]').click(function () {
	    var filename = $(this).attr('data_href');
	    var ch = filename.replace(/figure_(\d+).*/i, "$1");
	    var supp_win = "asset/ch" + ch + "/supp_wins/figures/" + filename;
	    pop_content(supp_win, "1015px", "700px");
	});

    // add link on the figure image
	$('[data-type="figure"] img').click(function () {
	    var filename = $(this).closest('[data-type="figure"]').attr("data-filename");
	    //var supp_win = filename.replace(/(.*0?(\d+)_0?\d+\.html)/, "asset/ch$2/supp_wins/figures/$1");
	    var supp_win = "asset/ch" + chapter_number + "/supp_wins/figures/" + filename;
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
