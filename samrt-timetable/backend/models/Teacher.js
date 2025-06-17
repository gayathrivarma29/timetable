import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: String,
  courses: [String],
  maxHours: Number,
  maxPerDay: Number
});

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;


// import mongoose from 'mongoose';

// const teacherSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   courses: [{ type: String, required: true }], // course codes
//   max_hours: { type: Number, required: true },
//   max_per_day: { type: Number, required: true },
// });

// export default mongoose.model('Teacher', teacherSchema);
