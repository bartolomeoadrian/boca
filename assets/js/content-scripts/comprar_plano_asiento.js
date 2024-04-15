const available = () => {
	const divSecmap = document.querySelector("#divSecmap td.d");
	return divSecmap ? divSecmap : false;
}

const eventFire = (el, etype) => {
	if (el.fireEvent) {
		el.fireEvent('on' + etype);
	} else {
		var evObj = document.createEvent('Events');
		evObj.initEvent(etype, true, false);
		el.dispatchEvent(evObj);
	}
}

const start = () => {
	const availableForBooking = available();
	if (availableForBooking) {
		eventFire(availableForBooking, 'click');
	} else {
		history.back();
	}
}

start();