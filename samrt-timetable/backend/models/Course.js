import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: String,
  code: String,
  hours: Number,
  type: String  // "theory" or "lab"
});

export default mongoose.model('Course', courseSchema);
