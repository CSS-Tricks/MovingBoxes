/*!
 * Moving Boxes v2.2.15
 * by Chris Coyier
 * http://css-tricks.com/moving-boxes/
 */
;(function($){
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
				.prepend('<a class="mb-scrollButtons mb-left"></a>')
				.append('<a class="mb-scrollButtons mb-right"></a><div class="mb-left-shadow"></div><div class="mb-right-shadow"></div>');

			base.$panels = base.$el.children().addClass('mb-panel');
			base.runTime = $('.mb-slider').index(base.$el) + 1; // Get index (run time) of this slider on the page
			base.regex = new RegExp('slider' + base.runTime + '=(\\d+)', 'i'); // hash tag regex

			base.initialized = false;
			base.currentlyMoving = false;
			base.curPanel = (o.initAnimation) ? 1 : base.getHash() || o.startPanel;
			// save original slider width
			base.width = (o.width) ? parseInt(o.width,10) : base.$el.width();
			// save panel width, o.panelWidth originally a fraction (0.5 of o.width) if defined, or get first panel width
			// now can be set after initialization to resize using fraction (value <= 2) or px (all values > 2)
			base.pWidth = (o.panelWidth) ? (o.panelWidth <=2 ? o.panelWidth * base.width : o.panelWidth) : base.$panels.eq(0).width();

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
			base.update(false);
			$(window).load(function(){ // animate height after all images load
				base.update();
			});

			// go to clicked panel
			base.$el.delegate('.mb-panel', 'click', function(e){
				if (!$(this).hasClass(o.currentPanel)) {
					e.preventDefault();  // prevent non-current panel links from working
					base.change( base.$panels.index($(this)) + base.adj, {}, true );
				}
			});

			// Activate moving box on click or when an internal link obtains focus
			base.$wrap.click(function(){
				if (!base.$wrap.hasClass('mb-active-slider')) {
					base.active();
				}
			});
			base.$panels.delegate('a', 'focus' ,function(e){
				e.preventDefault();
				// focused link centered in moving box
				var loc = base.$panels.index($(this).closest('.mb-panel')) + base.adj;
				if (loc !== base.curPanel){
					base.change( loc, {}, true );
				}
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

			// Bind Events
			$.each('preinit initialized initChange beforeAnimation completed'.split(' '), function(i,evt){
				if ($.isFunction(o[evt])){
					base.$el.bind(evt + '.movingBoxes', o[evt]);
				}
			});

			// Set up "Current" panel
			base.curPanel = base.getHash() || o.startPanel;

			base.$el.trigger( 'preinit.movingBoxes', [ base, base.curPanel ] );

			// animate to chosen start panel - starting from the first panel makes it look better
			setTimeout(function(){
				base.change(base.curPanel, function(){
					base.initialized = true;
					base.$el.trigger( 'initialized.movingBoxes', [ base, base.curPanel ] );
				});
			}, o.speed * 2 );

		};

		// update the panel, flag is used to prevent events from firing
		base.update = function(flag, callback){

			// Infinite loop
			base.$el.children('.cloned').remove();
			base.$panels = base.$el.children();
			base.adj = (o.wrap && base.$panels.length > 1) ? 0 : 1; // count adjustment for infinite panels

			base.width = (o.width) ? parseInt(o.width,10) : base.width;
			base.$wrap.css('width', base.width); // set wrapper width

			if (o.wrap && base.$panels.length > 1) {
				base.$el.prepend( base.$panels.filter(':last').clone().addClass('cloned') );
				base.$el.append( base.$panels.filter(':first').clone().addClass('cloned') );
				base.$el.find('.cloned').each(function(){
					// disable all focusable elements in cloned panels to prevent shifting the panels by tabbing
					$(this).find('a,input,textarea,select,button,area').removeAttr('name').attr('disabled', 'disabled');
					$(this).find('[id]').andSelf().removeAttr('id');
				});
			}

			// Set up panes & content sizes
			// defined $panels again to include cloned panels
			base.$panels = base.$el.children()
				.addClass('mb-panel')
				.css('margin',0)
				// inner wrap of each panel
				.each(function(){
					if ($(this).find('.mb-inside').length === 0) {
						$(this).wrapInner('<div class="mb-inside" />');
					}
				});
			base.totalPanels = base.$panels.filter(':not(.cloned)').length; // don't include cloned panels in total

			// save 'cur' numbers (current larger panel size), use stored sizes if they exist
			base.curWidth = (o.panelWidth) ? (o.panelWidth <=2 ? o.panelWidth * base.width : o.panelWidth) : base.pWidth;

			// save 'reg' (reduced size) numbers
			base.regWidth = base.curWidth * o.reducedSize;

			// set image heights so base container height is correctly set
			base.$panels.css({ width: base.curWidth, fontSize: '1em' }); // make all panels big

			// save each panel height... script will resize container as needed
			// make sure current panel css is applied before measuring
			base.$panels.eq(base.curPanel - base.adj).addClass(o.currentPanel);
			base.heights = base.$panels.map(function(i,e){ return $(e).outerHeight(true); }).get();

			base.returnToNormal(base.curPanel, 0); // resize new panel, animation time
			base.growBigger(base.curPanel, 0, flag);
			base.updateArrows(base.curPanel);

			// make base container wide enough to contain all the panels
			base.$el.css({
				position : 'absolute',
				// add a bit more width to each box (100px should cover margin/padding, etc; then add 1/2 overall width in case only one panel exists
				width    : (base.curWidth + 100) * base.$panels.length + (base.width - base.curWidth) / 2,
				height   : Math.max.apply( this, base.heights ) + 10
			});
			base.$window.css({ height : (o.fixedHeight) ? Math.max.apply( this, base.heights ) : base.heights[base.curPanel - base.adj] });
			// add padding so scrollLeft = 0 centers the left-most panel (needed because scrollLeft cannot be < 0)
			base.$panels.eq(0).css({ 'margin-left' : (base.width - base.curWidth) / 2 });

			base.buildNav();

			base.change(base.curPanel, callback, flag); // initialize from first panel... then scroll to start panel

		};

		// Creates the numbered navigation links
		base.buildNav = function() {
			if (base.$nav) {
				base.$nav.find('.mb-links').empty();
			} else {
				base.$nav = $('<div class="mb-controls"><span class="mb-links"></span></div>').appendTo(base.$wrap);
			}
			if (o.buildNav && base.totalPanels > 1) {
				var t, j, a = '', $a;
				base.$panels.filter(':not(.cloned)').each(function(i){
					j = i + 1;
					a = '<a class="mb-link mb-panel' + j + '" href="#"></a>';
					$a = $(a);
					// If a formatter function is present, use it
					if ($.isFunction(o.navFormatter)) {
						t = o.navFormatter(j, $(this));
						if (typeof(t) === "string") {
							$a.html(t);
						} else {
							$a = $('<a/>', t);
						}
					} else {
						$a.html(j);
					}
					$a
					.appendTo(base.$nav.find('.mb-links'))
					.addClass('mb-link mb-panel' + j)
					.data('index', j);
				});
				base.$nav
					.find('a.mb-link').bind('click', function() {
						base.change( $(this).data('index') );
						return false;
					});
			}
		};

		// Resize panels to normal
		base.returnToNormal = function(num, time){
			var panels = base.$panels.not(':eq(' + (num - base.adj) + ')').removeClass(o.currentPanel);
			if (o.reducedSize === 1) {
				panels.css({ width: base.regWidth }); // excluding fontsize change to prevent video flicker
			} else {
				panels.stop(true,false).animate({ width: base.regWidth, fontSize: o.reducedSize + 'em' }, (time === 0) ? 0 : o.speed);
			}
		};

		// Zoom in on selected panel
		base.growBigger = function(num, time, flag){
			var panels = base.$panels.eq(num - base.adj);
			if (o.reducedSize === 1) {
				panels.css({ width: base.curWidth }); // excluding fontsize change to prevent video flicker
				// time delay prevents click outer panel from following links - fixes issue #67
				setTimeout(function(){
					base.completed(num, flag);
				}, (time === 0) ? 0 : o.speed);
			} else {
				panels.stop(true,false).animate({ width: base.curWidth, fontSize: '1em' }, (time === 0) ? 0 : o.speed, function(){
					// completed event trigger
					// even though animation is not queued, trigger is here because it is the last animation to complete
					base.completed(num, flag);
				});
			}
		};

		base.completed = function(num, flag){
			// add current panel class after animating in case it has sizing parameters
			var loc = base.$panels.eq(num - base.adj);
			if (!loc.hasClass('cloned')) { loc.addClass(o.currentPanel); }
			if (flag !== false) { base.$el.trigger( 'completed.movingBoxes', [ base, num ] ); }
		};

		// go forward/back
		base.goForward = function(callback){
			if (base.initialized) {
				base.change(base.curPanel + 1, callback);
			}
		};

		base.goBack = function(callback){
			if (base.initialized) {
				base.change(base.curPanel - 1, callback);
			}
		};

		// Change view to display selected panel
		base.change = function(curPanel, callback, flag){

			if (base.totalPanels < 1) {
				if (typeof(callback) === 'function') { callback(base); }
				return;
			}
			var ani, leftValue, t, wrapped = false;
			flag = flag !== false;
			t = (flag) ? o.speed : 0;

			// check if curPanel is an id or class name
			if (/^[#|.]/.test(curPanel) && $(curPanel).length) {
				curPanel = $(curPanel).closest('.mb-panel').index() + base.adj;
			} else {

				// make sure it's a number and not a string
				curPanel = parseInt(curPanel, 10);
			}

			if (base.initialized && flag) {
				// make this moving box active
				if (!base.$wrap.hasClass('mb-active-slider')) { base.active(); }
				// initChange event - has extra parameter with targeted panel (not cleaned)
				base.$el.trigger( 'initChange.movingBoxes', [ base, curPanel ] );
			}

			// Make infinite scrolling work
			if (o.wrap) {
				if (curPanel > base.totalPanels) {
					wrapped = true;
					curPanel = 1;
					base.returnToNormal(0, 0);
					base.growBigger(0, 0, false);
					leftValue = base.$panels.eq(0).position().left - (base.width - base.curWidth) / 2; // - ( base.curWidth - base.regWidth );
					base.$window.scrollLeft(leftValue);
				} else if (curPanel === 0) {
					wrapped = false;
					curPanel = base.totalPanels;
					base.growBigger(curPanel + 1, 0, false);
					leftValue = base.$panels.eq(curPanel + 1).position().left - (base.width - base.curWidth) / 2; // - ( base.curWidth - base.regWidth );
					base.$window.scrollLeft(leftValue);
				}
			}

			if ( curPanel < base.adj ) { curPanel = (o.wrap) ? base.totalPanels : 1; }
			if ( curPanel > base.totalPanels - base.adj ) { curPanel = (o.wrap) ? 1 : base.totalPanels; }

			// abort if panel is already animating
			// animation callback needed to clear this flag, but there is no animation before base.initialized is set
			if (!base.currentlyMoving || !base.initialized) {
				// set animation flag; animation callback will clear this flag
				base.currentlyMoving = !o.stopAnimation;

				// center panel in scroll window
				base.$curPanel = base.$panels.eq(curPanel - base.adj);
				leftValue = base.$curPanel.position().left - (base.width - base.curWidth) / 2;

				// when scrolling right, add the difference of the larger current panel width
				if (curPanel > base.curPanel || wrapped) { leftValue -= ( base.curWidth - base.regWidth ); }
				ani = (o.fixedHeight) ? { scrollLeft : leftValue } : { scrollLeft: leftValue, height: base.heights[curPanel - base.adj] };
				base.curPanel = curPanel;
				// before animation trigger
				if (base.initialized && flag) { base.$el.trigger( 'beforeAnimation.movingBoxes', [ base, curPanel ] ); }
				// animate the panels
				base.$window.scrollTop(0).stop(true,false).animate( ani,
					{
						queue    : false,
						duration : t,
						easing   : o.easing,
						complete : function(){
							if (base.initialized) {
								base.$window.scrollTop(0); // Opera fix - otherwise, it moves the focus link to the middle of the viewport
							}
							base.currentlyMoving = false;
							if (typeof(callback) === 'function') { callback(base); }
						}
					}
				);

				base.returnToNormal(curPanel, t);
				base.growBigger(curPanel, t, flag);
				base.updateArrows(curPanel);
				if (o.hashTags && base.initialized) { base.setHash(curPanel); }

			}

			// Update navigation links
			if (o.buildNav && base.$nav.length) {
				base.$nav.find('a.mb-link')
					.removeClass(o.currentPanel)
					.eq(curPanel - 1).addClass(o.currentPanel);
			}

		};

		base.updateArrows = function(cur){
			base.$left.toggleClass(o.disabled, !o.wrap && cur === base.adj);
			base.$right.toggleClass(o.disabled, !o.wrap && (cur === base.totalPanels || base.totalPanels === 0));
		};

		// This method tries to find a hash that matches an ID and slider-X
		// If either found, it tries to find a matching item
		// If that is found as well, then it returns the page number
		base.getHash = function(){
			var h = window.location.hash,
				i = h.indexOf('&'),
				n = h.match(base.regex);
			// test for "/#/" or "/#!/" used by the jquery address plugin - $('#/') breaks jQuery
			if (n === null && !/^#&/.test(h) && !/#!?\//.test(h)) {
				// #quote2&panel1-3&panel3-3
				h = h.substring(0, (i >= 0 ? i : h.length));
				// ensure the element is in the same slider
				n = ($(h).length && $(h).closest('.mb-slider')[0] === base.el) ? $(h).closest('.mb-panel').index() + base.adj : null;
			} else if (n !== null) {
				// #&panel1-3&panel3-3
				n = (o.hashTags) ? parseInt(n[1],10) : null;
			}
			return n;
		};

		// set hash tags
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
		reducedSize  : 0.8,       // non-current panel size: 80% of panel size
		fixedHeight  : false,     // if true, slider height set to max panel height; if false, slider height will auto adjust.
		// width and panelWidth are now set in the css, but these options still work for backwards compatibility
		// width        : 800,       // overall width of movingBoxes
		// panelWidth   : 500,       // current panel width adjusted to 50% of overall width

		// Behaviour
		speed        : 500,       // animation time in milliseconds
		initAnimation: true,      // if true, movingBoxes will initialize, then animate into the starting slide (if not the first slide)
		stopAnimation: false,     // if true, movingBoxes will force the animation to complete immediately, if the user selects the next panel
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
		preinit         : null,   // callback after the basic MovingBoxes structure has been built; before "initialized"
		initialized     : null,   // callback when MovingBoxes has completed initialization; all images loaded
		initChange      : null,   // callback upon change panel change initialization
		beforeAnimation : null,   // callback before any animation occurs
		completed       : null    // callback after animation completes
	};

	$.fn.movingBoxes = function(options, callback, flag){
		var num, mb;
		return this.each(function(){
			mb = $(this).data('movingBoxes');
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
					// page #, autoplay, one time callback, if flag is false then no events triggered and animation time = 0
					mb.change(num, callback, flag);
				}
			}
		});
	};

	// Return the movingBoxes object
	$.fn.getMovingBoxes = function(){
		return this.data('movingBoxes');
	};

})(jQuery);