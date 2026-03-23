import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addExpanse,
  deleteExpanse,
  downloadExpanseExcel,
  getAllExpanses,
  getExpanseOverview,
  updateExpanse,
} from "../controllers/expanseController.js";

const expanseRouter = express.Router();

expanseRouter.post("/add", authMiddleware, addExpanse);
expanseRouter.get("/get", authMiddleware, getAllExpanses);
expanseRouter.put("/update/:id", authMiddleware, updateExpanse);
expanseRouter.delete("/delete/:id", authMiddleware, deleteExpanse);
expanseRouter.get("/downloadExcel", authMiddleware, downloadExpanseExcel);
expanseRouter.get("/overview", authMiddleware, getExpanseOverview);

export default expanseRouter;
