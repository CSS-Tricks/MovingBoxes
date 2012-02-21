# MoxingBoxes jQuery Plugin

* [WordPress plugin](http://wordpress.org/extend/plugins/movingboxes-wp/) - by [Craftyhub](https://github.com/craftyhub).
* [Documentation](https://github.com/chriscoyier/MovingBoxes/wiki) now maintained in the wiki pages.
* [Original post](http://css-tricks.com/moving-boxes/) at CSS-Tricks.
* Latest [MovingBoxes demo](http://chriscoyier.github.com/MovingBoxes).
* Have an issue? Submit it [here](https://github.com/chriscoyier/MovingBoxes/issues).

## Changelog

(Only the most recent changes are shown below, see the [wiki page](https://github.com/chriscoyier/MovingBoxes/wiki/Change-Log) for a complete listing)

###Version 2.2.6 (2/21/2012)

* Clicking on panels to switch will now trigger callbacks. Fix for [issue #66](https://github.com/chriscoyier/MovingBoxes/issues/66).

###Version 2.2.5 (1/13/2012)

* Fixed a problem with multiple initializations.
* Remove the name attribute from inputs in cloned panels.

###Version 2.2.4 (1/10/2012)

* Fixed a bug introduced in the last update where the last panel would be misaligned when scrolling in the previous direction.

###Version 2.2.3 (1/10/2012)

* Added `initAnimation` option:
  * When `true` (default), MovingBoxes will show the initial animation starting from the first panel and sliding into the current panel (as determined by the hash or `startPanel` option).
  * If `false`, no animation will be seen and MovingBoxes will start on the appropriate panel.
* The update method now has a flag to prevent callbacks from firing and also has it's own callback:
  * Set the flag to `false` to prevent the built-in callbacks (initChange, beforeAnimation & completed) from firing during the update. This flag is useful if you plan to call the update method a lot, like when the window resizes.
  * The callback for the update is used as follows:

    ```javascript
    // update(flag, callback);
    $('#slider').data('movingBoxes').update(false, function(slider){
      alert('update complete');
    });
    ```

* Fixed clicking on links in the current panel would go to the next panel. Fix for [issue #60](https://github.com/chriscoyier/MovingBoxes/issues/60).
* Updated method of plugin initialization to hopefully ensure that the `completed` callback will not fire until after initialization. Update for [issue #57](https://github.com/chriscoyier/MovingBoxes/issues/57).
* Fixed a problem where the navigation was clearing the current panel after using the update method.
* Hopefully fixed the problems brought up in [issue #49](https://github.com/chriscoyier/MovingBoxes/issues/49). So using this bit of code will allow you to set the MovingBoxes width as a **percentage value**.

    ```javascript
    $(function(){
      $(window).resize(function(){
        // get MovingBoxes plugin object
        var slider = $('.slider').data('movingBoxes');
        // set overall width to 50% of the browser width
        slider.options.width = $(window).width() * 0.5;
        // set panel Width to be 50% of MovingBoxes width (which ends up being 25% of browser width; 50% x 50%)
        // OR you can set the panelWidth to a px amount, say 300 instead of a fraction: "slider.options.panelWidth = 300"
        slider.options.panelWidth = 0.5;
        // update the slider; include false flag to prevent built-in callbacks from firing (optional)
        slider.update(false);
      }).resize(); // trigger window resize to do the initial resizing.
    });
    ```

###Version 2.2.2 (1/3/2012)

* Removed the `width` and `panelWidth` options.
  * The width and panel width are now set using css
  * The plugin is still backwards compatible, so setting the `width` and `panelWidth` in the option will still override the css settings.
  * Updated the `movingboxes.css` with the following css:

    ```css
    /* Default MovingBoxes wrapper size */
    #movingboxes {
      width: 900px;
      min-height: 200px;
    }

    /* Default MovingBoxes panel size */
    #movingboxes > li {
      width: 350px;
    }
    ```

  * So, the width still **should not** be set to a percentage, e.g. `width: 100%`, because it will not update when the window resizes.
  * Here is [a demo](http://jsfiddle.net/Mottie/jMXx3/1/) of how to resize the slider on the fly.
  * Please note that the overall width can now be much much wider than the panel, so please **DON'T use the `wrap` option** in this case because it just doesn't look good.
  * Fixed for [issue #49](https://github.com/chriscoyier/MovingBoxes/issues/49).
* The `completed` callback will no longer run immediately after initialization. Fix for [issue #57](https://github.com/chriscoyier/MovingBoxes/issues/57).

###Version 2.2.1 (11/10/2011)
* Clicking on panels will now work properly. Fix for [issue #44](https://github.com/chriscoyier/MovingBoxes/issues/44).

###Version 2.2 (11/9/2011)
* Modified `wrap` option to now behave like an infinite slider
  * When `true`, the first and last MovingBoxes panels are cloned and attached to either end of the slider.
  * When `false`, the panels will stop at either end and the appropriate navigation arrow will get the `disabled` css class applied.
* Added a basic demo page to make it easier to start out with the base code.
* Added navigation buttons to the demo pages along with a link to a jsFiddle playground.

###Version 2.1.4 (9/11/2011)
* Added `disabled` option
  * This option contains the css class added to the arrows when the `wrap` option is true.
  * When the `wrap` option is false, the slider rewinds when clicking the arrow, so it still has a function.

###Version 2.1.3 (8/26/2011)
* Fixed a problem where the `currentPanel` class was not being applied to the current panel. Fix for [issue #35](https://github.com/chriscoyier/MovingBoxes/issues/35).

###Version 2.1.2 (8/22/2011)
* Fixed a problem with the arrow buttons not working if the slider starts on any slide but the first - weird that it didn't rear it's ugly head until now... Fix for [issue #34](https://github.com/chriscoyier/MovingBoxes/issues/34).

###Version 2.1.1 (6/13/2011)
* Updated to not animate the panel when the `reducedSize` option is set to `1`. This prevents embeded video from restarting - fix for [issue #31](https://github.com/chriscoyier/MovingBoxes/issues/31).

###Version 2.1 (6/10/2011)
* The script now prevents changing slides before it completes initialization. Fix for [issue #29](https://github.com/chriscoyier/MovingBoxes/issues/29).
* Removed element specific resizing:
 * Removed `imageRatio` option. Set the image using a percentage width and it will adjust the height automatically to maintain the image's aspect ratio.
 * In the script, the portion which set the height of images was removed. So now all panel content is set using css percentage values (or "em" for font sizes).
 * Moved CSS, including `.mb-inside img {}` to the demo.css since the layout now allows images of any size inside the panels. The dimensions should now be set in the css using a percentage value.
 * MovingBoxes will update a second time once the page has completely loaded. This now causes a vertical height resizing animation in webkit browsers. One way to work around this is to set the image height of the "current" panel - see the demo.css file.
* Removed `panelType` options as the script now automatically looks for immediate children of the initialized element. You shouldn't even notice a difference.
* Moved all demo related files into a demo folder.

###Version 2.0.5 (6/9/2011)
* Fixed margins when MovingBoxes gets updated. Fix for [issue #30](https://github.com/chriscoyier/MovingBoxes/issues/30).

###Version 2.0.4 (5/7/2011)
* Fixed hash tags which apparently broke in the last version =/
