const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");
app.use(cors());

const data = [
	{
		name: "John",
		place: "Sydney",
	},
];

app.get("/", (req, res) => {
	res.send(data);
});

app.listen(port, () => {
	console.log(`Example app listening
at http://localhost:${port}`);
});
