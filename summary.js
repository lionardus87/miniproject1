fetch("http://localhost:5500/api/expenses")
	.then((res) => res.json())
	.then((data) => {
		console.log("Fetched expenses:", data);
		// render them into the table
	});
console.log(expenses);
