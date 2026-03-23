import expanseModel from "../models/expanseModel.js";
import getDateRange from "../utils/dateFilter.js";
import XLSX from "xlsx";

export async function addExpanse(req, res) {
  const userId = req.user._id;
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newExpanse = new expanseModel({
      description,
      amount,
      category,
      date: new Date(date),
      userId,
    });
    await newExpanse.save();
    res
      .status(201)
      .json({ message: "Expanse added successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
}

export async function getAllExpanses(req, res) {
  const userId = req.user._id;
  try {
    const expanses = await expanseModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({ expanses, success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
}

export async function updateExpanse(req, res) {
  const userId = req.user._id;
  const { id } = req.params;
  const { description, amount } = req.body;
  try {
    const updatedExpanse = await expanseModel.findOneAndUpdate(
      { _id: id, userId },
      { description, amount },
      { new: true },
    );
    if (!updatedExpanse) {
      return res
        .status(404)
        .json({ message: "Expanse not found", success: false });
    }
    res.status(200).json({
      message: "Expanse updated successfully",
      success: true,
      data: updatedExpanse,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
}

export async function deleteExpanse(req, res) {
  try {
    const expanse = await expanseModel.findByIdAndDelete(req.params.id);
    if (!expanse) {
      return res
        .status(404)
        .json({ message: "Expanse not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Expanse deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
}

export async function downloadExpanseExcel(req, res) {
  const userId = req.user._id;
  try {
    const expanses = await expanseModel.find({ userId }).sort({ date: -1 });
    const plainData = expanses.map((exp) => ({
      description: exp.description,
      amount: exp.amount,
      category: exp.category,
      date: new Date(exp.date).toLocaleDateString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(plainData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "expanseModel");
    XLSX.writeFile(workbook, "expanses.xlsx");
    res.download("expanses.xlsx");
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
}

export async function getExpanseOverview(req, res) {
  try {
    const userId = req.user._id;
    const { range = "monthly" } = req.query;
    const { start, end } = getDateRange(range);
    const expense = await expanseModel
      .find({
        userId,
        date: { $gte: start, $lte: end },
      })
      .sort({ date: -1 });

    const totalExpense = expense.reduce((acc, cur) => acc + cur.amount, 0);
    const averageExpense =
      expense.length > 0 ? totalExpense / expense.length : 0;
    const numberOfTransactions = expense.length;
    const recentTransactions = expense.slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        totalExpense,
        averageExpense,
        numberOfTransactions,
        recentTransactions,
        range,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
}
