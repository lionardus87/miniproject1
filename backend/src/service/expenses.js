const expenses = [];

const pushExpense = (expense) => {
	expenses.push(expense);
};

const getAllExpenses = () => {
	return expenses;
};

const delExpense = (id) => {
	const index = expenses.findIndex((expense) => expense.id == id);
	if (index != -1) {
		expenses.splice(index, 1);
		expenses.forEach((exp, index) => {
			exp.id = index + 1;
		});
		return true;
	}
	return false;
};

module.exports = {
	pushExpense,
	getAllExpenses,
	delExpense,
};
