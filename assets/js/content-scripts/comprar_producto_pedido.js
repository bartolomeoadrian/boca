var select = localStorage.getItem("select") === "true" ? true : false;

const start = () => {
	if (!select) return;
	const plateaDOM = document.querySelector('#btnPlatea');
	if (plateaDOM) {
		plateaDOM.click();
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
chrome.runtime.sendMessage({ action: "status" }, (response) => {
	setSelect(response.select);
	start();
});
