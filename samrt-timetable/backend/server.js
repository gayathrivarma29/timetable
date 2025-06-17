import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import timetableRoutes from './routes/timetableRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import connectDB from './config/db.js';
import cors from 'cors';
import teacherRoutes from "./routes/TeacherRoutes.js";
import roomRoutes from "./routes/roomRoutes.js"
import classRoutes from "./routes/classRoutes.js"


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB(); // Connect to MongoDB

// app.get('/api/classes', (req, res) => {
//    res.json({ classes: [] });
// });

// Routes

app.use("/api/courses", courseRoutes);
app.use("/api/teachers", teacherRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/rooms',roomRoutes);
app.use('/api/classes',classRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("MongoDB connected"))
// .catch((err) => console.log(err));

// app.get("/", (req, res) => {
//   res.send("Smart Timetable Backend Running");
// });

// app.listen(process.env.PORT, () =>
//   console.log(`Server running on port ${process.env.PORT}`)
// );
