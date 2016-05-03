/// <reference path="jquery.js" />
xBookUtils.bookID = "ips9e";

var suppwins_Player_subtype = Player_subtype.extend({
     initialize_sections: function () {
         // Do not delete this
         this._super();
         // Add custom JS code below. Anything that needs to be done before
         // the page displays should be done here.
     }, // end initialize_sections
     /*
        You will most likely not make any changes to the initialize method.
     */
     initialize: function (id) {
         // Do not delete this
         this._super(id);
     }, // end initialize

     initialize2: function () {
         // Do not delete this
         this._super();

         //All supplemental window javascript shall be done here

         var pop_content = function (url, w, h) {
             var path = window.location.pathname;
             var newWin = window.open(url, '_blank', 'width=' + w + ',height=' + h + ',menubar=0,location=0,scrollbars=yes', '');
             newWin.moveTo(150, 150);
         };

         //unbind all references to supplemental windows.
         //Will need to put in new URLs anyways, so removing now so we can start from scratch
         // in-text links
         $('span[data_href^="figure_"], [data_href^="exercise_"],[data_href^="example_"],[data_href^="table_"]').unbind(); //intext references
         // links in features
         $('[data-block_type="h1"] [data-block_type="EXP-N"]').unbind(); //example titles
         $('[data-block_type="TABLE"] [data-type="table_caption"]').unbind(); //table captions
         $('[data-type="question"] [data-block_type="BX2-QUE-N-ri"]').unbind(); // Titles for "Now it's your turn" exercises
         $('[data-type="question"] [data-block_type="CR-X-NL-N-ri"]').unbind(); // Titles for end of chapter exercises
         $('[data-type="question"] [data-block_type="SR-XH"]').unbind(); // Titles for section and chapter reviews
         $('[data-type="question"] [data-block_type="EXR-QUE-N-ri"]').unbind(); // User Your Knowledge question number
         $('[data-type="question"] [data-block_type="EXR-QUE-T-ri"]').unbind(); // User Your Knowledge question title
         $('[data-caption-compass] [data-block_type="FG-N-ri"]').unbind();
         // $('[data-type="figure"][data-block_type="UN-FIGURE"] img').unbind();
         // unbind all image events -- will be rebound below, if needed
         $('img').unbind();


         //don't want any cross-section/page/chapter linking in supplemental windows
         $('a[href^="scc9e-ch"][href$=".xml"]').attr("href", "");
         //jquery to remove page links
         //jquery to remove section links

         // add relative paths for inline links
         $('span[data_href^="figure_"]').click(function() {
             var filename = $(this).attr('data_href');
             var ch = filename.replace(/figure_(\d+).*/i, "$1");
             var supp_win = "../../../ch" + ch + "/supp_wins/figures/" + filename;
             pop_content(supp_win, "1015px", "700px");
         });
         // add links on exercise references in the text
         $('span[data_href^="exercise_"]').click(function () {
             var filename = $(this).attr('data_href');
             var ch = filename.replace(/exercise_(\d+).*/i, "$1");
             var supp_win = "../../../ch" + ch + "/supp_wins/exercises/" + filename;
             pop_content(supp_win, "1015px", "700px");
         });
         // add links on example references in the text
         $('span[data_href^="example_"]').click(function () {
             var filename = $(this).attr('data_href');
             var ch = filename.replace(/example_(\d+).*/i, "$1");
             var supp_win = "../../../ch" + ch + "/supp_wins/examples/" + filename;
             pop_content(supp_win, "1200px", "500px");
         });

         // adjust all image paths
         $('img[src^="asset/ch"]').each(function () {
             var path = $(this).attr('src');
             path = path.replace(/asset\/ch\d+/, "../..");
             $(this).attr('src', path);
         });
         // adjust global images relative to supp_wins directory
         $('img[src^="asset/global_images"]').each(function () {
             var path = $(this).attr('src');
             path = path.replace(/asset/, "../../../global_images");
             $(this).attr('src', path);
         });




         // add click events for contents of supplemental windows, leaving the event that invoked
         // the window disabled (see above unbind()s.




    // IF NOT FIGURE SUPPLEMENTAL WINDOW CODE, enable click events
         if (($('[data-type="section"] > [data-type="figure"]').length == 0) &&
             (($('[data-type="section"] > [data-block_type="FIGURE"]').length == 0))) {
         // add link on the figure image
        //$('[data-caption-compass]  > .compassImg img').click(function () {
        //    var fignum = $(this).attr('src').replace(/fig_([\d_]+)/i, "$1");
        //    var supp_win = fignum.replace(/.*0?(\d+)_0?(\d+)\.jpg/, "../../../ch$1/supp_wins/figures/figure_$1_$2.html");
        //    pop_content(supp_win, "1015px", "700px");
        //});
        // add link on the figure image (sometimes img is not inside "compass"... occurs when caption in default place under figure)
        //$('[data-caption-compass]  > img').click(function () {
        //    var fignum = $(this).attr('src').replace(/fig_([\d_]+)/i, "$1");
        //    var supp_win = fignum.replace(/.*0?(\d+)_0?(\d+)\.jpg/, "../../../ch$1/supp_wins/figures/figure_$1_$2.html");
        //    pop_content(supp_win, "1015px", "700px");
        //});
        // add link on the figure number in caption
        $('[data-caption-compass] [data-block_type="FG-N-ri"]').click(function () {
            var fignum = $(this).text().replace(/FIGURE ([\d\.]+)/i, "$1");
            var supp_win = fignum.replace(/(\d+)\.(\d+)/, "../../../ch$1/supp_wins/figures/figure_$1_$2.html");
            pop_content(supp_win, "1015px", "700px");
        });
        //UNNUMBERED FIGURE LINKS
        // add link on the figure image
        $('[data-type="figure"] img').click(function () {
            var filename = $(this).parent('[data-type="figure"]').attr("data-filename");
            var supp_win = "../../" + filename;
            pop_content(supp_win, "1015px", "700px");
        });

         } else {
             // place caption above figure image in number figure supplemental windows
             var figImg = $('[data-type="figure"] img');
             var figText = $('[data-block_type="FIGURE"] [data-type="figure_text"]');
             if (figText.length > 0) {
                 figText.insertBefore(figImg);
             }

             var scale = 1.15;
             figImg.css('width', 'auto');
             var w = parseInt(figImg.css('width'));
             var neww = w * scale;
             figImg.css('width', neww );
         }

    
        // EXERCISE SUPPLEMENTAL WINDOW CODE
        // wrap in BX2 box for styling -- scc9e
        // $('[data-type="section"][data-block_type="h1"] > [data-type="question"]').wrap('<div data-type="box" data-block_type="BX2"></div>');

        // Figure supp windows
        // size of figures in the supplemental windows should be 15% larger than main page
            //$('[data-type="section"] > [data-type="figure"] > img').each(function() {
            //    var scale = 1.15;
            //    var image = $(this); //update... this will accidentally find <img> in caption too.
            //    var natimg = document.getElementsByTagName("img")[0];
            //    var natWidth = natimg.naturalWidth;
            //    var w = natWidth * scale;
            //    image.css({ width: w });
            //});

     } // end initialize2

}); // end Player_subtype

// Do not delete this
player = new suppwins_Player_subtype();
