let expenses = [];
const storedExpenses = localStorage.getItem("expenses");

if (storedExpenses) {
	expenses = JSON.parse(storedExpenses);
}

let options = {
	title: { text: "Expenses" },
	xAxis: {
		data: [],
	},
	yAxis: {},
	series: [
		{
			name: "Amount",
			type: "bar",
			data: [],
		},
	],
};
function expensesChart() {
	const titles = expenses.map((expense) => expense.title);
	const amounts = expenses.map((expense) => parseFloat(expense.amount));

	options.xAxis.data = titles;
	options.series[0].data = amounts;

	myChart.setOption(options);
}
let myChart = echarts.init(document.getElementById("main"));
expensesChart();
