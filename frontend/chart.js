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
			itemStyle: {},
		},
	],
};

function expensesChart() {
	const titles = expenses.map((expense) => expense.title);
	const amounts = expenses.map((expense) => parseFloat(expense.amount));
	const colour = {
		Utilities: "hsla(84, 83.50%, 45.30%, 0.98)",
		Groceries: "rgba(83, 62, 244, 0.831)",
		Entertainment: "rgb(236, 203, 40)",
	};
	options.xAxis.data = titles;
	options.series[0].data = expenses.map((expense) => ({
		value: parseFloat(expense.amount),
		itemStyle: {
			color: colour[expense.category],
		},
	}));

	myChart.setOption(options);
}
let myChart = echarts.init(document.getElementById("main"));

function expensesPieChart() {
	const categoryMap = {};
	const colour = {
		Utilities: "hsla(84, 83.50%, 45.30%, 0.98)",
		Groceries: "rgba(83, 62, 244, 0.831)",
		Entertainment: "rgb(236, 203, 40)",
	};

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
		title: { text: "Category Summary" },
		series: [
			{
				type: "pie",
				data: Object.entries(categoryMap).map(([category, total]) => ({
					name: category,
					value: total,
					itemStyle: {
						color: colour[category],
					},
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
		});
};
