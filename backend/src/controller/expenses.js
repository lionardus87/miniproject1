const {
	pushExpense,
	getAllExpenses,
	delExpense,
} = require("../service/expenses");

const addAExpense = (title, desc, amount, category) => {
	const expenses = getAllExpenses();
	const id =
		expenses.length === 0 ? 1 : Math.max(...expenses.map((exp) => exp.id)) + 1;
	if (!title) return undefined;
	const expense = {
		id,
		title,
		desc,
		amount,
		category,
		date: new Date().toLocaleString(),
		issued: false,
		paidOn: null,
	};

	pushExpense(expense);
	return expense;
};

const getExpenses = () => {
	return getAllExpenses();
};

const getExpById = (id, edit) => {
	const allExpenses = getAllExpenses();
	const index = allExpenses.findIndex((exp) => exp.id == id);
	if (index === -1) return null;
	allExpenses[index] = { ...allExpenses[index], ...edit };
	return allExpenses[index];
};
const delExpById = (id) => {
	const target = getAllExpenses().find((exp) => exp.id == id);
	if (target) {
		delExpense(id);
		return true;
	}
	return false;
};
module.exports = {
	getExpenses,
	addAExpense,
	delExpById,
	getExpById,
};
