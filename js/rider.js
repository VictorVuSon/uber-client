const riderSocket = io('http://localhost:3000/riders');

riderSocket.on('connect', () => {
	$('.loader').hide();
	$('.rider-main').show();
});

riderSocket.on('disconnect', () => {
	$('.rider-main').hide();
	$('.loader').show();
});

riderSocket.on('cancelTrip', (data) => {
    $('#requesting-trip h3').html(`<b>${data.driverId}</b> cancel the trip`);
    $('#requesting-trip img').attr("src","images/failed.png");
});

riderSocket.on('havePicked', (data) => {
    $('#requesting-trip h3').html(`<b>${data.driverId}</b> is coming you`);
    $('#requesting-trip img').attr("src","images/success.png");
});

$('#requesting-trip').hide();
$('.btn-request').click(() => requestTrip($('#location-from').val(), $('#location-to').val()));
$('.btn-cancel-trip').click(() => cancelTrip());

function requestTrip (from, to) {
	riderSocket.emit('requestTrip', {
		from,
		to
	}, handleRequest);
}

function cancelTrip () {
	riderSocket.emit('cancelTrip', null, handleCancelTrip);
}

function handleRequest (error, data) {
	if (error) {
		alert (error)
	} else {
		$('#request-trip').hide();
		$('#requesting-trip h3').html(`<b>${data.from}</b> - <b>${data.to}</b>: Waiting for driver`);
		$('#requesting-trip').show();
        $('#requesting-trip img').attr("src","images/loading.gif");
	}
}

function handleCancelTrip (error, data) {
	if (!error) {
        $('#requesting-trip h3').text('Request your trip');
        $('#requesting-trip').hide();
        $('#request-trip').show();
	}
}