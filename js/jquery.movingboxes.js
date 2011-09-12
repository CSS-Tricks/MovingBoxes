/*
 * Moving Boxes v2.1.4
 * by Chris Coyier
 * http://css-tricks.com/moving-boxes/
 */

(function($){
	$.movingBoxes = function(el, options){
		// To avoid scope issues, use 'base' instead of 'this'
		// to reference this class from internal events and functions.
		var o, base = this;

		// Access to jQuery and DOM versions of element
		base.$el = $(el).addClass('mb-slider');
		base.el = el;

		// Add a reverse reference to the DOM object
		base.$el.data('movingBoxes', base);

		base.init = function(){
			base.options = o = $.extend({}, $.movingBoxes.defaultOptions, options);

			// Setup formatting (to reduce the amount of initial HTML)
			base.$el.wrap('<div class="movingBoxes mb-wrapper"><div class="mb-scroll" /></div>');

			// defaults
			base.$window = base.$el.parent(); // mb-scroll
			base.$wrap = base.$window.parent() // mb-wrapper
				.css({ width : o.width }) // override css width
				.prepend('<a class="mb-scrollButtons mb-left"></a>')
				.append('<a class="mb-scrollButtons mb-right"></a><div class="mb-left-shadow"></div><div class="mb-right-shadow"></div>');
			base.$panels = base.$el.children().addClass('mb-panel');
			base.runTime = $('.mb-slider').index(base.$el) + 1; // Get index (run time) of this slider on the page
			base.regex = new RegExp('slider' + base.runTime + '=(\\d+)', 'i'); // hash tag regex

			base.initialized = false;
			base.currentlyMoving = false;
			base.curPanel = 1;

			// Set up click on left/right arrows
			base.$left = base.$wrap.find('.mb-left').click(function(){
				base.goBack();
				return false;
			});
			base.$right = base.$wrap.find('.mb-right').click(function(){
				base.goForward();
				return false;
			});

			// code to run to update MovingBoxes when the number of panels change
			base.update();
			$(window).load(function(){ base.update(false); }); // animate height after all images load

			// go to clicked panel
			base.$el.delegate('.mb-panel', 'click', function(){
				base.change( base.$panels.index($(this)) + 1 );
			});

			// Activate moving box on click or when an internal link obtains focus
			base.$wrap.click(function(){
				base.active();
			});
			base.$panels.delegate('a', 'focus' ,function(){
				// focused link centered in moving box
				var loc = base.$panels.index($(this).closest('.mb-panel')) + 1;
				if (loc !== base.curPanel){ base.change( base.$panels.index($(this).closest('.mb-panel')) + 1, {}, false ); }
			});

			// Add keyboard navigation
			$(document).keyup(function(e){
				// ignore arrow/space keys if inside a form element
				if (e.target.tagName.match('TEXTAREA|INPUT|SELECT')) { return; }
				switch (e.which) {
					case 39: case 32: // right arrow & space
						if (base.$wrap.is('.mb-active-slider')){
							base.goForward();
						}
						break;
					case 37: // left arrow
						if (base.$wrap.is('.mb-active-slider')){
							base.goBack();
						}
						break;
				}
			});

			// Set up "Current" panel
			var startPanel = (o.hashTags) ?  base.getHash() || o.startPanel : o.startPanel;

			// Bind Events
			$.each('initialized.movingBoxes initChange.movingBoxes beforeAnimation.movingBoxes completed.movingBoxes'.split(' '), function(i,f){
				var evt = f.split('.')[0];
				if ($.isFunction(o[evt])){
					base.$el.bind(f, o[evt]);
				}
			});

			// animate to chosen start panel - starting from the first panel makes it look better
			setTimeout(function(){
				base.change(startPanel, function(){
					base.initialized = true;
					base.$el.trigger( 'initialized.movingBoxes', [ base, startPanel ] );
				});
			}, o.speed * 2 );

		};

		// update the panel, flag is used to prevent events from firing
		base.update = function(flag){
			var t;
			// Set up panes & content sizes; default: panelWidth = 50% of entire width
			base.$panels = base.$el.children()
				.addClass('mb-panel')
				.css({ width : o.width * o.panelWidth, margin: 0 })
				// inner wrap of each panel
				.each(function(){
					if ($(this).find('.mb-inside').length === 0) {
						$(this).wrapInner('<div class="mb-inside" />');
					}
				});
			base.totalPanels = base.$panels.length;

			// save 'cur' numbers (current larger panel size), use stored sizes if they exist
			t = base.$panels.eq(base.curPanel - 1);
			base.curWidth = base.curWidth || t.outerWidth();

			// save 'reg' (reduced size) numbers
			base.regWidth = base.curWidth * o.reducedSize;

			// set image heights so base container height is correctly set
			base.$panels.css({ width: base.curWidth, fontSize: '1em' }); // make all panels big

			// save each panel height... script will resize container as needed
			// make sure current panel css is applied before measuring
			base.$panels.eq(base.curPanel-1).addClass(o.currentPanel);
			base.heights = base.$panels.map(function(i,e){ return $(e).outerHeight(true); }).get();

			base.returnToNormal(base.curPanel, 0); // resize new panel, animation time
			base.growBigger(base.curPanel, 0, flag);
			if (!o.wrap) { base.updateArrows(base.curPanel); }

			// make base container wide enough to contain all the panels
			base.$el.css({
				position : 'absolute',
				// add a bit more width to each box (100px should cover margin/padding, etc; then add 1/2 overall width in case only one panel exists
				width    : (base.curWidth + 100) * base.totalPanels + (o.width - base.curWidth) / 2,
				height   : Math.max.apply( this, base.heights ) + 10
			});
			base.$window.css({ height : (o.fixedHeight) ? Math.max.apply( this, base.heights ) : base.heights[base.curPanel-1] });
			// add padding so scrollLeft = 0 centers the left-most panel (needed because scrollLeft cannot be < 0)
			base.$panels.eq(0).css({ 'margin-left' : (o.width - base.curWidth) / 2 });

			base.buildNav();

			base.change(base.curPanel, {}, false); // initialize from first panel... then scroll to start panel

		};

		// Creates the numbered navigation links
		base.buildNav = function() {

			base.$navLinks = {};
			if (base.$nav) { base.$nav.remove(); }

			if (o.buildNav && (base.totalPanels > 1)) {
				base.$nav = $('<div class="mb-controls"><a class="mb-testing"></a></div>').appendTo(base.$wrap);
				var j, a = '',
				navFormat = $.isFunction(o.navFormatter),
				// need link in place to get CSS properties
				hiddenText = parseInt( base.$nav.find('.mb-testing').css('text-indent'), 10) < 0;
				base.$panels.each(function(i) {
					j = i + 1;
					a += '<a href="#" class="mb-panel' + j;
					// If a formatter function is present, use it
					if (navFormat) {
						var tmp = o.navFormatter(j, $(this));
						a += (hiddenText) ? ' ' + o.tooltipClass +'" title="' + tmp : '';
						a += '">' + tmp + '</a> ';
						// Add formatting to title attribute if text is hidden
					} else {
						a += '">' + j + '</a> ';
					}
				});
				base.$navLinks = base.$nav
					.html(a)
					.find('a').bind('click', function() {
						base.change( base.$navLinks.index($(this)) + 1 );
						return false;
					});
			}
		};

		// Resize panels to normal
		base.returnToNormal = function(num, time){
			var panels = base.$panels.not(':eq(' + (num-1) + ')').removeClass(o.currentPanel);
			if (o.reducedSize === 1) {
				panels.css({ width: base.regWidth }); // excluding fontsize change to prevent video flicker
			} else {
				panels.animate({ width: base.regWidth, fontSize: o.reducedSize + 'em' }, (time === 0) ? time : o.speed);
			}
		};

		// Zoom in on selected panel
		base.growBigger = function(num, time, flag){
			var panels = base.$panels.eq(num-1);
			if (o.reducedSize === 1) {
				panels.css({ width: base.curWidth }); // excluding fontsize change to prevent video flicker
				if (base.initialized) { base.completed(num, flag); }
			} else {
				panels.animate({ width: base.curWidth, fontSize: '1em' }, (time === 0) ? time : o.speed, function(){
					// completed event trigger
					// even though animation is not queued, trigger is here because it is the last animation to complete
					if (base.initialized) { base.completed(num, flag); }
				});
			}
		};

		base.completed = function(num, flag){
			// add current panel class after animating in case it has sizing parameters
			base.$panels.eq(num-1).addClass(o.currentPanel);
			if (flag !== false) { base.$el.trigger( 'completed.movingBoxes', [ base, num ] ); }
		};

		// go forward/back
		base.goForward = function(){
			if (base.initialized) {
				base.change(base.curPanel + 1); 
			}
		};

		base.goBack = function(){
			if (base.initialized) {
				base.change(base.curPanel - 1);
			}
		};

		// Change view to display selected panel
		base.change = function(curPanel, callback, flag){

			// make sure it's a number and not a string
			curPanel = parseInt(curPanel, 10);

			if (base.initialized) {
				// make this moving box active
				base.active();
				// initChange event - has extra parameter with targeted panel (not cleaned)
				base.$el.trigger( 'initChange.movingBoxes', [ base, curPanel ] );
			}

			// psuedo wrap - it's a pain to clone the first & last panel then resize them correctly while wrapping AND make it look good
			if ( o.wrap ) {
				if ( curPanel < 1 ) { curPanel = base.totalPanels; }
				if ( curPanel > base.totalPanels ) { curPanel = 1; }
			} else {
				if ( curPanel < 1 ) { curPanel = 1; }
				if ( curPanel > base.totalPanels ) { curPanel = base.totalPanels; }
			}

			// don't do anything if it's the same panel
			if (base.initialized && base.curPanel === curPanel && !flag) { return false; }

			// abort if panel is already animating
			// animation callback to clear this flag is not called when the slider doesn't move, so include base.initialized
			if (!base.currentlyMoving || !base.initialized) {
				base.currentlyMoving = true;

				// center panel in scroll window
				var ani, leftValue = base.$panels.eq(curPanel-1).position().left - (o.width - base.curWidth) / 2;
				// when scrolling right, add the difference of the larger current panel width
				if (curPanel > base.curPanel) { leftValue -= ( base.curWidth - base.regWidth ); }

				ani = (o.fixedHeight) ? { scrollLeft : leftValue } : { scrollLeft: leftValue, height: base.heights[curPanel - 1] };

				// before animation trigger
				if (base.initialized) { base.$el.trigger( 'beforeAnimation.movingBoxes', [ base, curPanel ] ); }

				// animate the panels
				base.$window.animate( ani,
					{
						queue    : false,
						duration : o.speed,
						easing   : o.easing,
						complete : function(){
							base.curPanel = curPanel;
							if (base.initialized) {
								base.$window.scrollTop(0); // Opera fix - otherwise, it moves the focus link to the middle of the viewport
							}
							base.currentlyMoving = false;
							if (typeof(callback) === 'function') { callback(base); }
						}
					}
				);

				base.returnToNormal(curPanel);
				base.growBigger(curPanel);
				if (!o.wrap) { base.updateArrows(curPanel); }
				if (o.hashTags && base.initialized) { base.setHash(curPanel); }
			}
			base.$wrap.find('.mb-controls a')
				.removeClass(o.currentPanel)
				.eq(curPanel - 1).addClass(o.currentPanel);
		};

		base.updateArrows = function(cur){
			base.$left.toggleClass(o.disabled, cur === 1);
			base.$right.toggleClass(o.disabled, cur === base.totalPanels);
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
			$('.mb-active-slider').removeClass('mb-active-slider');
			base.$wrap.addClass('mb-active-slider');
		};

		// get: var currentPanel = $('.slider').data('movingBoxes').currentPanel();  // returns # of currently selected/enlarged panel
		// set: var currentPanel = $('.slider').data('movingBoxes').currentPanel(2, function(){ alert('done!'); }); // returns and scrolls to 2nd panel
		base.currentPanel = function(panel, callback){
			if (typeof(panel) !== 'undefined') {
				base.change(panel, callback); // parse in case someone sends a string
			}
			return base.curPanel;
		};

		// Run initializer
		base.init();
	};

	$.movingBoxes.defaultOptions = {
		// Appearance
		startPanel   : 1,         // start with this panel
		width        : 800,       // overall width of movingBoxes
		panelWidth   : 0.5,       // current panel width adjusted to 50% of overall width
		reducedSize  : 0.8,       // non-current panel size: 80% of panel size
		fixedHeight  : false,     // if true, slider height set to max panel height; if false, slider height will auto adjust.

		// Behaviour
		speed        : 500,       // animation time in milliseconds
		hashTags     : true,      // if true, hash tags are enabled
		wrap         : false,     // if true, the panel will "wrap" (it really rewinds/fast forwards) at the ends
		buildNav     : false,     // if true, navigation links will be added
		navFormatter : null,      // function which returns the navigation text for each panel
		easing       : 'swing',   // anything other than "linear" or "swing" requires the easing plugin

		// Selectors & classes
		currentPanel : 'current', // current panel class
		tooltipClass : 'tooltip', // added to the navigation, but the title attribute is blank unless the link text-indent is negative
		disabled     : 'disabled',// class added to arrows that are disabled (left arrow when on first panel, right arrow on last panel)

		// Callbacks
		initialized     : null,   // callback when MovingBoxes has completed initialization
		initChange      : null,   // callback upon change panel initialization
		beforeAnimation : null,   // callback before any animation occurs
		completed       : null    // callback after animation completes
	};

	$.fn.movingBoxes = function(options, callback){
		var num, mb = this.data('movingBoxes');
		return this.each(function(){
			// initialize the slider but prevent multiple initializations
			if ((typeof(options)).match('object|undefined')){
				if (mb) {
					mb.update();
				} else {
					(new $.movingBoxes(this, options));
				}
			} else if (/\d/.test(options) && !isNaN(options) && mb) {
				num = (typeof(options) === "number") ? options : parseInt($.trim(options),10); // accepts "  4  "
				// ignore out of bound panels
				if ( num >= 1 && num <= mb.totalPanels ) {
					mb.change(num, callback); // page #, autoplay, one time callback
				}
			}
		});
	};

	// Return the movingBoxes object
	$.fn.getMovingBoxes = function(){
		return this.data('movingBoxes');
	};

})(jQuery);