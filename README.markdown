# MoxingBoxes jQuery Plugin ([demo](http://css-tricks.github.com/MovingBoxes))

* [WordPress plugin](http://wordpress.org/extend/plugins/movingboxes-wp/) - by [Craftyhub](https://github.com/craftyhub).
* [Documentation](https://github.com/CSS-Tricks/MovingBoxes/wiki) now maintained in the wiki pages.
* [Original post](http://css-tricks.com/moving-boxes/) at CSS-Tricks.
* Latest [MovingBoxes demo](http://css-tricks.github.com/MovingBoxes).
* Having trouble getting MovingBoxes installed? Ask for help in the [CSS-Tricks forums](http://css-tricks.com/forums/discussions).
* Have an issue or find an error? Submit it [here](https://github.com/CSS-Tricks/MovingBoxes/issues).

## Changelog

(Only the most recent changes are shown below, see the [wiki page](https://github.com/CSS-Tricks/MovingBoxes/wiki/Change-Log) for a complete listing)

### Version 2.3.4 (1/21/2013)

* Version bump to [register the plugin](http://plugins.jquery.com/movingboxes).

### Version 2.3.3 (1/18/2013)

* New version labeled to enable updating the [jquery plugin registry](http://plugins.jquery.com/).

### Version 2.3.2b (1/6/2013)

* Updated playground demo. Using jQuery edge appears to mess up the scrolling behavior.
* Added .gitignore and .gitattributes files.

### Version 2.3.2 (11/17/2012)

* Updated the API used to change panels. It will now accept a jQuery object of the panel or an element anywhere inside panel:

    ```javascript
    // go to panel 3
    var lnk3 = $('.link3'); // link inside panel 3
    $('#boxes').movingBoxes(lnk3, function(api){
      alert('Now on panel #' + api.curPanel);
    });
    ```

    You can also call the api directly

    ```javascript
    // go to panel 3
    var api = $('#boxes').data('movingBoxes'), // movingboxes object (api)
        lnk3 = $('.link3'); // link inside panel 3
    api.change(lnk3, function(api){
        alert('Now on panel #' + api.curPanel);
    });
    ```

* Fixed the issue with the first panel not positioning correctly when the hash is not set.
* Fixed issues with dealing with only one panel:
  * MovingBoxes with one or less panels will now properly hide the navigation arrows.
  * Starting with two panels and the first slide selected, when the second one was removed, the first panel would not resize. It does now!
* Fixed an issue that occurred when the indicated hash panel didn't exist - the first cloned slide used to display instead.

### Version 2.3.1 (10/9/2012)

* MovingBoxes will no longer start on the first cloned panel when the `wrap` option is set to `true`. Fixes [issue #97](https://github.com/CSS-Tricks/MovingBoxes/issues/97).

### Version 2.3 (9/18/2012)

* Added a method to check when all images have loaded, then reevaluate the height of each panel.
  * The plugin that was incorporated is called [imagesLoaded](https://github.com/Mottie/imagesLoaded).
  * This entailed rewritting and fixing the plugin initialization function ([issue #92](https://github.com/CSS-Tricks/MovingBoxes/issues/92) and initAnimation problems ([issue #79](https://github.com/CSS-Tricks/MovingBoxes/issues/79)).
  * I hope this also includes fixing whatever is going on in [issue #62](https://github.com/CSS-Tricks/MovingBoxes/issues/62).
* Added a `delayBeforeAnimate` option:
  * The `beforeAnimation` event will be fired, then the animation will be delayed by the value in `delayBeforeAnimate` in milliseconds.
  * See [issue #80](https://github.com/CSS-Tricks/MovingBoxes/issues/80) on how this could be useful :). Thanks to [Alfazo](https://github.com/Alfazo) for the suggestion.
* Modified the layout so that the UL now gets the margin to center the panels within the frame instead of the first LI. This fixes the animation jump seen when switching from the second to first panel.
* Removed byte order mark (BOM) from the js files. Fix for [issue #94](https://github.com/CSS-Tricks/MovingBoxes/issues/94).

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
