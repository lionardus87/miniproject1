const express = require("express");
const router = express.Router();
const {
	getExpenses,
	addAExpense,
	delExpById,
	getExpById,
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
router.put("/:id", (req, res) => {
	const id = req.params.id;
	const updated = req.body;
	const editExpense = getExpById(id, updated);
	if (!editExpense) {
		return res.status(404);
	}
	res.json(editExpense);
});
module.exports = router;
