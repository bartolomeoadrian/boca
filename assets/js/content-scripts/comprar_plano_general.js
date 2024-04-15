var refresh = localStorage.getItem("refresh") === "true" ? true : false;
var interval = localStorage.getItem("interval") ? parseFloat(localStorage.getItem("interval")) : 1;
var select = localStorage.getItem("select") === "true" ? true : false;

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
	console.log("Values: ", refresh, interval, select);
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

const setRefresh = (value) => {
	refresh = value;
	localStorage.setItem("refresh", value);
}

const setInterval = (value) => {
	interval = parseFloat(value);
	localStorage.setItem("interval", value);
}

const setSelect = (value) => {
	select = value;
	localStorage.setItem("select", value);
}

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		console.log("Request: ", request);
		if (!request.action) return;
		if (request.action == "refresh") {
			setRefresh(request.value);
			location.reload();
		}
		if (request.action == "interval") {
			setInterval(request.value);
		}
		if (request.action == "select") {
			setSelect(request.value);
		}
	}
);

console.log("Asking status...");
chrome.runtime.sendMessage({ action: "status" }, response => {
	setRefresh(response.refresh);
	setInterval(response.interval);
	setSelect(response.select);
	start();
});
