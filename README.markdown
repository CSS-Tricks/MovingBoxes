### Usage & Options

	$('.slider').movingBoxes({
		startPanel  : 1,                      // start with this panel
		width       : 800,                    // overall width of movingBoxes
		panelWidth  : .5,                     // current panel width adjusted to 50% of movingBoxes width
		reducedSize : .8,                     // non-current panel size: 80% of current panel size
		imageRatio  : 4/3,                    // Image ratio set to 4:3
		speed       : 500,                    // animation time in milliseconds
		leftArrow   : 'images/leftarrow.png', // left arrow image url
		rightArrow  : 'images/rightarrow.png' // right arrow image url
	});

### Methods
- Uses standard index (starts from one)
- Get:	var panel = $('.slider').data('movingBoxes').currentPanel();  // returns # of currently selected/enlarged panel
- Set:	var panel = $('.slider').data('movingBoxes').currentPanel(2); // returns # and scrolls to 2nd panel

### Credits

- Original Script by Chris Coyier
- Modified into [a plugin](http://wowmotty.blogspot.com/2010/06/moving-boxes-updated.html) by Rob G (aka Mottie)

### Changelog

- Version 1.4 (8/26/2010) Rob Garrison
-- Reduced the amount of HTML markup - Internalized with CSS adjustment of elements (e.g. arrow images)
-- Added left and right navigation arrow urls to the options. The images are added as <img> by the script in an attempt to reduce the amount of required HTML markup
-- Removed sizing options (movingDistance, curWidth, curImgWidth, curTitleSize, curParSize).
-- Added options to set overall width (width), panelWidth (50% of overall width), reducedSize (80% of currently displayed panel), imageRation (4:3 ratio to resize images to properly fit the panel).
-- Added keyboard support for multiple sliders (added back arrow keys and spacebar; but not the enter key as it will follow the external links)
-- Added panel centering to fix [issue #2](http://github.com/chriscoyier/MovingBoxes/issues#issue/2).
-- Updated the index.html to give examples of different movingBox sizes and image ratios.

- Version 1.3 (6/21/2010) Rob Garrison
-- Significant rewrite & conversion to a plugin (based off of http://starter.pixelgraphics.us/)
-- Removed keyboard support, it would look wierd having mulitple panels moving. Maybe someone has a better method?
-- Added method to get/set current displayed panel
- Version 1.2 (2/17/2009) Noah Hendrix
-- Keyboard support added, arrow keys, spacebar, and enter key
-- Code cleaned up, number of panels and initial widths/sizes are no longer hard coded, so easier to build upon
-- Clicking on non-active left or right panels also triggers animation
- Version 1.1 (2/16/2009) Chris Coyier - Issue with double clicking fixed. Next animation can only start when current animation is complete.
- Version 1.0 (2/16/2009) Chris Coyier - Script released to public
