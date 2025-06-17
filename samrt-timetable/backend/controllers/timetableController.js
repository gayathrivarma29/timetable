

// Better
import Teacher from '../models/Teacher.js';
import Course from '../models/Course.js';
import Class from '../models/Class.js';
import Room from '../models/Room.js';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const SLOTS_PER_DAY = 7;

// Shuffle utility
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const generateTimetable = async (req, res) => {
  try {
    console.log("Timetable generation started...");

    const allClasses = await Class.find().populate('courses');
    const allTeachers = await Teacher.find();
    const allRooms = await Room.find();

    const timetable = {};
    const teacherAvailability = {};
    const roomAvailability = {};

    // Initialize timetable and availability matrices
    for (const cls of allClasses) {
      timetable[cls.name] = Array.from({ length: DAYS.length }, () =>
        Array(SLOTS_PER_DAY).fill(null)
      );
    }

    for (const teacher of allTeachers) {
      teacherAvailability[teacher.name] = Array.from({ length: DAYS.length }, () =>
        Array(SLOTS_PER_DAY).fill(false)
      );
    }

    for (const room of allRooms) {
      roomAvailability[room.name] = Array.from({ length: DAYS.length }, () =>
        Array(SLOTS_PER_DAY).fill(false)
      );
    }

    // Store subject-day history to avoid same subject on adjacent days
    const subjectDayHistory = {};

    // Schedule for each class
    for (const cls of allClasses) {
      const courses = await Course.find({ _id: { $in: cls.courses } });
      const sortedCourses = shuffle(courses.sort((a, b) => b.hours - a.hours)); // Shuffle + prioritize long courses

      for (const course of sortedCourses) {
        const suitableTeachers = shuffle(allTeachers.filter(t => t.courses.includes(course.code)));
        let hoursNeeded = course.hours;

        subjectDayHistory[cls.name] = subjectDayHistory[cls.name] || {};

        const dayIndexes = shuffle([...Array(DAYS.length).keys()]);
        for (const day of dayIndexes) {
          // Constraint: No repeat in row
          if (timetable[cls.name][day].some(s => s?.subject === course.name)) continue;

          // Constraint: Not on consecutive days
          const prevDay = day - 1, nextDay = day + 1;
          if (
            (subjectDayHistory[cls.name][prevDay] === course.name) ||
            (subjectDayHistory[cls.name][nextDay] === course.name)
          ) continue;

          const slotIndexes = shuffle([...Array(SLOTS_PER_DAY).keys()]);
          for (const slot of slotIndexes) {
            if (hoursNeeded <= 0 || timetable[cls.name][day][slot]) continue;

            for (const teacher of suitableTeachers) {
              const teacherSlots = teacherAvailability[teacher.name][day];
              const usedToday = teacherSlots.filter(Boolean).length;
              if (teacherSlots[slot] || teacher.max_hours <= 0 || usedToday >= teacher.max_per_day) continue;

              const rooms = shuffle([...allRooms]);

              for (const room of rooms) {
                if (roomAvailability[room.name][day][slot]) continue;

                if (course.type === 'lab') {
                  if (
                    slot + 1 >= SLOTS_PER_DAY ||
                    timetable[cls.name][day][slot + 1] ||
                    teacherSlots[slot + 1] ||
                    roomAvailability[room.name][day][slot + 1]
                  ) continue;

                  // Assign lab (2 consecutive)
                  timetable[cls.name][day][slot] = {
                    subject: course.name,
                    teacher: teacher.name,
                    room: room.name,
                    type: 'lab'
                  };
                  timetable[cls.name][day][slot + 1] = {
                    subject: course.name,
                    teacher: teacher.name,
                    room: room.name,
                    type: 'lab'
                  };
                  teacherAvailability[teacher.name][day][slot] = true;
                  teacherAvailability[teacher.name][day][slot + 1] = true;
                  roomAvailability[room.name][day][slot] = true;
                  roomAvailability[room.name][day][slot + 1] = true;
                  teacher.max_hours -= 2;
                  hoursNeeded -= 2;
                  subjectDayHistory[cls.name][day] = course.name;
                } else {
                  // Assign theory
                  timetable[cls.name][day][slot] = {
                    subject: course.name,
                    teacher: teacher.name,
                    room: room.name,
                    type: 'theory'
                  };
                  teacherAvailability[teacher.name][day][slot] = true;
                  roomAvailability[room.name][day][slot] = true;
                  teacher.max_hours -= 1;
                  hoursNeeded -= 1;
                  subjectDayHistory[cls.name][day] = course.name;
                }

                break; // room
              }

              if (hoursNeeded <= 0) break; // teacher
            }

            if (hoursNeeded <= 0) break; // slot
          }

          if (hoursNeeded <= 0) break; // day
        }

        if (hoursNeeded > 0) {
          console.warn(` Could not fully schedule "${course.name}" (${course.hours} hrs) for class "${cls.name}". Remaining: ${hoursNeeded}`);
        }
      }
    }

    res.json({ message: 'Timetable generated successfully', timetable, days: DAYS });
  } catch (err) {
    console.error(" Timetable generation failed:", err);
    res.status(500).json({ error: "Timetable generation failed" });
  }
};


//MORE RANDOMIZATION
// import Teacher from '../models/Teacher.js';
// import Course from '../models/Course.js';
// import Class from '../models/Class.js';
// import Room from '../models/Room.js';

// const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
// const SLOTS_PER_DAY = 7;

// // Utility function to shuffle arrays
// const shuffle = (array) => {
//   const result = [...array];
//   for (let i = result.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [result[i], result[j]] = [result[j], result[i]];
//   }
//   return result;
// };

// export const generateTimetable = async (req, res) => {
//   try {
//     console.log("Timetable generation function triggered");

//     const allClasses = await Class.find();
//     const allTeachers = await Teacher.find();
//     const allRooms = await Room.find();

//     const timetable = {};
//     const teacherAvailability = {};
//     const roomAvailability = {};

//     // Initialize timetable and availability
//     for (const cls of allClasses) {
//       timetable[cls.name] = Array.from({ length: DAYS.length }, () =>
//         Array(SLOTS_PER_DAY).fill(null)
//       );
//     }

//     for (const teacher of allTeachers) {
//       teacherAvailability[teacher.name] = Array.from({ length: DAYS.length }, () =>
//         Array(SLOTS_PER_DAY).fill(false)
//       );
//     }

//     for (const room of allRooms) {
//       roomAvailability[room.name] = Array.from({ length: DAYS.length }, () =>
//         Array(SLOTS_PER_DAY).fill(false)
//       );
//     }

//     // Schedule courses for each class
//     for (const cls of allClasses) {
//       const courses = await Course.find({ _id: { $in: cls.courses } });
//       const sortedCourses = courses.sort((a, b) => b.hours - a.hours); // Prioritize longer courses

//       for (const course of sortedCourses) {
//         const suitableTeachers = allTeachers.filter(t =>
//           t.courses.includes(course.code)
//         );

//         let hoursNeeded = course.hours;

//         const shuffledDays = shuffle([...Array(DAYS.length).keys()]);

//         for (const day of shuffledDays) {
//           // 🚫 Skip if subject already in the day's row for the class
//           const subjectExistsInRow = timetable[cls.name][day].some(
//             (entry) => entry && entry.subject === course.name
//           );
//           if (subjectExistsInRow) continue;

//           const shuffledSlots = shuffle([...Array(SLOTS_PER_DAY).keys()]);

//           for (const slot of shuffledSlots) {
//             if (hoursNeeded <= 0 || timetable[cls.name][day][slot]) continue;

//             for (const teacher of suitableTeachers) {
//               if (teacherAvailability[teacher.name][day][slot]) continue;

//               const usedToday = teacherAvailability[teacher.name][day].filter(Boolean).length;
//               if (teacher.max_hours <= 0 || usedToday >= teacher.max_per_day) continue;

//               const shuffledRooms = shuffle([...allRooms]);

//               for (const room of shuffledRooms) {
//                 if (roomAvailability[room.name][day][slot]) continue;

//                 // LAB handling: needs 2 consecutive slots
//                 if (course.type === 'lab') {
//                   if (
//                     slot + 1 >= SLOTS_PER_DAY ||
//                     timetable[cls.name][day][slot + 1] ||
//                     teacherAvailability[teacher.name][day][slot + 1] ||
//                     roomAvailability[room.name][day][slot + 1]
//                   ) continue;

//                   // Assign lab session
//                   timetable[cls.name][day][slot] = {
//                     subject: course.name,
//                     teacher: teacher.name,
//                     room: room.name,
//                     type: 'lab'
//                   };
//                   timetable[cls.name][day][slot + 1] = {
//                     subject: course.name,
//                     teacher: teacher.name,
//                     room: room.name,
//                     type: 'lab'
//                   };
//                   teacherAvailability[teacher.name][day][slot] = true;
//                   teacherAvailability[teacher.name][day][slot + 1] = true;
//                   roomAvailability[room.name][day][slot] = true;
//                   roomAvailability[room.name][day][slot + 1] = true;
//                   teacher.max_hours -= 2;
//                   hoursNeeded -= 2;
//                 } else {
//                   // Assign theory session
//                   timetable[cls.name][day][slot] = {
//                     subject: course.name,
//                     teacher: teacher.name,
//                     room: room.name,
//                     type: 'theory'
//                   };
//                   teacherAvailability[teacher.name][day][slot] = true;
//                   roomAvailability[room.name][day][slot] = true;
//                   teacher.max_hours -= 1;
//                   hoursNeeded -= 1;
//                 }

//                 break;
//               }

//               if (hoursNeeded <= 0) break;
//             }

//             if (hoursNeeded <= 0) break;
//           }

//           if (hoursNeeded <= 0) break;
//         }

//         if (hoursNeeded > 0) {
//           console.warn(
//             `Could not fully schedule "${course.name}" (${course.hours} hrs) for class "${cls.name}". Remaining: ${hoursNeeded}`
//           );
//         }
//       }
//     }

//     res.json({ message: 'Timetable generated successfully', timetable, days: DAYS });
//   } catch (err) {
//     console.error("Timetable generation failed:", err);
//     res.status(500).json({ error: "Timetable generation failed" });
//   }
// };

//NO SAME SUBJECT CONSECUTIVELY IN ROW
// import Teacher from '../models/Teacher.js';
// import Course from '../models/Course.js';
// import Class from '../models/Class.js';
// import Room from '../models/Room.js';

// const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
// const SLOTS_PER_DAY = 7;

// // Helper to shuffle arrays
// function shuffle(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }

// export const generateTimetable = async (req, res) => {
//   try {
//     const allClasses = await Class.find();
//     const allTeachers = await Teacher.find();
//     const allRooms = await Room.find();

//     const timetable = {};
//     const teacherAvailability = {};
//     const roomAvailability = {};

//     for (const cls of allClasses) {
//       timetable[cls.name] = Array.from({ length: DAYS.length }, () => Array(SLOTS_PER_DAY).fill(null));
//     }

//     for (const teacher of allTeachers) {
//       teacherAvailability[teacher.name] = Array.from({ length: DAYS.length }, () => Array(SLOTS_PER_DAY).fill(false));
//     }

//     for (const room of allRooms) {
//       roomAvailability[room.name] = Array.from({ length: DAYS.length }, () => Array(SLOTS_PER_DAY).fill(false));
//     }

//     for (const cls of allClasses) {
//       const courses = await Course.find({ _id: { $in: cls.courses } });

//       for (const course of courses) {
//         const suitableTeachers = shuffle(allTeachers.filter(t => t.courses.includes(course.code)));
//         let hoursNeeded = course.hours;

//         const shuffledDays = shuffle([...Array(DAYS.length).keys()]);

//         for (const day of shuffledDays) {
//           const shuffledSlots = shuffle([...Array(SLOTS_PER_DAY).keys()]);

//           for (const slot of shuffledSlots) {
//             if (hoursNeeded <= 0 || timetable[cls.name][day][slot]) continue;

//             for (const teacher of suitableTeachers) {
//               if (teacherAvailability[teacher.name][day][slot]) continue;

//               const shuffledRooms = shuffle([...allRooms]);

//               for (const room of shuffledRooms) {
//                 if (roomAvailability[room.name][day][slot]) continue;

//                 if (course.type === 'lab') {
//                   if (slot + 1 >= SLOTS_PER_DAY) continue;
//                   if (
//                     timetable[cls.name][day][slot + 1] ||
//                     teacherAvailability[teacher.name][day][slot + 1] ||
//                     roomAvailability[room.name][day][slot + 1]
//                   ) continue;

//                   timetable[cls.name][day][slot] = {
//                     subject: course.name,
//                     teacher: teacher.name,
//                     room: room.name,
//                     type: 'lab'
//                   };
//                   timetable[cls.name][day][slot + 1] = {
//                     subject: course.name,
//                     teacher: teacher.name,
//                     room: room.name,
//                     type: 'lab'
//                   };
//                   teacherAvailability[teacher.name][day][slot] = true;
//                   teacherAvailability[teacher.name][day][slot + 1] = true;
//                   roomAvailability[room.name][day][slot] = true;
//                   roomAvailability[room.name][day][slot + 1] = true;
//                   hoursNeeded -= 2;
//                 } else {
//                   timetable[cls.name][day][slot] = {
//                     subject: course.name,
//                     teacher: teacher.name,
//                     room: room.name,
//                     type: 'theory'
//                   };
//                   teacherAvailability[teacher.name][day][slot] = true;
//                   roomAvailability[room.name][day][slot] = true;
//                   hoursNeeded -= 1;
//                 }

//                 break;
//               }

//               if (hoursNeeded <= 0) break;
//             }
//           }
//         }

//         if (hoursNeeded > 0) {
//           console.warn(`Could not fully schedule ${course.name} for ${cls.name}. Remaining hours: ${hoursNeeded}`);
//         }
//       }
//     }

//     res.json({ message: 'Timetable generated successfully', timetable, days: DAYS });
//   } catch (err) {
//     console.error("Timetable generation failed:", err);
//     res.status(500).json({ error: "Timetable generation failed" });
//   }
// };


// // controllers/timetableController.js

// import Teacher from '../models/Teacher.js';
// import Course from '../models/Course.js';
// import Class from '../models/Class.js';
// import Room from '../models/Room.js';

// const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
// const SLOTS_PER_DAY = 4;

// export const generateTimetable = async (req, res) => {
//   try {

//     console.log(" Timetable generation function triggered");
//     const classes = await Class.find(); 
//     const teachers = await Teacher.find();
//     const rooms = await Room.find();

//     const teacherAvailability = {};
//     const roomAvailability = {};
//     const timetable = {};

//     for (const cls of classes) {
//       timetable[cls.name] = Array.from({ length: DAYS.length }, () =>
//         Array(SLOTS_PER_DAY).fill(null)
//       );
//     }

//     for (const teacher of teachers) {
//       teacherAvailability[teacher.name] = Array.from({ length: DAYS.length }, () =>
//         Array(SLOTS_PER_DAY).fill(false)
//       );
//     }

//     for (const room of rooms) {
//       roomAvailability[room.name] = Array.from({ length: DAYS.length }, () =>
//         Array(SLOTS_PER_DAY).fill(false)
//       );
//     }

//     for (const cls of classes) {
//       for (const courseId of cls.courses) {
//         const course = await Course.findById(courseId);
//         const suitableTeachers = teachers.filter(t => t.courses.includes(course.code));

//         for (let h = 0; h < course.hours; ) {
//           const day = Math.floor(Math.random() * DAYS.length);
//           const slot = Math.floor(Math.random() * SLOTS_PER_DAY);

//           if (timetable[cls.name][day][slot]) continue;

//           for (const teacher of suitableTeachers) {
//             if (
//               !teacherAvailability[teacher.name][day][slot] &&
//               teacher.max_hours > 0 &&
//               teacher.max_per_day > teacherAvailability[teacher.name][day].filter(Boolean).length
//             ) {
//               for (const room of rooms) {
//                 if (!roomAvailability[room.name][day][slot]) {
//                   timetable[cls.name][day][slot] = {
//                     subject: course.name,
//                     teacher: teacher.name,
//                     room: room.name,
//                   };
//                   teacherAvailability[teacher.name][day][slot] = true;
//                   teacher.max_hours--;
//                   roomAvailability[room.name][day][slot] = true;
//                   h++;
//                   break;
//                 }
//               }
//               break;
//             }
//           }
//         }
//       }
//     }

//    res.json({ message: "Timetable generated successfully", timetable, days: DAYS });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Timetable generation failed" });
//   }
// };

