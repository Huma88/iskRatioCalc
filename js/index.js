




function calculate() {
	var wallet = document.getElementById("walletEntries").value;
	var regexp = /(\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}:\d{2})\D+([\d|\.]+)/g;
	entries = [];

	while ((match = regexp.exec(wallet)) != null) {
		entries.push(match);
		console.log(match);
	}
	if (entries.length == 0) {
		console.log("asd");
		$('#inputError').modal();
		return;
	}
	var aux;
	var end;
	var start;
	var isks;
	var period;
	var totalTime = 0;
	var totalISKs = 0;
	for (var i = 0; i < entries.length - 1; i++) {
		aux = entries[i][1].replace(" ", "T");
		aux = entries[i][1].replace(/\./g, "-");
		end = new Date(aux + "Z");

		aux = entries[i + 1][1].replace(" ", "T");
		aux = entries[i + 1][1].replace(/\./g, "-");
		start = new Date(aux + "Z");
		isks = entries[i][2].replace(/\./g, "");
		period = end.getTime() - start.getTime();
		totalTime += period;
		isks = parseFloat(isks);
		totalISKs += isks;
	}
	//the one which start time is unkown, the time will me the avg of the others
	totalTime += period / (entries.length - 1);
	isks = entries[entries.length - 1][2].replace(/\./g, "");
	totalISKs += parseFloat(isks);
	ratioMIN = totalISKs / (totalTime / 1000 / 60);

	console.log(totalTime, totalISKs);

	var results = document.getElementById("ratios");
	while (results.firstChild) {
		results.removeChild(results.firstChild);
	}
	var timeInterval = document.createElement("div");
	var timeIntervalText = document.createElement("h3");
	var totalMinutes = totalTime / 1000 / 60;
	totalMinutes = totalMinutes > 59 ? totalMinutes > 3600 ? Math.round(totalMinutes / 3600) + " Days" : Math.round(totalMinutes / 60) + " Hours" : Math.round(totalMinutes) + " Minutes";
	timeIntervalText.appendChild(document.createTextNode(nFormatter(totalISKs, 2) + " ISK - " + totalMinutes));
	timeInterval.appendChild(timeIntervalText);
	results.appendChild(timeInterval);

	var minutes = document.createElement("div");
	var ratio = document.createElement("h3");
	ratio.appendChild(document.createTextNode(nFormatter(totalISKs / (totalTime / 1000 / 60), 2) + " ISK/Minute"));
	minutes.appendChild(ratio);
	results.appendChild(minutes);

	hours = document.createElement("div");
	ratio = document.createElement("h3");
	ratio.appendChild(document.createTextNode(nFormatter(totalISKs / (totalTime / 1000 / 60 / 60), 2) + " ISK/Hour"));
	hours.appendChild(ratio);
	results.appendChild(hours);

	day = document.createElement("div");
	ratio = document.createElement("h3");
	ratio.appendChild(document.createTextNode(nFormatter(totalISKs / (totalTime / 1000 / 60 / 60 / 24), 2) + " ISK/Day"));
	day.appendChild(ratio);
	results.appendChild(day);
}

function nFormatter(num, digits) {
	var si = [
		{ value: 1, symbol: "" },
		{ value: 1E3, symbol: "k" },
		{ value: 1E6, symbol: "M" },
		{ value: 1E9, symbol: "B" }
	];
	var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	var i;
	for (i = si.length - 1; i > 0; i--) {
		if (num >= si[i].value) {
			break;
		}
	}
	return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}
