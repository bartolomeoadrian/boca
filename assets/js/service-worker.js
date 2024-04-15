chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (!request.action) return;
		if (request.action == "status") {
			(async () => {
				const [tab] = await chrome.tabs.query({ url: "https://soysocio.bocajuniors.com.ar/comprar_plano_general.php*" });
				if (tab) {
					chrome.storage.local.get(['refresh', 'interval', 'select'], function (result) {
						chrome.tabs.sendMessage(tab.id, {
							action: "status",
							refresh: result.refresh !== undefined ? result.refresh : false,
							interval: result.interval !== undefined ? result.interval : 1,
							select: result.select !== undefined ? result.select : true
						});
					});
				}
			})();
		}
		if (request.action == "found") {
			chrome.notifications.create(
				"Se encontró un lugar disponible para reservar!", {
				type: "basic",
				iconUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Boca_escudo.png",
				title: 'Socio Boca Juniors',
				message: 'Se encontró un lugar disponible para reservar!'
			});
		}
	}
);
