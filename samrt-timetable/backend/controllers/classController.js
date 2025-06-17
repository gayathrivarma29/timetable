import Class from '../models/Class.js';

// Get all classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('courses'); 
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classes', details: err.message });
  }
};


// Create a new class
export const createClass = async (req, res) => {
  const { name, courses } = req.body;

  if (!name || !Array.isArray(courses)) {
    return res.status(400).json({ error: 'Both name and courses (as an array) are required' });
  }

  try {
    const newClass = new Class({ name, courses }); 
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create class', details: err.message });
  }
};


// Update an existing class
export const updateClass = async (req, res) => {
  const { id } = req.params;
  const { name, courses } = req.body;

  if (!name || !Array.isArray(courses)) {
    return res.status(400).json({ error: 'Both name and courses (as an array) are required' });
  }

  try {
    const updated = await Class.findByIdAndUpdate(
      id,
      { name, courses },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Class not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update class', details: err.message });
  }
};

// Delete a class
export const deleteClass = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Class.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Class not found' });
    res.json({ message: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete class', details: err.message });
  }
};


// import Class from "../models/Class.js";

// // GET all Classes
// export const getAllClasses = async (req, res) => {
//   try {
//     const classes = await Class.find();
//     res.status(200).json(classes); // It's good practice to explicitly send a 200 OK
//   } catch (error) {
//     console.error("Error fetching classes:", error); // Helpful for debugging
//     res.status(500).json({ message: "Failed to get classes", error: error.message });
//   }
// };

// // POST create a new teacher
// // POST create a new class
// export const createClass = async (req, res) => {
//   const { name, courses } = req.body;

//   if (!name || !courses) {
//     return res.status(400).json({ message: "Both 'name' and 'courses' are required." });
//   }

//   try {
//     const newClass = new Class({ name, courses });
//     await newClass.save();
//     res.status(201).json(newClass);
//   } catch (error) {
//     res.status(400).json({ message: "Failed to create class", error: error.message });
//   }
// };


// // Update an existing Class
// export const updateClass = async (req, res) => {
//   const { id } = req.params;
//   const { name ,courses} = req.body;

//   if (!name || !courses ) {
//     return res.status(400).json({ error: 'All fields (name) are required' });
//   }

//   try {
//     const updated = await Class.findByIdAndUpdate(
//       id,
//       { name,courses},
//       { new: true, runValidators: true }
//     );
//     if (!updated) return res.status(404).json({ error: 'Class not found' });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to update Class', details: err.message });
//   }
// };

// // DELETE a Class
// export const deleteClass= async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Class.findByIdAndDelete(id);
//     res.json({ message: "Class deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete Class", error });
//   }
// };
