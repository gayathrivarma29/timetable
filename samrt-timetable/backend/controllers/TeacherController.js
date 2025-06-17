import Teacher from "../models/Teacher.js";

// GET all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Failed to get teachers", error });
  }
};

// POST create a new teacher
export const createTeacher = async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(400).json({ message: "Failed to create teacher", error });
  }
};

// Update an existing Teacher
export const updateTeacher = async (req, res) => {
  const { id } = req.params;
  const { name , courses, maxHours,maxPerDay } = req.body;

  if (!name || !Array.isArray(courses) || maxHours==null || maxPerDay==null) {
    return res.status(400).json({ error: 'All fields (name) are required' });
  }

  try {
    const updated = await Teacher.findByIdAndUpdate(
      id,
      { name,courses,maxHours,maxPerDay},
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Teacher not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update Teacher', details: err.message });
  }
};

// DELETE a teacher
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    await Teacher.findByIdAndDelete(id);
    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete teacher", error });
  }
};
