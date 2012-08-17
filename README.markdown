# MoxingBoxes jQuery Plugin

* [WordPress plugin](http://wordpress.org/extend/plugins/movingboxes-wp/) - by [Craftyhub](https://github.com/craftyhub).
* [Documentation](https://github.com/CSS-Tricks/MovingBoxes/wiki) now maintained in the wiki pages.
* [Original post](http://css-tricks.com/moving-boxes/) at CSS-Tricks.
* Latest [MovingBoxes demo](http://css-tricks.github.com/MovingBoxes).
* Have an issue? Submit it [here](https://github.com/CSS-Tricks/MovingBoxes/issues).

## Changelog

(Only the most recent changes are shown below, see the [wiki page](https://github.com/CSS-Tricks/MovingBoxes/wiki/Change-Log) for a complete listing)

### Version 2.2.16 (8/17/2012)

* Added new styling to the demo pages (Chris)
* Updated to jQuery v1.8
* Included padding and margins in the panel position calculation to better center them.

### Moved repo to CSS-Tricks (8/15/2012)

* Sorry for the inconvience, but we've moved the MovingBoxes repository from chriscoyier's account over to the CSS-Tricks organization's account.
* Changed all links to point to the correct repository.
* If you run into a jsFiddle demo that doesn't work, just update the resources links; but please don't link directly to these files from your site, use these files for demo purposes only.

    http://css-tricks.github.com/MovingBoxes/css/movingboxes.css
    http://css-tricks.github.com/MovingBoxes/js/jquery.movingboxes.js

### Version 2.2.15 (4/23/2012)

* The `initAnimation` option should again prevent the initial animation. Fix for [issue #79](https://github.com/CSS-Tricks/MovingBoxes/issues/79).

### Version 2.2.14 (3/22/2012)

* Modified `hashTags` option and internal change function to now accept jquery id or class selectors:
  * Call it as follows: `$('#slider').data('movingBoxes').change('#astronaut');`
  * Link to main demo slide: [http://css-tricks.github.com/MovingBoxes/index.html#astronaut](index.html#astronaut).
  * On page load, hash tags will now set the initial slide and ignore the `hashTag` option setting. Previously it would ignore all hash tags if the option was `false`.
* Animation stops have been modified to now complete the animation instead of jumping to the end. This will smooth out the animation and resolve [issue #73](https://github.com/CSS-Tricks/MovingBoxes/issues/73).

### Version 2.2.13 (3/2/2012)

* Added `stopAnimation` option.
 * If false, movingBoxes will continue to behave as it always has. Any attempt to navigation using arrows or the navigation panel will be ignored until the animation has completed.
 * When true, movingBoxes will force the animation to complete immediately, if the user selects the next panel.
 * This will speed up the animation between panels, but the slider will jump to the next slide instead of smoothly animating.
 * Setting this to true appears to work nicely when adding [navigation using a mousewheel](http://jsfiddle.net/Mottie/acV4n/749/).

### Version 2.2.12 (3/2/2012)

* Added callbacks to the `goForward()` and `goBack()` internal functions. Previously only the `change()` function had a callback option. Use it as follows:

    ```javascript
    var mb = $('#slider').data('movingBoxes');

    // change needs a panel number: mb.change(2, callback);

    // mb.goForward(callback) or mb.goBack(callback)
    mb.goForward(function(){
       // do something after MovingBoxes has finished the animation
    });
    ```

* Modified the internal `change` function:
 * Multiple calls to it in rapid succession will no longer break the appearance of the slider.
 * Changed to make this [mousewheel demo](http://jsfiddle.net/Mottie/acV4n/744/) would work properly.
 * In response to [issue #71](https://github.com/CSS-Tricks/MovingBoxes/issues/71).

### Version 2.2.11 (2/28/2012)

* Fixed cloned panels getting labeled with the "current" class. This will fix [issue #67](https://github.com/CSS-Tricks/MovingBoxes/issues/67).

### Version 2.2.10 (2/28/2012)

* Fixed navFormatter
 * I copied the code from AnythingSlider which has its option named "navigationFormatter", not "navFormatter". That'll teach me for not testing!
 * Fixed the index since it was sending the navFormatter a zero-based index instead of the expected one-based index.

### Version 2.2.9 (2/27/2012)

* Added `preinit` callback/event
  * This event is triggered after the basic MovingBoxes structure has been established
  * It occurs before the `initialized` event.
  * Using this event allow for modifying the struction without any initialization delay.
  * See [issue #68](https://github.com/CSS-Tricks/MovingBoxes/issues/68) on how use this event to add inline navigation arrows.
* Modified the navigationFormatter option:
  * Navigation links are now wrapped by a span with a class of "mb-links".
  * The contents within the wrapper are removed and updated every time MovingBoxes gets updated.
  * The wrapper was added to allow prepending and appending navigation arrows, see [issue #68](https://github.com/CSS-Tricks/MovingBoxes/issues/68).
  * You can now apply attributes directly to the navigation link as well as modifying the contents; this allows for adding tooltip titles or other data attributes.
  * Please refer to the [documentation](https://github.com/CSS-Tricks/MovingBoxes/wiki/Usage) for more details.

### Version 2.2.8 (2/22/2012)

* Clicking on side panels should not follow the link. A better fix for [issue #67](https://github.com/CSS-Tricks/MovingBoxes/issues/67).

### Version 2.2.7 (2/21/2012)

* Clicking on the side panels that are completely wrapped in a link should no longer open that link. Attempt to fix [issue #67](https://github.com/CSS-Tricks/MovingBoxes/issues/67).

### Version 2.2.6 (2/21/2012)

* Clicking on panels to switch will now trigger callbacks. Fix for [issue #66](https://github.com/CSS-Tricks/MovingBoxes/issues/66).

### Version 2.2.5 (1/13/2012)

* Fixed a problem with multiple initializations.
* Remove the name attribute from inputs in cloned panels.
