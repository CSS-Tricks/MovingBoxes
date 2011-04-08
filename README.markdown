## Usage & Options ([Demo](http://chriscoyier.github.com/MovingBoxes))

	$('.slider').movingBoxes({
		// Appearance
		startPanel   : 1,         // start with this panel
		width        : 800,       // overall width of movingBoxes (not including navigation arrows)
		panelWidth   : 0.5,       // current panel width adjusted to 50% of overall width
		reducedSize  : 0.8,       // non-current panel size: 80% of panel size
		imageRatio   : 4/3,       // Image ratio set to 4:3
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
		panelType    : '> div',   // selector to find the immediate ">" children "div" of the movingBoxes object

		// Callbacks
		initialized     : null,   // callback when MovingBoxes has completed initialization
		initChange      : null,   // callback upon change panel initialization
		beforeAnimation : null,   // callback before any animation occurs
		completed       : null    // callback after animation completes
	});

## Methods
* Uses standard index (starts from one)
* Use either `$('.slider').data('movingBoxes')` or `$('.slider').getMovingBoxes()` to access the methods - they are equivalent.
* Get

		// returns # of currently selected/enlarged panel
		var panel = $('.slider').data('movingBoxes').currentPanel();

* Set

		// returns panel#, scrolls to 2nd panel, then runs callback function
		var panel = $('.slider').data('movingBoxes').currentPanel(2, function(slider){
			alert('done! now on slide #' + slider.curPanel); // callback
		});

* External Controls

		$('.slider').data('movingBoxes').goForward(); // go forward one slide (if possible)
		$('.slider').data('movingBoxes').goBack();    // go back one slide (if possible)

* Formatting Navigation Link Text

		// Example 1
		$('.slider').movingBoxes({
			buildNav     : true,
			navFormatter : function(index, panel){ return "&#9679;"; }
		})
		// Example 2 - see index.html source (function which gets nav text from span inside the panel header)
		$('.slider').movingBoxes({
			buildNav     : true,
			navFormatter : function(index, panel){ return panel.find('h2 span').text(); }
		})

## Extending
* Event Hooks (callback functions)

	* `initialized.movingBoxes` (`initialized`) - Triggered when MovingBoxes has completed its initialization. It may occur before all animation has completed (hash tag updating).
	* `initChange.movingBoxes` (`initChange`) - Triggered immediately after the script is called to change the panels. No checks have been done at this point. An additional variable of the targeted panel number is available - see the examples below.
	* `beforeAnimation.movingBoxes` (`beforeAnimation`) - Triggered before the movingBoxes panels animate. An additional variable of the targeted panel number is available - see the examples below.
	* `completed.movingBoxes` (`completed`) - Triggered after the panels have completed their animations (sliding and resizing).

* Binding to events

		$('.slider').bind('initChange.movingBoxes beforeAnimation.movingBoxes completed.movingBoxes',function(e, slider, tar){
			var txt = 'MovingBoxes with ID #' + slider.$el[0].id + ' has just triggered ' + e.type +
				' is now on panel #' + slider.curPanel + ', and the targeted panel is ' + tar;
			alert( txt );
		});

* Using a callback function (added to the MovingBoxes initialization options):

		$('.slider').movingBoxes({
			initChange      : function(e, slider, tar){
				alert( 'MovingBoxes was called to change panels, the targeted panel is #' + tar );
			},
			beforeAnimation : function(e, slider, tar){
				alert( 'You are about to switch from panel #' + slider.curPanel + ' to panel #' + tar);
			},
			completed       : function(e, slider, tar){
				alert( 'Now on panel #' + tar );
			}
		})

* Callback/Event Arguments (assuming you used slider as the variable name inside the function `function(slider){}`)

	* slider.curPanel - Current active panel (enlarged and centered). Standard based index (e.g. first panel is number 1, second is number 2). This value is not updated with the targeted panel until the `completed` event is called.
	* slider.totalPanels - Number of panels inside that slider.
	* slider.$el - jQuery object of the entire movingBoxes slider - this is the movingBoxes target when the script was initialized.
	* slider.$panels - jQuery object of all of the panels. To target the current panel, use `slider.$panels.eq( slider.curPanel - 1 )`.
	* slider.options.{name} - Access any of the options this way. Do not try to set any of the options in this manner because it may break the movingBoxes slider.

## Credits

* Original Script by Chris Coyier
* Modified into [a plugin](http://wowmotty.blogspot.com/2010/06/moving-boxes-updated.html) by Rob Garrison (aka Mottie)

## Changelog

###Version 2.0.2 (4/8/2011)
* Changed default box shadow to be "inset".
* Added a separate IE stylesheet for versions < 9. Older IE versions will use a background image to add an inner shadow. It is using a png file, so it may not work properly in all older versions.

###Version 2.0.1 (3/31/2011)
* Added more width to the scroll container. Fix for issue #19.
* Centered the image... silly css problem. Fix for issue #20.
* Moving boxes will no longer scroll when using the space bar or arrow keys inside an input, selector or textarea. Fix for issue #22.

###Version 2.0 (3/11/2011)
* Made all css class name more unique by adding a "mb-" in front. Fix for [issue #15](https://github.com/chriscoyier/MovingBoxes/issues/15).
* Removed font-size animation, and set percentage font sizes in the css. This reduces the amount of scripting and speeds up the script. CSS comments added to make these changes more clear.
* Removed `panelTitle` and `panelText` options as these sizes are now controlled as percentages in the CSS.
* Removed `panels` class name from HTML markup. It is now `mb-panels` and automatically added by the script.
* Added `panelType` option. This is the jQuery selector used to find the panels.

	* The default value is "> div" which means target the immediate children (">") only if they are divs "div".
	* For example, the first demo is now an unordered list (ul#slider-one &amp; li) with it's `panelType` set to "> LI" (the immediate childen of the UL).
	* The second demo example has divs inside of a div#slider-two. So `panelType` is not set in the options.
	* If the ">" (immediate children selector) is not used, any panels that have matching elements ("LI" within a list inside the panel) will also be targeted and likely break the MovingBoxes appearance.
	* If there are any issues with panels not being found, then set `panelType` to something like ".myPanel", then just add the "myPanel" class to panel.

* Added a "movingBoxes" namespace to all events

	* The triggered events are now as follows: `initialized.movingBoxes`, `initChange.movingBoxes`, `beforeAnimation.movingBoxes` and `completed.movingBoxes`.
	* The "tar" event variable is now available in all events (it wasn't included in the `initialized` and `completed` events before).
	* Use it as follows:

			$('#slider').bind('completed.movingBoxes', function(e, slider, tar){
				// e.type = "completed", e.namespace = "movingBoxes"
				// tar = target panel# which is the same as current panel (slider.curPanel) when "completed" event is called
				alert('Now on panel #' + slider.curPanel);
			});

	* Note that the callback names haven't changed (don't add a ".movingBoxes" to the end when adding the callback name in the initialization options.

			$('#slider').movingBoxes({
				// tar = target panel# which is the same as current panel (slider.curPanel) when "completed" event is called
				completed : function(e, slider, tar) { alert('now on panel ' + tar); }
			})

* Added a "slider" variable to the set method callback:

			// returns panel#, scrolls to 2nd panel, then runs callback function
			// panel also contains the current slide #, but it's not accessible inside the callback
			var panel = $('.slider').data('movingBoxes').currentPanel(2, function(slider){
				alert('done! now on slide #' + slider.curPanel); // callback
			});

* Fixed a problem in Opera where the top half of the panel would be out of view.

###Version 1.7.1 (2/27/2011)
* Fixed [issue #13](https://github.com/chriscoyier/MovingBoxes/issues/13). The page no longer scrolls to the MovingBoxes during initialization.
* Rearranged the events & callbacks to not occur until everything has been initialized.
* Added a callback to the set method. So you can now do this:
	
		// returns panel#, scrolls to 2nd panel, then runs callback function
		var panel = $('.slider').data('movingBoxes').currentPanel(2, function(){
		  alert('done!'); // callback
		});

###Version 1.7 (1/29/2011)
* Fixed [issue #8](https://github.com/chriscoyier/MovingBoxes/issues#issue/8), sliding glitch error which actually turned out to be a [jQuery error](http://bugs.jquery.com/ticket/7193) to be fixed in jQuery 1.5... but this version completely bypasses this bug by now using scrollLeft instead of left to position the panels.
* Cleaned up and removed duplicates in the css.

###Version 1.6.3 (11/17/2010)
* Added callbacks and triggered events: `initialized`, `initChange`, `beforeAnimation` and `completed`.

###Version 1.6.2 (11/7/2010)
* Added new "arrows.png" and "arrows.gif" to combine the separate arrow images.
* Changed the initialization of the MovingBoxes script to not give internal links focus. Without this, MovingBoxes panels not at the top of a page will make the page to scroll down.
* Fixed active panel problem introduced with the above change :P
* Removed "leftarrow.png", "rightarrow.png", "leftshadow.png" and "rightshadow.png" images.

###Version 1.6.1 (10/24/2010)
* Added `easing` option which if set to anything other than 'linear' or 'swing' then the easing plugin would be required.

###Version 1.6 (10/22/2010)
* Added `buildNav` option, which if true will build navigation links which will contain panel numbers by default.
* Added `navFormatter` option. This is an optional setting which can contain a function that returns a value for each tab index. See formatting navigation link text examples above.
* Added `tooltipClass` option which will be added to the navigation links, but only if a `navFormatter` function exists. Also note that the title attribute will be empty unless.the link text is hidden using a negative text-indent css class.
* Added `panelTitle` option to target the title tag inside the MovingBoxes panel. Selectors or multiple tags can be included (e.g. 'h1, h2.title').
* Added `panelText` option to target the text content of the MovingBoxes panel. This too can include a selector or multiple tags (e.g. 'p.wrap, div').
* Added the CSS class `current` to the expanded panel & updated the CSS to change the cursor to a pointer in non-"current" panels.
* Thanks again to dlopez2000 for suggestions and code samples :)

###Version 1.5.1 (10/15/2010)
* Added `fixedHeight` option, which if true will set the overall slider height to the tallest panel.
* Adjusted navigation arrow css to use a percentage from top of slider instead of calculating it in the script (removed).

###Version 1.5 (10/13/2010)
* Added panel height auto-resizing, in case there is extra text inside a panel - thanks dlopez2000!
* Added `hashTags` option to enable hash tags which works with multiple sliders - thanks dlopez2000!
* Added `wrap` option for psuedo wrapping of the panel when it reaches the end - making it really wrap like the AnythingSlider would bloat the code way too much.
* Added external controls to allow calling `goForward()` or `goBack()` functions to control the slider. See example above.
* Removed image arrow URLs from the options. Modified arrow image to include a hover state, then added it to the CSS.
* Fixed some problems with IE8 (and compatibility mode).
* Fixed IE keyboard navigation.
* Cleaned up and separated the CSS (demo CSS is in a separate file now).

###Version 1.4 (8/26/2010)
* Reduced the amount of HTML markup - Internalized with CSS adjustment of elements (e.g. arrow images)
* Added left and right navigation arrow urls to the options. The images are added as <img> by the script in an attempt to reduce the amount of required HTML markup
* Removed sizing options (movingDistance, curWidth, curImgWidth, curTitleSize, curParSize).
* Added options to set overall width (width), panelWidth (50% of overall width), reducedSize (80% of currently displayed panel), imageRation (4:3 ratio to resize images to properly fit the panel).
* Added keyboard support for multiple sliders (added back arrow keys and spacebar; but not the enter key as it will follow the external links)
* Added panel centering to fix [issue #2](http://github.com/chriscoyier/MovingBoxes/issues#issue/2).
* Updated the index.html to give examples of different movingBox sizes and image ratios.

###Version 1.3 (6/21/2010)
* Significant rewrite & conversion to a plugin (based off of http://starter.pixelgraphics.us/)
* Removed keyboard support, it would look wierd having mulitple panels moving. Maybe someone has a better method?
* Added method to get/set current displayed panel

###Version 1.2 (2/17/2009)
* Keyboard support added, arrow keys, spacebar, and enter key
* Code cleaned up, number of panels and initial widths/sizes are no longer hard coded, so easier to build upon
* Clicking on non-active left or right panels also triggers animation

###Version 1.1 (2/16/2009) - Issue with double clicking fixed. Next animation can only start when current animation is complete.
###Version 1.0 (2/16/2009) - Script released to public
