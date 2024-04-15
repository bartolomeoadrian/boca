var port = chrome.runtime.connect({ name: "boca" });

var refresh = localStorage.getItem("refresh") === "true" ? true : false;
var interval = localStorage.getItem("interval") ? parseInt(localStorage.getItem("interval")) : 1;
var select = localStorage.getItem("select") === "true" ? true : false;

if (localStorage.getItem("refresh") === null || localStorage.getItem("interval") === null || localStorage.getItem("select") === null) {
	port.postMessage({ action: "status" });
} else {
	start();
}

const available = () => {
	const divMap = document.querySelector("#divMap .enabled");
	return divMap ? divMap : false;
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
		if (select) eventFire(availableForBooking, 'click');
	} else {
		if (refresh) {
			setTimeout(() => {
				location.reload();
			}, interval * 1000);
		}
	}
}

port.onMessage.addListener(function (request) {
	if (!request.action) return;
	if (request.action == "status") {
		refresh = request.refresh;
		localStorage.setItem("refresh", refresh);
		interval = request.interval;
		localStorage.setItem("interval", interval);
		select = request.select;
		localStorage.setItem("select", select);
		start();
	}
	if (request.action == "refresh") {
		refresh = request.value;
		localStorage.setItem("refresh", refresh);
		location.reload();
	}
	if (request.action == "interval") {
		interval = request.value;
		localStorage.setItem("interval", interval);
	}
	if (request.action == "select") {
		select = request.value;
		localStorage.setItem("select", select);
	}
});
