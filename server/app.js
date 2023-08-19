const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

const port = 80;    

app.listen(port, () => console.log(`Listening to port ${port}`));