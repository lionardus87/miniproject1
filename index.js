const expenses = [];

const myModal = new bootstrap.Modal(document.getElementById("exampleModal"));
let editId = null;

function newExpense(id = null) {
	if (id !== null) {
		const expense = expenses.find((exp) => exp.id == id);
		document.getElementById("formTitle").value = expense.title;
		document.getElementById("formDesc").value = expense.desc;
		document.getElementById("formAmount").value = expense.amount;
		editId = id;
	} else {
		document.getElementById("formTitle").value = "";
		document.getElementById("formDesc").value = "";
		document.getElementById("formAmount").value = "";
		editId = null;
	}

	myModal.toggle();
}

function saveExpenses() {
	const title = document.getElementById("formTitle").value;
	const desc = document.getElementById("formDesc").value;
	const amount = document.getElementById("formAmount").value;
	if (!title || !desc || !amount) {
		alert("All fields are required");
		return;
	}
	if (editId !== null) {
		const index = expenses.findIndex((exp) => exp.id === editId);
		expenses[index].title = title;
		expenses[index].desc = desc;
		expenses[index].amount = amount;
	} else {
		// Create new task
		const id =
			expenses.length === 0
				? 1
				: Math.max(...expenses.map((exp) => exp.id)) + 1;
		const expense = {
			id,
			title,
			desc,
			amount,
			date: new Date().toLocaleString(),
			// isCompleted: false,
			// completedAt: null,
		};
		expenses.push(expense);
	}

	myModal.hide();
	countExpenses();
}

function deleteExpense(id) {
	const index = expenses.findIndex((expense) => expense.id == id);
	if (index != -1) {
		expenses.splice(index, 1);
	}
	expenses.forEach((exp, index) => {
		exp.id = index + 1;
	});
	countExpenses();
}

function countExpenses() {
	document.getElementById("expensesContainer").innerHTML = null;
	document.getElementById("completedContainer").innerHTML = null;
	expenses.forEach((expense) => {
		const template = document
			.getElementById("expensesList")
			.content.cloneNode(true);
		template.getElementById("id").innerText = expense.id;
		template.getElementById("title").innerText = expense.title;
		template.getElementById("desc").innerText = expense.desc;
		template.getElementById("amount").innerText = `$${expense.amount}`;
		template.getElementById("date").innerText = expense.date;

		template.getElementById("delExpense").addEventListener("click", () => {
			deleteExpense(expense.id);
		});
		document.getElementById("expensesContainer").appendChild(template);
	});
	// template
	// 	.querySelector("button")
	// 	.addEventListener("click", () => newExpense(expense.id));
}
