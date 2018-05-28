const driverSocket = io('http://localhost:3001', { query: 'type=driver' });

driverSocket.on('pendingTrip', data => {
	if (data) {
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
	onCancelTrip(id);
});

function onCancelTrip (id) {
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
	onCancelTrip(id);
	addPickTrip(id);
}

function addPickTrip (item) {
	const pickingTripContainer = $('.list-picking-trip');
	pickingTripContainer.append(`
		<li class="list-group-item" id="picking-${item.id}">
			<b>${item.id}</b> - From <b>${item.from}</b> - To <b>${item.to}</b>
			<button type="button" class="btn btn-info" style="float: right" id="btn-pick" onClick="pickTrip(\'${item.id}\')">Cancel</button>
			<div class="clearfix"></div>
		</li>
	`);
}

function handleEmit (error, data) {
	if (error) {
		alert (error);
	} else {
		alert ('Succeed');
	}
}

function handlePickTrip (error, data) {
	if (error) {
		alert (error);
	} else {
		addPickTrip(data);
	}
}