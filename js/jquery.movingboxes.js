/*
 * Moving Boxes v1.5.1
 * by Chris Coyier 
 * http://css-tricks.com/moving-boxes/
 */

(function($){
    $.movingBoxes = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el).addClass('movingBoxes');
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data('movingBoxes', base);

        base.init = function(){
            base.options = $.extend({}, $.movingBoxes.defaultOptions, options);

            // Setup formatting (to reduce the amount of initial HTML)
            base.$el
             .addClass('left-shadow')
             .css({
                position : 'relative',
                left     : 0,
                top      : 0,
                width    : base.options.width // override css width
             })
             .wrapInner('<div class="scrollContainer" />')
             .wrapInner('<div class="scroll right-shadow" />')
             .prepend('<a class="scrollButtons left"></a>')
             .append('<a class="scrollButtons right"></a>')
             .find('.panel').wrapInner('<div class="inside" />').end()
             .find('.scroll, .scrollContainer').css({
                position : 'relative',
                overflow : 'hidden',
                width    : '100%'
             });
            
            // defaults
            base.$container = base.$el.find('.scrollContainer');
            base.$window = base.$el.find('.scroll');
            base.runTime = $('.movingBoxes').index(base.$el) + 1; // Get index (run time) of this slider on the page
            base.regex = new RegExp('slider' + base.runTime + '=(\\d+)', 'i'); // hash tag regex

            // Set up panes & content sizes
            base.$panels = base.$el.find('.panel')
                .css({
                    width  : base.options.width * base.options.panelWidth, // default: panelWidth = 50% of entire width
                    'float': 'left'
                });
            base.totalPanels = base.$panels.length; // include clones

            // save 'cur' numbers (current larger panel size)
            base.curWidth = base.$panels.outerWidth();
            base.curImgWidth = base.$panels.find('img').outerWidth(true);
            base.curImgHeight = base.curImgWidth / base.options.imageRatio; // set images fit a 4:3 ratio
            base.curTitleSize = parseInt( base.$panels.find('h2').css('font-size'), 10 );
            base.curParSize = parseInt( base.$panels.find('p').css('font-size'), 10 );

            // save 'reg' (reduced size) numbers
            base.regWidth = base.curWidth * base.options.reducedSize;
            base.regImgWidth = base.curImgWidth * base.options.reducedSize;
            base.regImgHeight = base.curImgHeight * base.options.reducedSize;
            base.regTitleSize = base.curTitleSize * base.options.reducedSize;
            base.regParSize = base.curParSize * base.options.reducedSize;

            // set image heights so scrollContainer height is correctly set
            base.$panels.find('img').css({ height: base.curImgHeight });

            // save each panel height... script will resize container as needed
            base.heights = base.$panels.map(function(i,e){ return $(e).outerHeight(true); }).get();

            // make scrollContainer wide enough to contain all the panels
            base.$container.css({
                position : 'relative',
                width    : (base.curWidth + 50) * base.totalPanels,
                height   : Math.max.apply( this, base.heights )
            });

            // Set up "Current" panel
            var startPanel = (base.options.hashTags) ?  base.getHash() || base.options.startPanel : base.options.startPanel;
            base.initialized = false;
            base.currentlyMoving = false;
            base.curPanel = 1;
            base.change(1);

            // animate to chosen start panel - starting from the first panel makes it look better
            setTimeout(function(){ base.change(startPanel); }, base.options.speed * 2 );
            base.initialized = true;

            // Set up click on left/right arrows
            base.$el.find('.right').click(function(){
                base.goForward();
                return false;
            }).end().find('.left').click(function(){
                base.goBack();
                return false;
            });

            // go to clicked panel
            base.$panels.click(function(){
                base.change( base.$panels.index($(this)) + 1 );
            });

            // Activate moving box on click or when an internal link obtains focus
            base.$el.click(function(){
                base.active($(this));
            }).find('a').focus(function(){
                var s = $(this).closest('.slider');
                // focused link makes moving box active
                base.active(s);
                // focused link centered in moving box
                base.change( s.find('.panel').index($(this).closest('.panel')) + 1, false );
            });

            // Add keyboard navigation
            $(document).keyup(function(e){
                switch (e.which) {
                    case 39: case 32: // right arrow & space
                        if (base.$el.is('.active-slider')){
                            base.goForward();
                        }
                        break;
                    case 37: // left arrow
                        if (base.$el.is('.active-slider')){
                            base.goBack();
                        }
                        break;
                }
            });

        }; // end base.init()

        // Resize panels to normal
        base.returnToNormal = function(num){
            base.$panels.not(':eq(' + (num-1) + ')')
                .animate({ width: base.regWidth }, base.options.speed)
                .find('img').animate({ width: base.regImgWidth, height: base.regImgHeight }, base.options.speed).end()
                .find('h2').animate({ fontSize: base.regTitleSize }, base.options.speed).end()
                .find('p').animate({ fontSize: base.regParSize }, base.options.speed);
        };

        // Zoom in on selected panel
        base.growBigger = function(num){
            base.$panels.eq(num-1)
                .animate({ width: base.curWidth }, base.options.speed)
                .find('img').animate({ width: base.curImgWidth, height: base.curImgHeight }, base.options.speed).end()
                .find('h2').animate({ fontSize: base.curTitleSize }, base.options.speed).end()
                // give focus to link after the panel is in view, or it will change the scrollLeft value
                .find('p').animate({ fontSize: base.curParSize }, base.options.speed);
        };

        // go forward/back
        base.goForward = function(){ base.change(base.curPanel + 1); };

        base.goBack = function(){ base.change(base.curPanel - 1); };

        // Change view to display selected panel
        base.change = function(curPanel, flag){

            // psuedo wrap - it's a pain to clone the first & last panel then resize them correctly while wrapping AND make it look good
            if ( base.options.wrap ) {
                if ( curPanel < 1 ) { curPanel = base.totalPanels; }
                if ( curPanel > base.totalPanels ) { curPanel = 1; }
            } else {
                if ( curPanel < 1 ) { curPanel = 1; }
                if ( curPanel > base.totalPanels ) { curPanel = base.totalPanels; }
            }

            // don't do anything if it's the same panel
            if (base.initialized && base.curPanel == curPanel && !flag) { return false; }

            // abort if panel is already animating
            if (!base.currentlyMoving) {
                base.currentlyMoving = true;
                            base.$window.scrollLeft(0); // when links get focus, they shift the scrollLeft if not visible

                // center panel in scroll window
                var leftValue = (base.options.width - base.curWidth) / 2 - base.$panels.eq(curPanel-1).position().left;
                // when scrolling right, add the difference of the larger current panel width
                if (curPanel > base.curPanel) { leftValue += ( base.curWidth - base.regWidth ); }

                var ani = (base.options.fixedHeight) ? { left : leftValue } : { left: leftValue, height: base.heights[curPanel - 1] };

                // animate the panels
                base.$container.animate( ani,
                    {
                        queue    : false,
                        duration : base.options.speed,
                        complete : function(){
                            base.curPanel = curPanel;
                            base.$panels.eq(curPanel - 1).find('a').focus();
                            base.$window.scrollLeft(0); // when links get focus, they shift the scrollLeft if not visible
                            base.currentlyMoving = false;
                        }
                    }
                );
                // This is silly, but Chrome needs this if you tab through the links inside the panels
                base.$window.animate({ scrollLeft: 0 }, base.options.speed);

                base.returnToNormal(curPanel);
                base.growBigger(curPanel);
                if (base.options.hashTags) { base.setHash(curPanel); }
            }
        };

        // get & set hash tags
        base.getHash = function(){
            var n = window.location.hash.match(base.regex);
            return (n===null) ? '' : parseInt(n[1],10);
        };

        base.setHash = function(n){
            var s = 'slider' + base.runTime + "=",
                h = window.location.hash;
            if ( typeof h !== 'undefined' ) {
                window.location.hash = (h.indexOf(s) > 0) ? h.replace(base.regex, s + n) : h + "&" + s + n;
            }
        };

        // Make moving box active (for keyboard navigation)
        base.active = function(el){
            $('.active-slider').removeClass('active-slider');
            el.addClass('active-slider');
        };

        // get: var currentPanel = $('.slider').data('movingBoxes').currentPanel(); // returns # of currently selected/enlarged panel
        // set: var currentPanel = $('.slider').data('movingBoxes').currentPanel(2); // returns and scrolls to 2nd panel
        base.currentPanel = function(panel){
            if (typeof(panel) !== 'undefined') {
                base.change(parseInt(panel,10)); // parse in case someone sends a string
            }
            return base.curPanel;
        };

        // Run initializer
        base.init();
    };

    $.movingBoxes.defaultOptions = {
        startPanel  : 1,     // start with this panel
        width       : 800,   // overall width of movingBoxes
        panelWidth  : 0.5,   // current panel width adjusted to 50% of overall width
        reducedSize : 0.8,   // non-current panel size: 80% of panel size
        imageRatio  : 4/3,   // Image ratio set to 4:3
        speed       : 500,   // animation time in milliseconds
        fixedHeight : false, // if true, slider height set to max panel height; if false, slider height will auto adjust.
        hashTags    : true,  // if true, hash tags are enabled
        wrap        : false  // if true, the panel will "wrap" (it really rewinds/fast forwards) at the ends
    };

    $.fn.movingBoxes = function(options){
        return this.each(function(){
            (new $.movingBoxes(this, options));
        });
    };

    // This function breaks the chain, but returns
    // the movingBoxes if it has been attached to the object.
    $.fn.getmovingBoxes = function(){
        this.data('movingBoxes');
    };

})(jQuery);