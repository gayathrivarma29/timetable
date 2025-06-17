import Course from '../models/Course.js';

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses', details: err.message });
  }
};

// Create a new course
export const createCourse = async (req, res) => {
  const { name, code, hours, type } = req.body;

  if (!name || !code || hours == null || !type) {
    return res.status(400).json({ error: 'All fields (name, code, hours, type) are required' });
  }

  try {
    const newCourse = new Course({ name, code, hours, type });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create course', details: err.message });
  }
};

// Update an existing course
export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, code, hours, type } = req.body;

  if (!name || !code || hours == null || !type) {
    return res.status(400).json({ error: 'All fields (name, code, hours, type) are required' });
  }

  try {
    const updated = await Course.findByIdAndUpdate(
      id,
      { name, code, hours, type },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Course not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course', details: err.message });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course', details: err.message });
  }
};



// import Course from '../models/Course.js';

// // GET all courses
// export const getCourses = async (req, res) => {
//   try {
//     const courses = await Course.find();
//     res.status(200).json(courses);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // POST a new course
// export const createCourse = async (req, res) => {
//   try {
//     const course = new Course(req.body);
//     await course.save();
//     res.status(201).json(course);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // PUT update a course
// export const updateCourse = async (req, res) => {
//   try {
//     const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }
//     res.status(200).json(course);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // DELETE a course
// export const deleteCourse = async (req, res) => {
//   try {
//     const course = await Course.findByIdAndDelete(req.params.id);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }
//     res.status(204).end();
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
