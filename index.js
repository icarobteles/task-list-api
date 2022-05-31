import dotenv from "dotenv";
import connectToDatabase from "./src/database/connect.js";
import app from "./src/routes/index.js";

dotenv.config();
connectToDatabase();

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Rodando com Express na Porta ${port}!`));
