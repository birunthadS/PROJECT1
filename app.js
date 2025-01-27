const express = require("express");
const mongoose = require("mongoose")
const app = express();
const port = 3000;

const mongourl = "mongodb+srv://Birunthadevis:Birunthadevi@cluster0.2g0crc6.mongodb.net/"
mongoose.connect(mongourl)
    .then(() => {
        console.log("Database Connected successfully")
        app.listen(port, () => {
            console.log(`Server is running at port ${port}`)
        })
    })
    .catch((err) => console.log(err))


const expenseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
});

const expenseModel = mongoose.model("expense-tracker", expenseSchema)

app.get("/api/expenses", async (req, res) => {
    try {
        const expenses = await expenseModel.find();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch expenses" });
    }

});

const { v4: uuidv4 } = require("uuid");

app.post("/api/expenses", async (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", async () => {
        try {
            const data = JSON.parse(body);
            const newExpense = new expenseModel({
                id: uuidv4(),
                title: data.title,
                amount: data.amount,
            });

            const savedExpense = await newExpense.save();
            res.status(200).json(savedExpense);
        } catch (error) {
            console.error("Error in POST endpoint:", error.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });
});


app.use(express.json());

app.put("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;
    const { title, amount } = req.body;
    console.log({ title })

    try {
        const updateExpenses = await expenseModel.findOneAndUpdate(
            { id },
            { title, amount }
        );

        if (UpdateExpenses) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({ title, amount });
    } catch (error) {
        res.status(500).json({ message: "Error in updating expense" });
    }
});


app.delete("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;
    const { title, amount } = req.body;
    console.log({ title })
    try {
        const deleteExpenses = await expenseModel.findOneAndDelete(
            { id },
            { title, amount }
        );

        if (deleteExpenses) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({ title, amount });
    } catch (error) {
        res.status(500).json({ message: "Error in deleting expense" });
    }
});