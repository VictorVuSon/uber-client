const driverSocket = io('http://localhost:3000/drivers');

driverSocket.on( 'connect', (socket) => {
	console.log(socket);
	$('.loader').hide();
	$('.driver-main').show();
});

driverSocket.on( 'disconnect', () => {
	$('.driver-main').hide();
	$('.loader').show();
});

driverSocket.on('pendingTrip', data => {
	if (data) {
		const tripContainer = $('.list-trip');
		tripContainer.html = '';
		for (const item in data) {
			onReceiveTrip (data[item]);
		}
	}
});

driverSocket.on('receiveTrip', trip => {
	if (trip) {
		onReceiveTrip(trip);
	}
});

driverSocket.on('cancelTrip', id => {
	removeTrip(id);
});

function removeTrip (id) {
	$(`#${id}`).remove();
}

function onReceiveTrip (item) {
	const tripContainer = $('.list-trip');
	tripContainer.append(`
		<li class="list-group-item" id="${item.id}">
			<b>${item.id}</b> - From <b>${item.from}</b> - To <b>${item.to}</b>
			<button type="button" class="btn btn-info" style="float: right" id="btn-pick" onClick="pickTrip(\'${item.id}\')">Pick</button>
			<div class="clearfix"></div>
		</li>
	`);
}

function pickTrip (id) {
	driverSocket.emit('pickTrip', id, handlePickTrip);
	removeTrip(id);
}

function cancelTrip (id) {
	driverSocket.emit('cancelTrip', id, handleCancelTrip);
}

function addPickTrip (item) {
	const pickingTripContainer = $('.list-picking-trip');
	pickingTripContainer.append(`
		<li class="list-group-item" id="${item.id}">
			<b>${item.id}</b> - From <b>${item.from}</b> - To <b>${item.to}</b>
			<button type="button" class="btn btn-info" style="float: right" id="btn-pick" onClick="cancelTrip(\'${item.id}\')">Cancel</button>
			<div class="clearfix"></div>
		</li>
	`);
}

function handlePickTrip (error, data) {
	if (error) {
		alert (error);
	} else {
		addPickTrip(data);
	}
}

function handleCancelTrip (error, id) {
	if (!error) {
		removeTrip(id);
	}
}