import incomeModel from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dateFilter.js";

export async function addIncome(req, res) {
  const userId = req.user._Id;
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const newIncome = new incomeModel({
      description,
      amount,
      category,
      date: new Date(date),
      userId,
    });
    await newIncome.save();
    res
      .status(201)
      .json({ success: true, message: "Income added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getAllIncome(req, res) {
  const userId = req.user._Id;
  try {
    const income = await incomeModel.find({ userId }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function updateIncome(req, res) {
  const userId = req.user._Id;
  const { id } = req.params;
  const { description, amount } = req.body;

  try {
    const updatedIncome = await incomeModel.findOneAndUpdate(
      { _id: id, userId },
      { description, amount },
      { new: true },
    );
    if (!updatedIncome) {
      return res
        .status(404)
        .json({ success: false, message: "Income not found" });
    }
    res.json({
      success: true,
      message: "Income updated successfully",
      income: updatedIncome,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function deleteIncome(req, res) {
  try {
    const income = await incomeModel.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!income) {
      return res
        .status(404)
        .json({ success: false, message: "Income not found" });
    }
    return res.json({ success: true, message: "Income deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function downloadIncome(req, res) {
  const userId = req.user._Id;
  try {
    const income = await incomeModel.find({ userId }).sort({ date: -1 });
    const plainData = income.map((inc) => ({
      description: inc.description,
      amount: inc.amount,
      category: inc.category,
      date: new Date(inc.date).toLocaleDateString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(plainData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "incomeModel");
    XLSX.writeFile(workbook, "income.xlsx");
    res.download("income.xlsx");
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getIncomeOverView(req, res) {
  try {
    const userId = req.user._id;
    const { range = "monthly" } = req.query;
    const { start, end } = getDateRange(range);
    const incomes = await incomeModel
      .find({
        userId,
        date: {
          $gte: start,
          $lte: end,
        },
      })
      .sort({ date: -1 });
    const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
    const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
    const numberOfTransactions = incomes.length;

    const recentTransactions = incomes.slice(0, 9);

    res.json({
      success: true,
      data: {
        totalIncome,
        averageIncome,
        numberOfTransactions,
        recentTransactions,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
