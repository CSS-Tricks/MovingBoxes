### Usage & Options ([Demo](http://chriscoyier.github.com/MovingBoxes))

	$('.slider').movingBoxes({
		startPanel  : 1,     // start with this panel
		width       : 800,   // overall width of movingBoxes
		panelWidth  : .5,    // current panel width adjusted to 50% of movingBoxes width
		reducedSize : .8,    // non-current panel size: 80% of current panel size
		imageRatio  : 4/3,   // Image ratio set to 4:3
		speed       : 500,   // animation time in milliseconds
		hashTags    : true,  // if true, hash tags are enabled
		wrap        : false  // if true, the panel will "wrap" at the ends
	});

### Methods
* Uses standard index (starts from one)
* Get/Set:

		var panel = $('.slider').data('movingBoxes').currentPanel();  // returns # of currently selected/enlarged panel
		var panel = $('.slider').data('movingBoxes').currentPanel(2); // returns # and scrolls to 2nd panel

* External Controls

		$('.slider').data('movingBoxes').goForward(); // go forward one slide (if possible)
		$('.slider').data('movingBoxes').goBack();    // go back one slide (if possible)

### Credits

* Original Script by Chris Coyier
* Modified into [a plugin](http://wowmotty.blogspot.com/2010/06/moving-boxes-updated.html) by Rob Garrison (aka Mottie)

### Changelog

* Version 1.5 (10/13/2010)
    * Added panel height auto-resizing, in case there is extra text inside a panel - thanks dlopez2000!
    * Added `hashTags` option to enable hash tags which works with multiple sliders - thanks dlopez2000!
    * Added `wrap` option for psuedo wrapping of the panel when it reaches the end - making it really wrap like the AnythingSlider would bloat the code way too much.
    * Added external controls to allow calling `goForward()` or `goBack()` functions to control the slider. See example above.
    * Removed image arrow URLs from the options. Modified arrow image to include a hover state, then added it to the CSS.
    * Fixed some problems with IE8 (and compatibility mode).
    * Fixed IE keyboard navigation.
    * Cleaned up and separated the CSS (demo CSS is in a separate file now).

* Version 1.4 (8/26/2010)
    * Reduced the amount of HTML markup - Internalized with CSS adjustment of elements (e.g. arrow images)
    * Added left and right navigation arrow urls to the options. The images are added as <img> by the script in an attempt to reduce the amount of required HTML markup
    * Removed sizing options (movingDistance, curWidth, curImgWidth, curTitleSize, curParSize).
    * Added options to set overall width (width), panelWidth (50% of overall width), reducedSize (80% of currently displayed panel), imageRation (4:3 ratio to resize images to properly fit the panel).
    * Added keyboard support for multiple sliders (added back arrow keys and spacebar; but not the enter key as it will follow the external links)
    * Added panel centering to fix [issue #2](http://github.com/chriscoyier/MovingBoxes/issues#issue/2).
    * Updated the index.html to give examples of different movingBox sizes and image ratios.

* Version 1.3 (6/21/2010)
    * Significant rewrite & conversion to a plugin (based off of http://starter.pixelgraphics.us/)
    * Removed keyboard support, it would look wierd having mulitple panels moving. Maybe someone has a better method?
    * Added method to get/set current displayed panel

* Version 1.2 (2/17/2009)
    * Keyboard support added, arrow keys, spacebar, and enter key
    * Code cleaned up, number of panels and initial widths/sizes are no longer hard coded, so easier to build upon
    * Clicking on non-active left or right panels also triggers animation

* Version 1.1 (2/16/2009) - Issue with double clicking fixed. Next animation can only start when current animation is complete.
* Version 1.0 (2/16/2009) - Script released to public
