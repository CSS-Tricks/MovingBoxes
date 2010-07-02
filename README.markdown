### Usage

	$("#anything).circulate({

    	speed: 400,                  // Speed of each quarter segment of animation, 1000 = 1 second
    	height: 200,                 // Distance vertically to travel
    	width: 200,                  // Distance horizontally to travel
    	sizeAdjustment: 100,         // Percentage to grow or shrink
    	loop: false,                 // Circulate continuously
    	zIndexValues: [1, 1, 1, 1]   // Sets z-index value at each stop of animation

	});
	
### Keyboard Navigation

There is a file in the /js/ folder called `slider-noplugin-withkeyboard.js` which is the original non-plugin
version of this. It's not as easy to have multiple sliders on the page this way, but it does include 
keyboard navigation. If anyone feels like working on this, moving the keyboard nav into the plugin would 
be awesome.