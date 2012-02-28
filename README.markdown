# MoxingBoxes jQuery Plugin

* [WordPress plugin](http://wordpress.org/extend/plugins/movingboxes-wp/) - by [Craftyhub](https://github.com/craftyhub).
* [Documentation](https://github.com/chriscoyier/MovingBoxes/wiki) now maintained in the wiki pages.
* [Original post](http://css-tricks.com/moving-boxes/) at CSS-Tricks.
* Latest [MovingBoxes demo](http://chriscoyier.github.com/MovingBoxes).
* Have an issue? Submit it [here](https://github.com/chriscoyier/MovingBoxes/issues).

## Changelog

(Only the most recent changes are shown below, see the [wiki page](https://github.com/chriscoyier/MovingBoxes/wiki/Change-Log) for a complete listing)

### Version 2.2.10 (2/28/2012)

* Fixed navFormatter - I copied the code from AnythingSlider which has its option named "navigationFormatter", not "navFormatter". That'll teach me for not testing!

### Version 2.2.9 (2/27/2012)

* Added `preinit` callback/event
  * This event is triggered after the basic MovingBoxes structure has been established
  * It occurs before the `initialized` event.
  * Using this event allow for modifying the struction without any initialization delay.
  * See [issue #68](https://github.com/chriscoyier/MovingBoxes/issues/68) on how use this event to add inline navigation arrows.
* Modified the navigationFormatter option:
  * Navigation links are now wrapped by a span with a class of "mb-links".
  * The contents within the wrapper are removed and updated every time MovingBoxes gets updated.
  * The wrapper was added to allow prepending and appending navigation arrows, see [issue #68](https://github.com/chriscoyier/MovingBoxes/issues/68).
  * You can now apply attributes directly to the navigation link as well as modifying the contents; this allows for adding tooltip titles or other data attributes.
  * Please refer to the [documentation](https://github.com/chriscoyier/MovingBoxes/wiki/Usage) for more details.

### Version 2.2.8 (2/22/2012)

* Clicking on side panels should not follow the link. A better fix for [issue #67](https://github.com/chriscoyier/MovingBoxes/issues/67).

### Version 2.2.7 (2/21/2012)

* Clicking on the side panels that are completely wrapped in a link should no longer open that link. Attempt to fix [issue #67](https://github.com/chriscoyier/MovingBoxes/issues/67).

### Version 2.2.6 (2/21/2012)

* Clicking on panels to switch will now trigger callbacks. Fix for [issue #66](https://github.com/chriscoyier/MovingBoxes/issues/66).

### Version 2.2.5 (1/13/2012)

* Fixed a problem with multiple initializations.
* Remove the name attribute from inputs in cloned panels.
