// import express from 'express';
// import {
//   getCourses,
//   createCourse,
//   updateCourse,
//   deleteCourse
// } from '../controllers/courseController.js';

// const router = express.Router();

// router.get('/', getCourses);
// router.post('/', createCourse);
// router.put('/:id', updateCourse);
// router.delete('/:id', deleteCourse);

// export default router;

import express from 'express';
import {
  getAllRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';

const router = express.Router();

router.get('/', getAllRoom);
router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export default router;
