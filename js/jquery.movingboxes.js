/*
 * Moving Boxes script by Chris Coyier
 * http://css-tricks.com/moving-boxes/
 *
 */

(function($){
    $.movingBoxes = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
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
             .prepend('<img class="scrollButtons left" src="' + base.options.leftArrow + '" />')
             .append('<img class="scrollButtons right" src="' + base.options.rightArrow + '" />')
             .find('.panel').wrapInner('<div class="inside" />').end()
             .find('.scroll, .scrollContainer').css({
                overflow : 'hidden',
                width    : '100%'
             });

            // Set up panes & content sizes
            base.panels = base.$el.find('.panel');
            base.panels.css({
                width  : base.options.width * base.options.panelWidth, // default: panelWidth = 50% of entire width
                float  : 'left'
            });
            base.totalPanels = base.panels.length;

            // save 'cur' numbers (current larger panel size)
            base.curWidth = base.panels.outerWidth();
            base.curImgWidth = parseInt( base.panels.find('img').css('width'), 10);
            base.curImgHeight = base.curImgWidth / base.options.imageRatio; // set images fit a 4:3 ratio
            base.curTitleSize = parseInt( base.panels.find('h2').css('font-size'), 10 );
            base.curParSize = parseInt( base.panels.find('p').css('font-size'), 10 );

            // save 'reg' (reduced size) numbers
            base.regWidth = base.curWidth * base.options.reducedSize;
            base.regImgWidth = base.curImgWidth * base.options.reducedSize;
            base.regImgHeight = base.curImgHeight * base.options.reducedSize;
            base.regTitleSize = base.curTitleSize * base.options.reducedSize;
            base.regParSize = base.curParSize * base.options.reducedSize;

            // set image heights so scrollContainer height is correctly set
            base.panels.find('img').css({ height: base.curImgHeight + 'px' });

            // make scrollContainer wide enough to contain all the panels
            base.container = base.$el.find('.scrollContainer').css({
                position : 'relative',
                width    : (base.curWidth + 50) * base.totalPanels,
                height   : base.panels.outerHeight(true)
            });

            // Set up "Current" panel
            base.initialized = false;
            base.currentlyMoving = false;
            base.curPanel = 1;
            base.change(1);

            // animate to chosen start panel - starting from the first panel makes it look better
            setTimeout(function(){ base.change(base.options.startPanel); }, base.options.speed * 2 );
            base.initialized = true;

            $(window).load(function(){
                // position the scroll buttons after the images are loaded
                base.$el.find('.scrollButtons').css({
                    top : (base.$el.innerHeight() - base.$el.find('.scrollButtons').height())/2 + 'px'
                });
            });

            // Set up click on left/right arrows
            base.$el.find('.right').click(function(){
                base.change(base.curPanel + 1);
            }).end().find('.left').click(function(){
                base.change(base.curPanel - 1);
            });

            // go to clicked panel
            base.panels.click(function(){
                base.change( base.panels.index($(this)) + 1 );
            });

            // Activate moving box on click or when an internal link obtains focus
            base.$el.click(function(){
                base.active($(this));
            }).find('a').focus(function(){
                // focused link makes moving box active
                base.active($(this).closest('.slider'));
                // focused link centered in moving box
                var index = $(this).closest('.slider').find('.panel').index($(this).closest('.panel')) + 1;
                base.change(index);
            });

            // Add keyboard navigation
            $(window).keyup(function(e){
                switch (e.which) {
                    case 39: case 32: // right arrow & space
                        if (base.$el.is('.active-slider')){
                            base.change(base.curPanel + 1);
                        }
                        break;
                    case 37: // left arrow
                        if (base.$el.is('.active-slider')){
                            base.change(base.curPanel - 1);
                        }
                        break;
                }
            });

        };

        // Resize panels to normal
        base.returnToNormal = function(num){
            base.panels.not(':eq(' + (num-1) + ')')
                .animate({ width: base.regWidth + 'px' }, base.options.speed)
                .find('img').animate({ width: base.regImgWidth + 'px', height: base.regImgHeight + 'px' }, base.options.speed).end()
                .find('h2').animate({ fontSize: base.regTitleSize + 'px' }, base.options.speed).end()
                .find('p').animate({ fontSize: base.regParSize + 'px' }, base.options.speed);
        };

        // Zoom in on selected panel
        base.growBigger = function(num){
            base.panels.eq(num-1)
                .animate({ width: base.curWidth + 'px' }, base.options.speed)
                .find('img').animate({ width: base.curImgWidth + 'px', height: base.curImgHeight + 'px' }, base.options.speed).end()
                .find('h2').animate({ fontSize: base.curTitleSize + 'px' }, base.options.speed).end()
                // give focus to link after the panel is in view, or it will change the scrollLeft value
                .find('p').animate({ fontSize: base.curParSize + 'px' }, base.options.speed, function(){ base.panels.eq(num-1).find('a').focus(); });
        };

        // Change view to display selected panel
        base.change = function(curPanel){
            //if not in range or on the same panel then return
            if (base.initialized && (curPanel < 1 || base.curPanel == curPanel || curPanel > base.panels.length)) {
                return false;
            }
            // abort if panel is already animating
            if (!base.currentlyMoving) {
                base.currentlyMoving = true;
                // center panel in scroll window

                var leftValue = (base.options.width - base.curWidth) / 2 - base.panels.eq(curPanel-1).position().left;
                // when scrolling right, add the difference of the larger current panel width
                if (curPanel > base.curPanel) { leftValue += ( base.curWidth - base.regWidth ); }

                base.curPanel = curPanel;
                base.$el.find('.scroll').scrollLeft(0); // when links get focus, they shift the scrollLeft if not visible
                base.container.stop().animate({
                    left : leftValue
                }, base.options.speed, function(){
                    base.currentlyMoving = false;
                });
                base.returnToNormal(curPanel);
                base.growBigger(curPanel);
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
        startPanel  : 1,   // start with this panel
        width       : 800, // overall width of movingBoxes
        panelWidth  : 0.5, // current panel width adjusted to 50% of overall width
        reducedSize : 0.8, // non-current panel size: 80% of panel size
        imageRatio  : 4/3, // Image ratio set to 4:3
        speed       : 500, // animation time in milliseconds
        leftArrow   : 'images/leftarrow.png',
        rightArrow  : 'images/rightarrow.png'
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