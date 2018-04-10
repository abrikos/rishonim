function formatDate(str) {
	let date = new Date(str)
	return date.toLocaleDateString("ru-RU") + ' ' + date.toLocaleTimeString("ru-RU")
}

function showMessage(json,event) {
	let $cont = $('#popup-message');
	$cont.attr('class', 'alert alert-'+json.status).html(json.message);
	if(event)
		$cont.attr({style:`top: ${event.clientY - $cont.height()}px; left: ${event.clientX}px `});

	$cont.fadeIn(1000,function () {
		$cont.fadeOut( 5000,function () {

		})
	})
}


$( document ).ajaxStart(function() {
	$('#loading-image').show();
}).ajaxStop(function() {
	$('#loading-image').hide();
});

