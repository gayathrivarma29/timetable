import express from "express";
import {
  getAllTeachers,
  createTeacher,
  deleteTeacher,
  updateTeacher,
} from "../controllers/teacherController.js";

const router = express.Router();

// GET all teachers
router.get("/", getAllTeachers);

// POST create a teacher
router.post("/", createTeacher);

//Update teacher

router.put("/:id",updateTeacher)

// DELETE a teacher
router.delete("/:id", deleteTeacher);

export default router;
