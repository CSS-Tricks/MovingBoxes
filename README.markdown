# MoxingBoxes jQuery Plugin

* [WordPress plugin](http://wordpress.org/extend/plugins/movingboxes-wp/) - by [Craftyhub](https://github.com/craftyhub).
* [Documentation](https://github.com/chriscoyier/MovingBoxes/wiki) now maintained in the wiki pages.
* [Original post](http://css-tricks.com/moving-boxes/) at CSS-Tricks.
* Latest [MovingBoxes demo](http://chriscoyier.github.com/MovingBoxes).
* Have an issue? Submit it [here](https://github.com/chriscoyier/MovingBoxes/issues).

## Changelog

(Only the most recent changes are shown below, see the [wiki page](https://github.com/chriscoyier/MovingBoxes/wiki/Change-Log) for a complete listing)

### Version 2.2.7 (2/21/2012)

* Clicking on the side panels that are completely wrapped in a link should no longer open that link. Attempt to fix [issue #67](https://github.com/chriscoyier/MovingBoxes/issues/67).

### Version 2.2.6 (2/21/2012)

* Clicking on panels to switch will now trigger callbacks. Fix for [issue #66](https://github.com/chriscoyier/MovingBoxes/issues/66).

### Version 2.2.5 (1/13/2012)

* Fixed a problem with multiple initializations.
* Remove the name attribute from inputs in cloned panels.

### Version 2.2.4 (1/10/2012)

* Fixed a bug introduced in the last update where the last panel would be misaligned when scrolling in the previous direction.

### Version 2.2.3 (1/10/2012)

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

### Version 2.2.2 (1/3/2012)

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
