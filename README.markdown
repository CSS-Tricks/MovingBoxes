## MoxingBoxes jQuery Plugin

* [Documentation](https://github.com/chriscoyier/MovingBoxes/wiki) now maintained in the wiki pages.
* [Original post](http://css-tricks.com/moving-boxes/) at CSS-Tricks.
* Latest [MovingBoxes demo](http://chriscoyier.github.com/MovingBoxes).
* Have an issue? Submit it [here](https://github.com/chriscoyier/MovingBoxes/issues).

## Changelog

(Only the most recent changes are shown below, see the [wiki page](https://github.com/chriscoyier/MovingBoxes/wiki/Change-Log) for a complete listing)

###Version 2.0.4 (5/7/2011)
* Fixed hash tags which apparently broke in the last version =/

###Version 2.0.3 (4/22/2011)
* Adjusted width of MovingBoxes internal wrapper to fix issue #24.
* Restructured the plugin to allow updating MovingBoxes after adding or removing a panel.
 * To use, simply call the plugin a second time without any options: `$('.slider').movingBoxes();`
 * These new changes now require a minimum of jQuery version 1.4.2 (due to the use of "delegate()").
* Restructured the layout of MovingBoxes.
 * Previously, two divs were wrapped inside of the element the MovingBoxes plugin was called on. The structure was like this: #slider-one.movingBoxes.mb-slider > DIV.mb-scroll > DIV.mb-scrollContainer > .mb-panel.
 * It worked, but when the element was a UL it became poorly formed HTML, because it added two divs inside the UL which wrapped all of the LI's.
 * This restructuring actually only required minor changes to the css: `.mb-slider` is no longer the overall wrapper, it was renamed to `.mb-wrapper` and `.mb-scrollContainer` was renamed to `.mb-slider`
 * The new layout is DIV.movingBoxes.mb-wrapper > DIV.mb-scroll > #slider-one.mb-slider > .mb-panel
 * When accessing the plugin object, you will still target the .mb-slider. So the methods, events & callbacks didn't change at all. You may not even notice a difference, unless you modified the css for your theme.
* Modified the plugin so that instead of using the `currentPanel()` function to set the current panel, you can just call the plugin with a number (shortcut method). Both of these methods do the same thing:
 * `$('.slider').data('movingBoxes').currentPanel(2, function(){ alert('done!'); });`
 * `$('.slider').movingBoxes(2, function(){ alert('done!'); });`

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
