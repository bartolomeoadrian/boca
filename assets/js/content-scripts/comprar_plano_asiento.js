var tryCount = 0;
var select = localStorage.getItem("select") === "true" ? true : false;

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

const notification = () => {
	setTimeout(() => {
		chrome.runtime.sendMessage({ action: "found" });
	}, 10000);
}

const book = () => {
	const btnReservar = document.querySelector("#btnReservar");
	if (btnReservar) {
		eventFire(btnReservar, 'click');
		notification()
	} else {
		tryCount++;

		if (tryCount < 50) {
			setTimeout(() => {
				reservar();
			}, 100);
		} else {
			history.back();
		}
	}
}

const start = () => {
	if (!select) return;
	const availableForBooking = available();
	if (availableForBooking) {
		eventFire(availableForBooking, 'click');
		book();
	} else {
		history.back();
	}
}

const setSelect = (value) => {
	select = value;
	localStorage.setItem("select", value);
}

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		console.log("Request: ", request);
		if (!request.action) return;
		if (request.action == "select") {
			setSelect(request.value);
		}
	}
);

console.log("Asking status...");
chrome.runtime.sendMessage({ action: "status" }, response => {
	setSelect(response.select);
	start();
});


setInterval(() => {
	const messageWrapper = document.querySelector(".message-box-wrap");
	if (messageWrapper) {
		if (messageWrapper.textContent.includes("La ubicación ya no se encuentra disponible")) {
			if (select) history.back();
		}
	}
}, 200);
