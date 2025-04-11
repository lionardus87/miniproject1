let expenses = [];

const myModal = new bootstrap.Modal(document.getElementById("expenseModal"));
let editId = null;
let totalPaid = 0;
let totalUnpaid = 0;

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

function saveExpenses() {
	const title = document.getElementById("formTitle").value;
	const desc = document.getElementById("formDesc").value;
	const amount = document.getElementById("formAmount").value;
	const category = document.getElementById("formCategory").value;

	fetch("http://localhost:3000/expenses/new", {
		method: "POST",
		body: JSON.stringify({ title, desc, amount, category }),
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((result) => result.json())
		.then((data) => {
			expenses.push(data);
			countExpenses();
		});
	// if (!title || !desc || !amount || !category) {
	// 	alert("All fields are required");
	// 	return;
	// }
	// if (editId !== null) {
	// 	const index = expenses.findIndex((exp) => exp.id === editId);
	// 	expenses[index].title = title;
	// 	expenses[index].desc = desc;
	// 	expenses[index].amount = amount;
	// 	expenses[index].category = category;
	// } else {
	// 	// Create new task
	// 	const id =
	// 		expenses.length === 0
	// 			? 1
	// 			: Math.max(...expenses.map((exp) => exp.id)) + 1;
	// 	const expense = {
	// 		id,
	// 		title,
	// 		desc,
	// 		amount,
	// 		category,
	// 		date: new Date().toLocaleString(),
	// 		issued: false,
	// 		paidOn: null,
	// 	};
	// 	expenses.push(expense);
	// }
	// localStorage.setItem("expenses", JSON.stringify(expenses));
	myModal.hide();
	countExpenses();
}

function deleteExpense(id) {
	fetch(`http://localhost:3000/expenses/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	}).then(() => {
		const index = expenses.findIndex((expense) => expense.id == id);
		if (index != -1) {
			expenses.splice(index, 1);
		}
		expenses.forEach((exp, index) => {
			exp.id = index + 1;
		});
		countExpenses();
	});
}

function paidExpense(id) {
	const targetId = expenses.findIndex((expense) => expense.id == id);
	const targetExpense = { ...expenses[targetId] };
	targetExpense.issued = !targetExpense.issued;
	targetExpense.paidOn = targetExpense.issued
		? new Date().toLocaleString()
		: null;
	expenses[targetId] = targetExpense;
	countExpenses();
}

function filterCategory() {
	const categories = document.querySelectorAll(".dropdown-item");

	categories.forEach((item) => {
		item.addEventListener("click", function () {
			const categoryValue = item.getAttribute("data-category");

			document.getElementById("searchInput").value = "";

			if (categoryValue === "allCategories") {
				countExpenses();
			} else {
				const filtered = expenses.filter(
					(expense) =>
						expense.category.toLowerCase() === categoryValue.toLowerCase()
				);
				countExpenses(filtered);
			}
		});
	});
}

function searchExpense() {
	const searchQuery = document
		.getElementById("searchInput")
		.value.toLowerCase();
	if (searchQuery === "") {
		countExpenses();
		return;
	}
	const filtered = expenses.filter((expense) => {
		const titleMatch = expense.title.toLowerCase().includes(searchQuery);
		const categoryMatch = expense.category.toLowerCase().includes(searchQuery);
		const descMatch = expense.desc.toLowerCase().includes(searchQuery);
		return titleMatch || categoryMatch || descMatch;
	});
	countExpenses(filtered);
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
	countExpenses(sortedExpenses);
}

function countExpenses(data = expenses) {
	const container = document.getElementById("expensesContainer");
	container.innerHTML = "";

	data.forEach((expense) => {
		const template = document
			.getElementById("expensesList")
			.content.cloneNode(true);

		template.getElementById("id").textContent = expense.id;
		template.getElementById("title").textContent = expense.title;
		template.getElementById("date").textContent = expense.date;
		template.getElementById("desc").textContent = expense.desc;
		template.getElementById("amount").textContent = parseFloat(
			expense.amount
		).toFixed(2);
		template.getElementById("category").textContent = expense.category;

		const checkbox = template.getElementById("paidExpense");
		checkbox.checked = expense.issued;
		checkbox.addEventListener("click", () => paidExpense(expense.id));

		template
			.getElementById("editExpense")
			.addEventListener("click", () => newExpense(expense.id));
		template
			.getElementById("delExpense")
			.addEventListener("click", () => deleteExpense(expense.id));

		container.appendChild(template);
	});
}
// countExpenses()
// filterCategory()
window.onload = () => {
	fetch("http://localhost:3000/expenses")
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			expenses = data;
			countExpenses();
			filterCategory();
		});
};

// const storedExpenses = localStorage.getItem("expenses");
// if (storedExpenses) {
// 	expenses = JSON.parse(storedExpenses);
// }
// window.addEventListener("beforeunload", () => {
// 	document.getElementById("expensesContainer").innerHTML = "";
// 	document.getElementById("paidContainer").innerHTML = "";

// 	document.getElementById("totalUnpaid").innerText = "$0.00";
// 	document.getElementById("totalPaid").innerText = "$0.00";
// });
