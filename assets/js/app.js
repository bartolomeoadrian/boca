chrome.storage.local.get(['refresh', 'interval', 'select'], function (result) {
	if (result.refresh === undefined) chrome.storage.local.set({ refresh: false });
	if (result.interval === undefined) chrome.storage.local.set({ interval: 1 });
	if (result.select === undefined) chrome.storage.local.set({ select: true });
});

const autoRefreshChange = function (e) {
	chrome.storage.local.set({ refresh: e.target.checked });
	(async () => {
		const [tab] = await chrome.tabs.query({ url: "https://soysocio.bocajuniors.com.ar/comprar_plano_general.php*" });
		if (tab) chrome.tabs.sendMessage(tab.id, { action: "refresh", value: e.target.checked });
	})();
}

const refreshIntervalChange = function (e) {
	chrome.storage.local.set({ interval: e.target.value });
	(async () => {
		const [tab] = await chrome.tabs.query({ url: "https://soysocio.bocajuniors.com.ar/comprar_plano_general.php*" });
		if (tab) chrome.tabs.sendMessage(tab.id, { action: "interval", value: e.target.value });
	})();
}

const autoSelectChange = function (e) {
	chrome.storage.local.set({ select: e.target.checked });
	(async () => {
		const [tab] = await chrome.tabs.query({ url: "https://soysocio.bocajuniors.com.ar/comprar_plano_general.php*" });
		if (tab) chrome.tabs.sendMessage(tab.id, { action: "select", value: e.target.checked });
	})();
}

document.addEventListener("DOMContentLoaded", function () {
	chrome.storage.local.get(['refresh', 'interval', 'select'], function (result) {
		const refresh = result.refresh === undefined ? false : result.refresh;
		const interval = result.interval === undefined ? 1 : result.interval;
		const select = result.select === undefined ? true : result.select;

		const autoRefreshDOM = document.querySelector("#auto-refresh");
		if (autoRefreshDOM) autoRefreshDOM.addEventListener("change", autoRefreshChange);
		if (autoRefreshDOM) autoRefreshDOM.checked = refresh;

		const refreshDOM = document.querySelector("#refresh");
		if (refreshDOM) refreshDOM.addEventListener("input", refreshIntervalChange);
		if (refreshDOM) refreshDOM.value = interval;

		const autoSelectDOM = document.querySelector("#auto-select");
		if (autoSelectDOM) autoSelectDOM.addEventListener("change", autoSelectChange);
		if (autoSelectDOM) autoSelectDOM.checked = select;
	});
});