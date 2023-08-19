
function setChart(chartId, data) {
	let ctx1 = document.getElementById(chartId).getContext('2d');
	let myChart1 = new Chart(ctx1, {
		type: 'line',
		data: {
			labels: data.labels,
			datasets: [{
				label: 'Visits',
				data: data.visits,
				backgroundColor: '#14abef',
				borderColor: "transparent",
				pointRadius: "0",
				borderWidth: 3
			}]
		},
		options: {
			maintainAspectRatio: false,
			legend: {
				display: false,
				labels: {
					fontColor: '#585757',
					boxWidth: 40
				}
			},
			tooltips: {
				displayColors: false
			},
			scales: {
				xAxes: [{
					ticks: {
						beginAtZero: true,
						fontColor: '#585757'
					},
					gridLines: {
						display: true,
						color: "rgba(0, 0, 0, .05)"
					},
				}],
				yAxes: [{
					ticks: {
						beginAtZero: true,
						fontColor: '#585757'
					},
					gridLines: {
						display: true,
						color: "rgba(0, 0, 0, .05)"
					},
				}]
			}

		}
	});
}

async function getChartData(request) {
    const response = await fetch(request, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
	if (response.ok === true && response.status === 200) {
		const data = await response.json();
		if (data) {
			return data;
		} else {
			console.log("No response");
			return null;
		}
    }
}

function getArraySum(array) {
	let sum = 0;
	for (let i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return sum;
}

function toggleChart(chartIdShow, chartIdHode) {
	document.getElementById(chartIdShow).style.display = 'block';
	document.getElementById(chartIdHode).style.display = 'none';
}

function setChartCountValues(chartData) {
	document.getElementById("allvisits").innerHTML = getArraySum(chartData.visitscount);
}

const main = async function () {
	let chart1Data = await getChartData("/User/Home?handler=Chart&isDays=true");
	let chart2Data = await getChartData("/User/Home?handler=Chart&isDays=false");

	setChart("chart1", chart1Data);
	setChart("chart2", chart2Data);

	document.getElementById("radioChart1").addEventListener("change", function () {
		toggleChart("chart1", "chart2");
		setChartCountValues(chart1Data);
	});

	document.getElementById("radioChart2").addEventListener("change", function () {
		toggleChart("chart2", "chart1");
		setChartCountValues(chart2Data);
	});

	toggleChart("chart1", "chart2");
	setChartCountValues(chart1Data);
};

main();