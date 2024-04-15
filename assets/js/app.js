if (localStorage.getItem("refresh") === null) localStorage.setItem("refresh", false);
if (localStorage.getItem("interval") === null) localStorage.setItem("interval", 1);
if (localStorage.getItem("select") === null) localStorage.setItem("select", true);

const autoRefreshChange = function (e) {
	localStorage.setItem("refresh", e.target.checked);
	(async () => {
		const [tab] = await chrome.tabs.query({ url: "https://soysocio.bocajuniors.com.ar/comprar_plano_general.php*" });
		if (tab) chrome.tabs.sendMessage(tab.id, { action: "refresh", value: e.target.checked });
	})();
}

const refreshIntervalChange = function (e) {
	localStorage.setItem("interval", e.currentTarget.value);
	(async () => {
		const [tab] = await chrome.tabs.query({ url: "https://soysocio.bocajuniors.com.ar/comprar_plano_general.php*" });
		if (tab) chrome.tabs.sendMessage(tab.id, { action: "interval", value: e.currentTarget.value });
	})();
}

const autoSelectChange = function (e) {
	localStorage.setItem("select", e.target.checked);
	(async () => {
		const [tab] = await chrome.tabs.query({ url: "https://soysocio.bocajuniors.com.ar/comprar_plano_general.php*" });
		if (tab) chrome.tabs.sendMessage(tab.id, { action: "select", value: e.target.checked });
	})();
}

document.addEventListener("DOMContentLoaded", function () {
	const refresh = localStorage.getItem("refresh") === "true" ? true : false;
	const interval = localStorage.getItem("interval") ? parseInt(localStorage.getItem("interval")) : 1;
	const select = localStorage.getItem("select") === "true" ? true : false;

	const autoRefreshDOM = document.querySelector("#auto-refresh");
	if (autoRefreshDOM) autoRefreshDOM.addEventListener("change", autoRefreshChange);
	if (autoRefreshDOM) autoRefreshDOM.checked = refresh;

	const refreshDOM = document.querySelector("#refresh");
	if (refreshDOM) refreshDOM.addEventListener("change", refreshIntervalChange);
	if (refreshDOM) refreshDOM.value = interval;

	const autoSelectDOM = document.querySelector("#auto-select");
	if (autoSelectDOM) autoSelectDOM.addEventListener("change", autoSelectChange);
	if (autoSelectDOM) autoSelectDOM.checked = select;
});

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (!request.action) return;
		if (request.action == "status") {
			(async () => {
				const [tab] = await chrome.tabs.query({ url: "https://soysocio.bocajuniors.com.ar/comprar_plano_general.php*" });
				if (tab) chrome.tabs.sendMessage(tab.id, {
					action: "status",
					refresh: localStorage.getItem("refresh") === "true" ? true : false,
					interval: localStorage.getItem("interval") ? parseInt(localStorage.getItem("interval")) : 1,
					select: localStorage.getItem("select") === "true" ? true : false
				});
			})();
		}
	}
);
