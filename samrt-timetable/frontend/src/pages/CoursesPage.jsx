import { useEffect, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';

export default function CoursesPage() {
  const [courseList, setCourseList] = useState([]);
  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    hours: '',
    type: 'theory',
  });
  const [currentEditCourseId, setCurrentEditCourseId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourseList(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleCourseSubmit = async () => {
    const { name, code, hours, type } = courseForm;

    if (!name.trim() || !code.trim() || hours === '' || !type.trim()) {
      alert('Please fill all fields');
      return;
    }

    const payload = {
      name: name.trim(),
      code: code.trim(),
      hours: Number(hours),
      type: type.trim(),
    };

    try {
      if (currentEditCourseId) {
        await api.put(`/courses/${currentEditCourseId}`, payload);
        setCurrentEditCourseId(null);
      } else {
        await api.post('/courses', payload);
      }

      setCourseForm({ name: '', code: '', hours: '', type: 'theory' });
      await fetchCourses();
    } catch (err) {
      console.error('Error submitting course:', err);
      alert('Failed to submit course. Check console for details.');
    }
  };

  const populateCourseFormForEdit = (course) => {
    setCourseForm({
      name: course.name,
      code: course.code,
      hours: course.hours,
      type: course.type,
    });
    setCurrentEditCourseId(course._id);
  };

  const deleteCourse = async (id) => {
    try {
      await api.delete(`/courses/${id}`);
      await fetchCourses();
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  const labelStyle = {
    fontWeight: '700',
    marginBottom: '6px',
    color: '#374151',
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '8px',
    border: '2px solid #a5b4fc',
    backgroundColor: '#fff',
    color: '#1f2937',
    fontSize: '15px',
    boxShadow: '0 2px 6px rgba(165, 180, 252, 0.3)',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff', color: '#1f2937' }}>
      <Sidebar />
      <div style={{ padding: '32px', flex: 1 }}>
        <h2 style={{ color: 'rgb(99, 102, 241)', marginBottom: '28px', textShadow: '1px 1px 2px rgba(99, 102, 241, 0.4)' }}>
          Courses
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '28px',
            marginBottom: '40px',
            backgroundColor: '#fff',
            padding: '28px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)',
            border: '1.5px solid #c7d2fe',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Course Name</label>
            <input
              placeholder="Enter name"
              value={courseForm.name}
              onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Course Code</label>
            <input
              placeholder="Enter code"
              value={courseForm.code}
              onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Hours</label>
            <input
              type="number"
              placeholder="Enter hours"
              value={courseForm.hours}
              onChange={(e) => setCourseForm({ ...courseForm, hours: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Type</label>
            <select
              value={courseForm.type}
              onChange={(e) => setCourseForm({ ...courseForm, type: e.target.value })}
              style={inputStyle}
            >
              <option value="theory">Theory</option>
              <option value="lab">Lab</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <button
            onClick={handleCourseSubmit}
            style={{
              padding: '14px 36px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(99, 102, 241, 0.5)',
            }}
          >
            {currentEditCourseId ? 'Update Course' : 'Add Course'}
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#c7d2fe', borderRadius: '10px' }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Code</th>
              <th style={thStyle}>Hours</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courseList.map((course) => (
              <tr
                key={course._id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.12)',
                }}
              >
                <td style={tdStyle}>{course.name}</td>
                <td style={tdStyle}>{course.code}</td>
                <td style={tdStyle}>{course.hours}</td>
                <td style={tdStyle}>{course.type}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => populateCourseFormForEdit(course)}
                    style={{ ...buttonStyle, backgroundColor: '#818cf8', marginRight: '10px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCourse(course._id)}
                    style={{ ...buttonStyle, backgroundColor: '#f87171' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '16px 18px',
  fontWeight: '700',
  color: '#4338ca',
   userSelect: 'none',
  borderTopLeftRadius: '10px',
  borderTopRightRadius: '10px',
};

const tdStyle = {
  padding: '16px 18px',
  color: '#334155',
  fontSize: '15px',
};

const buttonStyle = {
  padding: '7px 16px',
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  transition: 'background-color 0.3s ease',
};



// import { useEffect, useState } from 'react';
// import api from '../api';
// import Sidebar from '../components/Sidebar';

// export default function CoursesPage() {
//   const [courseList, setCourseList] = useState([]);
//   const [courseForm, setCourseForm] = useState({
//     name: '',
//     code: '',
//     hours: 0,
//   });
//   const [currentEditCourseId, setCurrentEditCourseId] = useState(null);

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     const response = await api.get('/courses');
//     setCourseList(response.data);
//   };

//   const handleCourseSubmit = async () => {
//     const payload = { ...courseForm };

//     if (currentEditCourseId) {
//       await api.put(`/courses/${currentEditCourseId}`, payload);
//       setCurrentEditCourseId(null);
//     } else {
//       await api.post('/courses', payload);
//     }

//     setCourseForm({ name: '', code: '', hours: 0 });
//     fetchCourses();
//   };

//   const populateCourseFormForEdit = (course) => {
//     setCourseForm({
//       name: course.name,
//       code: course.code,
//       hours: course.hours,
//     });
//     setCurrentEditCourseId(course._id);
//   };

//   const deleteCourse = async (id) => {
//     await api.delete(`/courses/${id}`);
//     fetchCourses();
//   };

//   const labelStyle = {
//     fontWeight: '700',
//     marginBottom: '6px',
//     color: '#374151',
//   };

//   const inputStyle = {
//     padding: '10px',
//     borderRadius: '8px',
//     border: '2px solid #a5b4fc',
//     backgroundColor: '#fff',
//     color: '#1f2937',
//     fontSize: '15px',
//     boxShadow: '0 2px 6px rgba(165, 180, 252, 0.3)',
//     transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
//   };

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', background: '#fff', color: '#1f2937' }}>
//       <Sidebar />
//       <div style={{ padding: '32px', flex: 1 }}>
//         <h2 style={{ color: 'rgb(99, 102, 241)', marginBottom: '28px', textShadow: '1px 1px 2px rgba(99, 102, 241, 0.4)' }}>
//           Courses
//         </h2>

//         {/* Form Section */}
//         <div
//           style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
//             gap: '28px',
//             marginBottom: '40px',
//             backgroundColor: '#fff',
//             padding: '28px',
//             borderRadius: '16px',
//             boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)',
//             border: '1.5px solid #c7d2fe',
//           }}
//         >
//           <div style={{ display: 'flex', flexDirection: 'column' }}>
//             <label style={labelStyle}>Course Name</label>
//             <input
//               placeholder="Enter name"
//               value={courseForm.name}
//               onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
//               style={inputStyle}
//             />
//           </div>

//           <div style={{ display: 'flex', flexDirection: 'column' }}>
//             <label style={labelStyle}>Course Code</label>
//             <input
//               placeholder="Enter code"
//               value={courseForm.code}
//               onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
//               style={inputStyle}
//             />
//           </div>

//           <div style={{ display: 'flex', flexDirection: 'column' }}>
//             <label style={labelStyle}>Hours</label>
//             <input
//               type="number"
//               placeholder="Enter hours"
//               value={courseForm.hours}
//               onChange={(e) => setCourseForm({ ...courseForm, hours: Number(e.target.value) })}
//               style={inputStyle}
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
//           <button
//             onClick={handleCourseSubmit}
//             style={{
//               padding: '14px 36px',
//               backgroundColor: '#6366f1',
//               color: 'white',
//               border: 'none',
//               borderRadius: '12px',
//               fontWeight: '700',
//               fontSize: '16px',
//               cursor: 'pointer',
//               boxShadow: '0 6px 16px rgba(99, 102, 241, 0.5)',
//             }}
//           >
//             {currentEditCourseId ? 'Update Course' : 'Add Course'}
//           </button>
//         </div>

//         {/* Table */}
//         <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
//           <thead>
//             <tr style={{ backgroundColor: '#c7d2fe', borderRadius: '10px' }}>
//               <th style={thStyle}>Name</th>
//               <th style={thStyle}>Code</th>
//               <th style={thStyle}>Hours</th>
//               <th style={thStyle}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {courseList.map((course) => (
//               <tr
//                 key={course._id}
//                 style={{
//                   backgroundColor: '#ffffff',
//                   borderRadius: '12px',
//                   boxShadow: '0 4px 12px rgba(99, 102, 241, 0.12)',
//                 }}
//               >
//                 <td style={tdStyle}>{course.name}</td>
//                 <td style={tdStyle}>{course.code}</td>
//                 <td style={tdStyle}>{course.hours}</td>
//                 <td style={tdStyle}>
//                   <button
//                     onClick={() => populateCourseFormForEdit(course)}
//                     style={{ ...buttonStyle, backgroundColor: '#818cf8', marginRight: '10px' }}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => deleteCourse(course._id)}
//                     style={{ ...buttonStyle, backgroundColor: '#f87171' }}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// const thStyle = {
//   textAlign: 'left',
//   padding: '16px 18px',
//   fontWeight: '700',
//   color: '#4338ca',
//   userSelect: 'none',
// };

// const tdStyle = {
//   padding: '16px 18px',
//   color: '#334155',
//   fontSize: '15px',
// };

// const buttonStyle = {
//   padding: '7px 16px',
//   border: 'none',
//   borderRadius: '8px',
//   color: '#fff',
//   cursor: 'pointer',
//   fontWeight: '600',
//   fontSize: '14px',
//   transition: 'background-color 0.3s ease',
// };


// import { useEffect, useState } from 'react';
// import api from '../api';
// import Sidebar from '../components/Sidebar';
// import axios from 'axios';


// export default function CoursesPage() {
//   const [courses, setCourses] = useState([]);
//   const [form, setForm] = useState({ name: '', code: '', hours: 0 });
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//     const response = await axios.get('http://localhost:5000/api/courses');
//     setCourses(response.data);
//   } catch (error) {
//     console.error('ERROR\n', error);
//   }
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await api.post('/courses', {
//       name: courseName,
//       code: courseCode,
//       hours: courseHours,
//     });
//     console.log('Course added:', response.data);
//   } catch (error) {
//     console.error('Error adding course:', error);
//   }
// };

//   // const handleSubmit = async () => {
//   //   if (editingId) {
//   //     await api.put(`/courses/${editingId}`, form);
//   //     setEditingId(null);
//   //   } else {
//   //     await api.post('/courses', form);
//   //   }
//   //   fetchCourses();
//   //   setForm({ name: '', code: '', hours: 0 });
//   // };

//   const handleEdit = (course) => {
//     setForm({ name: course.name, code: course.code, hours: course.hours });
//     setEditingId(course._id);
//   };

//   const handleDelete = async (id) => {
//     await api.delete(`/courses/${id}`);
//     fetchCourses();
//   };

//   const labelStyle = {
//     fontWeight: '700',
//     marginBottom: '6px',
//     color: '#374151',
//   };

//   const inputStyle = {
//     padding: '10px',
//     borderRadius: '8px',
//     border: '2px solid #a5b4fc',
//     backgroundColor: '#fff',
//     color: '#1f2937',
//     fontSize: '15px',
//     boxShadow: '0 2px 6px rgba(165, 180, 252, 0.3)',
//     transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
//   };

//   return (
//     <div
//       style={{
//         display: 'flex',
//         minHeight: '100vh',
//         background: '#fff',
//         color: '#1f2937',
//       }}
//     >
//       <Sidebar />
//       <div style={{ padding: '32px', flex: 1 }}>
//         <h2
//           style={{
//             color: 'rgb(99, 102, 241)',
//             marginBottom: '28px',
//             textShadow: '1px 1px 2px rgba(99, 102, 241, 0.4)',
//           }}
//         >
//           Courses
//         </h2>

//         {/* Form */}
//         <div
//           style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
//             gap: '28px',
//             marginBottom: '40px',
//             backgroundColor: '#fff',
//             padding: '28px',
//             borderRadius: '16px',
//             boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)',
//             border: '1.5px solid #c7d2fe',
//           }}
//         >
//           <div style={{ display: 'flex', flexDirection: 'column' }}>
//             <label style={labelStyle}>Course Name</label>
//             <input
//               placeholder="Enter name"
//               value={form.name}
//               onChange={e => setForm({ ...form, name: e.target.value })}
//               style={inputStyle}
//               onFocus={e => {
//                 e.target.style.borderColor = '#6366f1';
//                 e.target.style.boxShadow = '0 0 10px rgba(99,102,241,0.6)';
//               }}
//               onBlur={e => {
//                 e.target.style.borderColor = '#a5b4fc';
//                 e.target.style.boxShadow = '0 2px 6px rgba(165, 180, 252, 0.3)';
//               }}
//             />
//           </div>

//           <div style={{ display: 'flex', flexDirection: 'column' }}>
//             <label style={labelStyle}>Course Code</label>
//             <input
//               placeholder="Enter code"
//               value={form.code}
//               onChange={e => setForm({ ...form, code: e.target.value })}
//               style={inputStyle}
//               onFocus={e => {
//                 e.target.style.borderColor = '#6366f1';
//                 e.target.style.boxShadow = '0 0 10px rgba(99,102,241,0.6)';
//               }}
//               onBlur={e => {
//                 e.target.style.borderColor = '#a5b4fc';
//                 e.target.style.boxShadow = '0 2px 6px rgba(165, 180, 252, 0.3)';
//               }}
//             />
//           </div>

//           <div style={{ display: 'flex', flexDirection: 'column' }}>
//             <label style={labelStyle}>Hours</label>
//             <input
//               type="number"
//               placeholder="Enter hours"
//               value={form.hours}
//               onChange={e => setForm({ ...form, hours: Number(e.target.value) })}
//               style={inputStyle}
//               onFocus={e => {
//                 e.target.style.borderColor = '#6366f1';
//                 e.target.style.boxShadow = '0 0 10px rgba(99,102,241,0.6)';
//               }}
//               onBlur={e => {
//                 e.target.style.borderColor = '#a5b4fc';
//                 e.target.style.boxShadow = '0 2px 6px rgba(165, 180, 252, 0.3)';
//               }}
//             />
//           </div>
//         </div>

//         <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
//           <button
//             onClick={handleSubmit}
//             style={{
//               padding: '14px 36px',
//               backgroundColor: '#6366f1',
//               color: 'white',
//               border: 'none',
//               borderRadius: '12px',
//               fontWeight: '700',
//               fontSize: '16px',
//               cursor: 'pointer',
//               boxShadow: '0 6px 16px rgba(99, 102, 241, 0.5)',
//               transition: 'background-color 0.3s ease',
//             }}
//             onMouseEnter={e => (e.target.style.backgroundColor = '#4f46e5')}
//             onMouseLeave={e => (e.target.style.backgroundColor = '#6366f1')}
//           >
//             {editingId ? 'Update Course' : 'Add Course'}
//           </button>
//         </div>

//         {/* Course Table */}
//         <table
//           style={{
//             width: '100%',
//             borderCollapse: 'separate',
//             borderSpacing: '0 10px',
//             backgroundColor: 'transparent',
//           }}
//         >
//           <thead>
//             <tr style={{ backgroundColor: '#c7d2fe', borderRadius: '10px' }}>
//               <th style={thStyle}>Name</th>
//               <th style={thStyle}>Code</th>
//               <th style={thStyle}>Hours</th>
//               <th style={thStyle}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {courses.map(c => (
//               <tr
//                 key={c._id}
//                 style={{
//                   backgroundColor: '#ffffff',
//                   borderRadius: '12px',
//                   boxShadow: '0 4px 12px rgba(99, 102, 241, 0.12)',
//                   transition: 'background-color 0.3s ease',
//                   cursor: 'default',
//                 }}
//                 onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#eef2ff')}
//                 onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
//               >
//                 <td style={tdStyle}>{c.name}</td>
//                 <td style={tdStyle}>{c.code}</td>
//                 <td style={tdStyle}>{c.hours}</td>
//                 <td style={tdStyle}>
//                   <button
//                     onClick={() => handleEdit(c)}
//                     style={{ ...buttonStyle, backgroundColor: '#818cf8', marginRight: '10px' }}
//                     onMouseEnter={e => (e.target.style.backgroundColor = '#4f46e5')}
//                     onMouseLeave={e => (e.target.style.backgroundColor = '#818cf8')}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(c._id)}
//                     style={{ ...buttonStyle, backgroundColor: '#f87171' }}
//                     onMouseEnter={e => (e.target.style.backgroundColor = '#dc2626')}
//                     onMouseLeave={e => (e.target.style.backgroundColor = '#f87171')}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// const thStyle = {
//   textAlign: 'left',
//   padding: '16px 18px',
//   fontWeight: '700',
//   color: '#4338ca',
//   userSelect: 'none',
//   borderTopLeftRadius: '10px',
//   borderTopRightRadius: '10px',
// };

// const tdStyle = {
//   padding: '16px 18px',
//   color: '#334155',
//   fontSize: '15px',
// };

// const buttonStyle = {
//   padding: '7px 16px',
//   border: 'none',
//   borderRadius: '8px',
//   color: '#fff',
//   cursor: 'pointer',
//   fontWeight: '600',
//   fontSize: '14px',
//   transition: 'background-color 0.3s ease',
// };


//RAW
// import { useEffect, useState } from 'react';
// import api from '../api';
// import Sidebar from '../components/Sidebar';

// export default function CoursesPage() {
//   const [courses, setCourses] = useState([]);
//   const [form, setForm] = useState({ name: '', code: '', hours: 0, type: 'theory' });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const res = await api.get('/courses');
//     setCourses(res.data);
//   };

//   const handleSubmit = async () => {
//     await api.post('/courses', form);
//     fetchData();
//   };

//   return (
//     <div style={{ display: 'flex' }}>
//       <Sidebar />
//       <div style={{ padding: 20 }}>
//         <h2>Courses</h2>
//         <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
//         <input placeholder="Code" onChange={e => setForm({ ...form, code: e.target.value })} />
//         <input type="number" placeholder="Hours" onChange={e => setForm({ ...form, hours: Number(e.target.value) })} />
//         <select onChange={e => setForm({ ...form, type: e.target.value })}>
//           <option value="theory">Theory</option>
//           <option value="lab">Lab</option>
//         </select>
//         <button onClick={handleSubmit}>Add Course</button>
//         <table>
//           <thead><tr><th>Name</th><th>Code</th><th>Hours</th><th>Type</th></tr></thead>
//           <tbody>
//             {courses.map(c => (
//               <tr key={c._id}><td>{c.name}</td><td>{c.code}</td><td>{c.hours}</td><td>{c.type}</td></tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
