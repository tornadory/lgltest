module.exports = function fadeOutUi( poem ) {
	
	var hidden = false
	var active = true
	var $body = $('body')
	var $canvas = $(poem.canvas)
	var events = 'mousemove touchmove'
	
	var hideUi = _.debounce(function() {

		if( !hidden && active ) {
			hidden = true
			$body.addClass('hide-ui')
		}
	}, 1500)
	
	var showUi = function() {
		hidden = false
		$body.removeClass('hide-ui')
	}
	
	var handleInteraction = function() {
		
		if( hidden ) {
			showUi()
		}
		hideUi()
	}
	
	$body.on(events, handleInteraction)
	$canvas.on(events, handleInteraction)
	hideUi()
	
	poem.emitter.on('destroy', function() {
		active = false
		showUi()
		$body.off(events, handleInteraction)
		$canvas.off(events, handleInteraction)
	})
}