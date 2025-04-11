const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const expRouter = require("./router/expenses");

app.use(cors());
app.use(express.json());

// const data = [
// 	{
// 		name: "John",
// 		place: "Sydney",
// 	},
// ];

// app.get("/", (req, res) => {
// 	res.json(data); // Respond with JSON
// });

app.use("/expenses", expRouter);

app.listen(port, () => {
	console.log(`Example app listening
at http://localhost:${port}`);
});
