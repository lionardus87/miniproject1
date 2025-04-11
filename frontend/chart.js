let expenses = [];

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

function expensesPieChart() {
	const categoryMap = {};

	expenses.forEach((expense) => {
		const type = expense.category;
		const amount = parseFloat(expense.amount);
		if (categoryMap[type]) {
			categoryMap[type] += amount;
		} else {
			categoryMap[type] = amount;
		}
	});

	pieChart.setOption({
		title: { text: "Total Ammount of each category" },
		series: [
			{
				type: "pie",
				data: Object.entries(categoryMap).map(([category, total]) => ({
					name: category,
					value: total,
				})),
			},
		],
	});
}
let pieChart = echarts.init(document.getElementById("pieChart"));

window.onload = () => {
	fetch("http://localhost:3000/expenses")
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			expenses = data;
			expensesChart();
			expensesPieChart();
			filterCategory();
		});
};
