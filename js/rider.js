const riderSocket = io('http://localhost:3001', { query: 'type=rider'});
$('#requesting-trip').hide();
$('.btn-request').click(() => requestTrip($('#location-from').val(), $('#location-to').val()));

function requestTrip (from, to) {
	riderSocket.emit('requestTrip', {
		from,
		to
	}, handleEmit);
}

function handleEmit (error, data) {
	if (error) {
		alert (error)
	} else {
		alert('Requested');
		$('#request-trip').hide();
		$('#requesting-from-location').html(`From - <b>${data.from}</b>`);
		$('#requesting-to-location').html(`To - <b>${data.to}</b>`);	
		$('#requesting-trip').show();
	}
}