const getAllStorageSyncData = (top_key) => {
	// Immediately return a promise and start asynchronous work
	return new Promise((resolve, reject) => {
		// Asynchronously fetch all data from storage.sync.
		chrome.storage.local.get(top_key, (items) => {
			// Pass any observed errors down the promise chain.
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			// Pass the data retrieved from storage down the promise chain.
			resolve(items);
		});
	});
}

const statusRequired = async (sendResponse) => {
	const result = await getAllStorageSyncData(['refresh', 'interval', 'select']);

	sendResponse({
		action: "status",
		refresh: result.refresh !== undefined ? result.refresh : false,
		interval: result.interval !== undefined ? result.interval : 1,
		select: result.select !== undefined ? result.select : true
	});
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("Request: ", request);

	if (!request.action) return true;

	if (request.action == "status") {
		statusRequired(sendResponse);
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

	return true;
}
);
