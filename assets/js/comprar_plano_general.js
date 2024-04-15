var refresh = localStorage.getItem("refresh") === "true" ? true : false;
var interval = localStorage.getItem("interval") ? parseInt(localStorage.getItem("interval")) : 1;
var select = localStorage.getItem("select") === "true" ? true : false;

if (localStorage.getItem("refresh") === null || localStorage.getItem("interval") === null || localStorage.getItem("select") === null) {
	chrome.tabs.sendMessage(chrome.runtime.id, { action: "status" });
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

const setRefresh = (value) => {
	refresh = value;
	localStorage.setItem("refresh", value);
}

const setInterval = (value) => {
	interval = value;
	localStorage.setItem("interval", value);
}

const setSelect = (value) => {
	select = value;
	localStorage.setItem("select", value);
}

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (!request.action) return;
		if (request.action == "status") {
			setRefresh(request.refresh);
			setInterval(request.interval);
			setSelect(request.select);
			start();
		}
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
