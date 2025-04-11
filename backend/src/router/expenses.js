const express = require("express");
const router = express.Router();
const {
	getExpenses,
	addAExpense,
	delExpById,
} = require("../controller/expenses");

router.get("/", (req, res) => {
	res.send(getExpenses());
});

router.post("/new", (req, res) => {
	const { title, desc, amount, category } = req.body;
	const expense = addAExpense(title, desc, amount, category);
	if (!expense) res.send(403);
	res.send(expense);
});

router.delete("/:id", (req, res) => {
	const { id } = req.params;
	if (delExpById(id)) {
		res.send(204);
	} else {
		res.send(403);
	}
});

module.exports = router;
