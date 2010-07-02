/*
 * Moving Boxes script by Chris Coyier
 * http://css-tricks.com/moving-boxes/
 *
 * Revision History:
 * (6/21/2010) Rob Garrison
    ~ Significant rewrite & conversion to a plugin (based off of http://starter.pixelgraphics.us/)
    ~ Removed keyboard support, it would look wierd having mulitple panels moving. Maybe someone has a better method?
    ~ Added method to get/set current displayed panel
 * (2/17/2009) Noah Hendrix
    ~ Keyboard support added, arrow keys, spacebar, and enter key
    ~ Code cleaned up, number of panels and initial widths/sizes are no longer hard coded, so easier to build upon
    ~ Clicking on non-active left or right panels also triggers animation
 * (2/16/2009) Chris Coyier - Issue with double clicking fixed. Next animation can only start when current animation is complete.
 * (2/16/2009) Chris Coyier - Script released to public
 */

(function ($) {
    $.movingBoxes = function (el, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data('movingBoxes', base);

        base.init = function () {
            base.options = $.extend({}, $.movingBoxes.defaultOptions, options);

            // Put your initialization code here
            var panels = base.$el.find('.panel');

            base.options.totalPanels = panels.length;
            base.options.regWidth = panels.css('width');
            base.options.regImgWidth = panels.find('img').css('width');
            base.options.regTitleSize = panels.find('h2').css('font-size');
            base.options.regParSize = panels.find('p').css('font-size');

            panels.css({
                'float': 'left',
                'position': 'relative'
            });

            base.$el.data('currentlyMoving', false);

            base.$el.find('.scrollContainer').css('width', (base.$el.find('.panel')[0].offsetWidth * base.$el.find('.panel').length) + 150);

            base.$el.find('.scroll').css('overflow', 'hidden');

            // Set up "Current" panel
            base.$el.data('currentPanel', -1);
            base.change(base.options.startPanel);
            curPanel = base.options.startPanel;

            // Set up click on left/right arrows
            base.$el.find('.right').click(function(){
                base.change(base.$el.data('currentPanel') + 1);
            }).end().find('.left').click(function(){
                base.change(base.$el.data('currentPanel') - 1);
            });

            // go to clicked panel
            panels.click(function () {
                base.change( panels.index($(this)) + 1 );
            });
        };

        // Resize panels to normal
        base.returnToNormal = function(num) {
            base.$el.find('.panel').not(':eq(' + (num-1) + ')')
                .animate({ width: base.options.regWidth }, base.options.speed)
                .find('img').animate({ width: base.options.regImgWidth }, base.options.speed).end()
                .find('h2').animate({ fontSize: base.options.regTitleSize }, base.options.speed).end()
                .find('p').animate({ fontSize: base.options.regParSize }, base.options.speed);
        };

        // Zoom in on selected panel
        base.growBigger = function (num) {
            base.$el.find('.panel').eq(num-1)
                .animate({ width: base.options.curWidth }, base.options.speed)
                .find('img').animate({ width: base.options.curImgWidth }, base.options.speed).end()
                .find('h2').animate({ fontSize: base.options.curTitleSize }, base.options.speed).end()
                .find('p').animate({ fontSize: base.options.curParSize }, base.options.speed);
        };

        // Change view to display selected panel
        base.change = function(curPanel) {

            var panels = base.$el.find('.panel');
            //if not in range or on the same panel then return
            if (curPanel < 1 || base.$el.data('currentPanel') == curPanel || curPanel > panels.length) {
                return false;
            }

            //if not currently moving
            if (!base.$el.data('currentlyMoving')) {

                base.$el.data('currentPanel', curPanel);
                base.$el.data('currentlyMoving', true);
                // center panel in scroll window
                var leftValue = base.$el.find('.scroll').innerWidth() / 2 - panels.eq(curPanel-1).outerWidth() / 2;
                var movement = leftValue - base.options.movingDistance * (curPanel-1);
                base.$el.find('.scrollContainer').stop().animate({
                    'left' : movement
                }, base.options.speed, function () {
                    base.$el.data('currentlyMoving', false);
                });

                base.returnToNormal(curPanel);
                base.growBigger(curPanel);
            }
        };

        // get: var currentPanel = $('.slider').data('movingBoxes').currentPanel(); // returns # of currently selected/enlarged panel
        // set: var currentPanel = $('.slider').data('movingBoxes').currentPanel(2); // returns and scrolls to 2nd panel
        base.currentPanel = function (panel) {
            if (typeof(panel) !== 'undefined') {
                base.change(parseInt(panel,10)); // parse in case someone sends a string
            }
            return base.$el.data('currentPanel');
        };

        // Run initializer
        base.init();
    };

    $.movingBoxes.defaultOptions = {
        startPanel: 1,        // start with this panel
        movingDistance: 300,  // panel distance to move
        curWidth: 350,        // panel width
        curImgWidth: 326,     // Image width
        curTitleSize: '20px', // Title font size
        curParSize: '15px',   // paragraph font size
        speed: 500            // time in milliseconds
    };

    $.fn.movingBoxes = function (options) {
        return this.each(function () {
            (new $.movingBoxes(this, options));
        });
    };

    // This function breaks the chain, but returns
    // the movingBoxes if it has been attached to the object.
    $.fn.getmovingBoxes = function () {
        this.data('movingBoxes');
    };

})(jQuery);