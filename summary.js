let expenses = [];
const storedExpenses = localStorage.getItem("expenses");
const myModal = new bootstrap.Modal(document.getElementById("expenseModal"));

if (storedExpenses) {
	expenses = JSON.parse(storedExpenses);
}

function newExpense(id = null) {
	if (id !== null) {
		const expense = expenses.find((exp) => exp.id == id);
		document.getElementById("formTitle").value = expense.title;
		document.getElementById("formDesc").value = expense.desc;
		document.getElementById("formAmount").value = expense.amount;
		document.getElementById("formCategory").value = expense.category;
		editId = id;
	} else {
		document.getElementById("formTitle").value = "";
		document.getElementById("formDesc").value = "";
		document.getElementById("formAmount").value = "";
		document.getElementById("formCategory").value = "";
		editId = null;
	}

	myModal.toggle();
}

function deleteExpense(id) {
	const index = expenses.findIndex((expense) => expense.id == id);
	if (index != -1) {
		expenses.splice(index, 1);
	}
	expenses.forEach((exp, index) => {
		exp.id = index + 1;
	});

	localStorage.setItem("expenses", JSON.stringify(expenses));
	summaryTable();
}

function paidExpense(id) {
	const targetId = expenses.findIndex((expense) => expense.id == id);
	const targetExpense = { ...expenses[targetId] };
	targetExpense.issued = !targetExpense.issued;
	targetExpense.paidOn = targetExpense.issued
		? new Date().toLocaleString()
		: null;
	expenses[targetId] = targetExpense;

	localStorage.setItem("expenses", JSON.stringify(expenses));
	summaryTable();
}

function filterCategory() {
	const categories = document.querySelectorAll(".dropdown-item");

	categories.forEach((item) => {
		item.addEventListener("click", function () {
			const categoryValue = item.getAttribute("data-category");

			document.getElementById("searchInput").value = "";

			if (categoryValue === "allCategories") {
				summaryTable();
			} else {
				const filtered = expenses.filter(
					(expense) =>
						expense.category.toLowerCase() === categoryValue.toLowerCase()
				);
				summaryTable(filtered);
			}
		});
	});
}

function searchExpense() {
	const searchQuery = document
		.getElementById("searchInput")
		.value.toLowerCase();
	if (searchQuery === "") {
		summaryTable();
		return;
	}
	const filtered = expenses.filter((expense) => {
		const titleMatch = expense.title.toLowerCase().includes(searchQuery);
		const categoryMatch = expense.category.toLowerCase().includes(searchQuery);
		const descMatch = expense.desc.toLowerCase().includes(searchQuery);
		return titleMatch || categoryMatch || descMatch;
	});
	summaryTable(filtered);
}

function sortExpenses() {
	const sortOption = document.getElementById("sortOptions").value;

	let unpaidExpenses = expenses.filter((exp) => !exp.issued);
	let paidExpenses = expenses.filter((exp) => exp.issued);

	const sortBy = (a, b) => {
		if (sortOption === "price-low-high") {
			return parseFloat(a.amount) - parseFloat(b.amount);
		} else if (sortOption === "price-high-low") {
			return parseFloat(b.amount) - parseFloat(a.amount);
		} else if (sortOption === "title-asc") {
			return a.title.localeCompare(b.title);
		} else if (sortOption === "title-desc") {
			return b.title.localeCompare(a.title);
		}
		return 0;
	};

	unpaidExpenses.sort(sortBy);
	paidExpenses.sort(sortBy);

	const sortedExpenses = [...unpaidExpenses, ...paidExpenses];
	summaryTable(sortedExpenses);
}
function summaryTable(filteredExpenses = expenses) {
	document.getElementById("expensesContainer").innerHTML = "";
	document.getElementById("paidContainer").innerHTML = "";

	let totalPaid = 0;
	let totalUnpaid = 0;

	filteredExpenses.forEach((expense) => {
		if (expense) {
			const template = document
				.getElementById("expensesList")
				.content.cloneNode(true);
			template.getElementById("id").innerText = expense.id;
			template.getElementById("title").innerHTML = expense.issued
				? `<del>${expense.title}</del>`
				: expense.title;
			template.getElementById("desc").innerHTML = expense.issued
				? `<del>${expense.desc}</del>`
				: expense.desc;
			template.getElementById("amount").innerHTML = expense.issued
				? `<del>$${expense.amount}</del>`
				: `$${expense.amount}`;
			template.getElementById("date").innerText = expense.issued
				? expense.paidOn
				: expense.date;

			template.getElementById("category").innerText = expense.category;

			//Check box
			template.getElementById("paidExpense").checked = expense.issued;
			template
				.getElementById("paidExpense")
				.addEventListener("click", () => paidExpense(expense.id));

			//delete button
			template.getElementById("delExpense").addEventListener("click", () => {
				deleteExpense(expense.id);
			});
			//update button
			template
				.querySelector("button")
				.addEventListener("click", () => newExpense(expense.id));

			if (expense.issued) {
				totalPaid += parseFloat(expense.amount);
				document.getElementById("paidContainer").appendChild(template);
			} else {
				totalUnpaid += parseFloat(expense.amount);
				document.getElementById("expensesContainer").appendChild(template);
			}
		}
		document.getElementById("totalPaid").innerText = `$${totalPaid.toFixed(2)}`;
		document.getElementById("totalUnpaid").innerText = `$${totalUnpaid.toFixed(
			2
		)}`;
	});
}

summaryTable();
filterCategory();
