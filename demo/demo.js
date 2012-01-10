/*
 * MovingBoxes demo script
 */

$(function(){

	$('#slider-one').movingBoxes({
		startPanel   : 1,      // start with this panel
		reducedSize  : 0.8,    // non-current panel size: 80% of panel size
		wrap         : true,   // if true, the panel will "wrap" (it really rewinds/fast forwards) at the ends
		buildNav     : true,   // if true, navigation links will be added
		navFormatter : function(){ return "&#9679;"; } // function which returns the navigation text for each panel

		// width and panelWidth options removed in v2.2.2, but still backwards compatible
		// width        : 300,    // overall width of movingBoxes (not including navigation arrows)
		// panelWidth   : 0.5,    // current panel width

	});

	$('#slider-two').movingBoxes({
		startPanel   : 3,      // start with this panel
		reducedSize  : 0.8,    // non-current panel size: 80% of panel size
		buildNav     : true,   // if true, navigation links will be added
		navFormatter : function(index, panel){ return panel.find('h2 span').text(); } // function which gets nav text from span inside the panel header

		// width and panelWidth options removed in v2.2.2, but still backwards compatible
		// width        : 500,    // overall width of movingBoxes (not including navigation arrows)
		// panelWidth   : 0.7,    // current panel width

	});

	// Add a slide
	var imageNumber = 0,
	// Set up demo external navigation links
	navLinks = function(){
		var i, t = '', len = $('#slider-one').getMovingBoxes().totalPanels + 1;
		for ( i = 1; i < len; i++ ) {
			t += '<a href="#">' + i + '</a> ';
		}
		$('.dlinks').find('span').html(t);
	},
	panel = '<li><img src="demo/*1.jpg" alt="picture" /><h2>News Heading #*2</h2><p>A very short exerpt goes here... <a href="#">more</a></p></li>',
	// to test adding/removing panels to the second slider, comment out the line above and uncomment out the line below - slider-two uses divs instead of UL & LIs
	// panel = '<div><img src="demo/*1.jpg" alt="picture" /><h2>News Heading #*2</h2><p>A very short exerpt goes here... <a href="#">more</a></p></div>',
	slider = $('#slider-one'); // $('#slider-two'); // second slider

	$('button.add').click(function(){
		slider
			.append( panel.replace(/\*2/g, ++imageNumber).replace(/\*1/g, (imageNumber%7 + 1)) )
			.movingBoxes(); // update movingBoxes
		navLinks(); // update go to panel links
	});

	// Remove a slide
	$('button.remove').click(function(){
		var d = slider.data('movingBoxes'),
			c = d.curPanel,
			t = d.totalPanels;
		if (t > 1) {
			slider.find('.mb-panel:not(.cloned):last').remove();
			if (c > t - 1) { c = t - 1; }
			slider.movingBoxes(); // update movingBoxes
		}
		navLinks();
	});

	navLinks();

	// Examples of how to move the panel from outside the plugin.
	// get (all 3 examples do exactly the same thing):
	//  var currentPanel = $('#slider-one').data('movingBoxes').currentPanel(); // returns # of currently selected/enlarged panel
	//  var currentPanel = $('#slider-one').data('movingBoxes').curPanel; // get the current panel number directly
	//  var currentPanel = $('#slider-one').getMovingBoxes().curPanel; // use internal function to return the object (essentially the same as the line above)

	// set (all 4 examples do exactly the same thing):
	//  var currentPanel = $('#slider-one').data('movingBoxes').currentPanel(2, function(){ alert('done!'); }); // returns and scrolls to 2nd panel
	//  var currentPanel = $('#slider-one').getMovingBoxes().currentPanel(2, function(){ alert('done!'); }); // just like the line above
	//  var currentPanel = $('#slider-one').movingBoxes(2, function(){ alert('done!'); }); // scrolls to 2nd panel, runs callback & returns 2.
	//  var currentPanel = $('#slider-one').getMovingBoxes().change(2, function(){ alert('done!'); }); // internal change function is the main function

	$('.dlinks').delegate('a', 'click', function(){
		// slider # stored in the text
		slider.movingBoxes( $(this).text() );
		return false;
	});

	// Report events to firebug console
	$('.mb-slider').bind('initialized.movingBoxes initChange.movingBoxes beforeAnimation.movingBoxes completed.movingBoxes',function(e, slider, tar){
		// show object ID + event in the firebug console
		// namespaced events: e.g. e.type = "completed", e.namespace = "movingBoxes"
		if (window.console && window.console.log){
			var txt = slider.$el[0].id + ': ' + e.type + ', now on panel #' + slider.curPanel + ', targeted panel is ' + tar;
			console.log( txt );
		}
	});

});