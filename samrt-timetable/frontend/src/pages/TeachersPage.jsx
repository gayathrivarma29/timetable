import { useEffect, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';

export default function TeachersPage() {
  const [teacherList, setTeacherList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    courses: [],
    maxHours: 0,
    maxPerDay: 0,
  });
  const [currentEditTeacherId, setCurrentEditTeacherId] = useState(null);

  useEffect(() => {
    fetchTeacherAndCourseData();
  }, []);

  const fetchTeacherAndCourseData = async () => {
    const teachersResponse = await api.get('/teachers');
    const coursesResponse = await api.get('/courses');
    setTeacherList(teachersResponse.data);
    setCourseList(coursesResponse.data);
  };

  const handleTeacherSubmit = async () => {
    const payload = { ...teacherForm };

    if (currentEditTeacherId) {
      await api.put(`/teachers/${currentEditTeacherId}`, payload);
      setCurrentEditTeacherId(null);
    } else {
      await api.post('/teachers', payload);
    }

    fetchTeacherAndCourseData();
    setTeacherForm({ name: '', courses: [], maxHours: 0, maxPerDay: 0 });
  };

    const populateTeacherFormForEdit = (teacher) => {
      setTeacherForm({
        name: teacher.name,
        courses: teacher.courses,
        maxHours: teacher.maxHours,
        maxPerDay: teacher.maxPerDay,
      });
      setCurrentEditTeacherId(teacher._id);
    };
   

  const deleteTeacher = async (id) => {
    await api.delete(`/teachers/${id}`);
    fetchTeacherAndCourseData();
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
          Teachers
        </h2>

        {/* Form */}
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
            <label style={labelStyle}>Teacher Name</label>
            <input
              placeholder="Enter name"
              value={teacherForm.name}
              onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
                e.target.style.boxShadow = '0 0 10px rgba(99,102,241,0.6)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#a5b4fc';
                e.target.style.boxShadow = '0 2px 6px rgba(165, 180, 252, 0.3)';
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Select Courses</label>
            <select
              multiple
              value={teacherForm.courses}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
                setTeacherForm({ ...teacherForm, courses: selected });
              }}
              style={{ ...inputStyle, height: '110px' }}
            >
              {courseList.map((c) => (
                <option key={c._id} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
             {/* <small
              style={{
                marginTop: '6px',
                fontSize: '13px',
                color: '#6366f1',
                fontWeight: '500',
                fontStyle: 'italic',
                textShadow: '0 1px 1px rgba(99, 102, 241, 0.2)',
              }}
            >
              Note: Hold <span style={{ fontWeight: '700' }}>Ctrl</span> (or <span style={{ fontWeight: '700' }}>Cmd</span> on Mac) to select multiple courses.
            </small> */}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Max Work Hours</label>
            <input
              type="number"
              placeholder="Max Hours"
              value={teacherForm.maxHours}
              onChange={(e) => setTeacherForm({ ...teacherForm, maxHours: Number(e.target.value) })}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
                e.target.style.boxShadow = '0 0 10px rgba(99,102,241,0.6)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#a5b4fc';
                e.target.style.boxShadow = '0 2px 6px rgba(165, 180, 252, 0.3)';
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Max Teaching Hours/Day</label>
            <input
              type="number"
              placeholder="Max per Day"
              value={teacherForm.maxPerDay}
              onChange={(e) => setTeacherForm({ ...teacherForm, maxPerDay: Number(e.target.value) })}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
                e.target.style.boxShadow = '0 0 10px rgba(99,102,241,0.6)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#a5b4fc';
                e.target.style.boxShadow = '0 2px 6px rgba(165, 180, 252, 0.3)';
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <button
            onClick={handleTeacherSubmit}
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
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#4f46e5')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#6366f1')}
          >
            {currentEditTeacherId ? 'Update Teacher' : 'Add Teacher'}
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#c7d2fe' , borderRadius: '10px' }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Courses</th>
              <th style={thStyle}>Max Hrs</th>
              <th style={thStyle}>Max/Day</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teacherList.map((t) => (
              <tr
                key={t._id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.12)',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eef2ff')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                <td style={tdStyle}>{t.name}</td>
                <td style={tdStyle}>
                {t.courses
                  .map(courseCode => {
                    const course = courseList.find(c => c.code === courseCode);
                    return course ? course.name : courseCode;
                  })
                  .join(', ')}
              </td>

                {/* <td style={tdStyle}>{t.courses.map(course => course.name).join(', ')}</td> */}
                <td style={tdStyle}>{t.maxHours}</td>
                <td style={tdStyle}>{t.maxPerDay}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => populateTeacherFormForEdit(t)}
                    style={{ ...buttonStyle, backgroundColor: '#818cf8', marginRight: '10px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTeacher(t._id)}
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
// import axios from 'axios';

// export default function TeachersPage() {
//   const [teacherList, setTeacherList] = useState([]);
//   const [courseList, setCourseList] = useState([]);
//   const [teacherForm, setTeacherForm] = useState({ name: '', courses: [], maxHours: 0, maxPerDay: 0 });
//   const [currentEditTeacherId, setCurrentEditTeacherId] = useState(null);

//   useEffect(() => {
//     fetchTeacherAndCourseData();
//   }, []);

//   const fetchTeacherAndCourseData = async () => {
//     const teachersResponse = await api.get('/teachers');
//     const coursesResponse = await api.get('/courses');
//     setTeacherList(teachersResponse.data);
//     setCourseList(coursesResponse.data);
//   };

//   const handleTeacherSubmit = async () => {
//     const teacherPayload = {
//       name: teacherForm.name,
//       courses: teacherForm.courses,
//       maxHours: teacherForm.max_hours,
//       maxPerDay: teacherForm.max_per_day,
//     };

//     if (currentEditTeacherId) {
//       await api.put(`/teachers/${currentEditTeacherId}`, teacherPayload);
//       setCurrentEditTeacherId(null);
//     } else {
//       await api.post('/teachers', teacherPayload);
//     }

//     fetchTeacherAndCourseData();
//     setTeacherForm({ name: '', courses: [], max_hours: 0, max_per_day: 0 });
//   };

//   const populateTeacherFormForEdit = (teacher) => {
//     setTeacherForm({
//       name: teacher.name,
//       courses: teacher.courses,
//       max_hours: teacher.max_hours,
//       max_per_day: teacher.max_per_day,
//     });
//     setCurrentEditTeacherId(teacher._id);
//   };

//   const deleteTeacher = async (id) => {
//     await api.delete(`/teachers/${id}`);
//     fetchTeacherAndCourseData();
//   };


//   // const handleSubmit = async () => {
//   //   if (editingId) {
//   //     await api.put(`/teachers/${editingId}`, form);
//   //     setEditingId(null);
//   //   } else {
//   //     await api.post('/teachers', form);
//   //   }
//   //   fetchData();
//   //   setForm({ name: '', courses: [], max_hours: 0, max_per_day: 0 });
//   // };



//   const labelStyle = {
//     fontWeight: '700',
//     marginBottom: '6px',
//     color: '#374151',
//   };

//   const inputStyle = {
//     padding: '10px',
//     borderRadius: '8px',
//     border: '2px solid #a5b4fc', // soft violet border
//     backgroundColor: '#fff',
//     color: '#1f2937',
//     fontSize: '15px',
//     boxShadow: '0 2px 6px rgba(165, 180, 252, 0.3)', // subtle violet glow
//     transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
//   };

//   return (
//     <div
//       style={{
//         display: 'flex',
//         minHeight: '100vh',
//         background:
//           '#fff', // soft blue-pink gradient
//         color: '#1f2937',
//       }}
//     >
//       <Sidebar />
//       <div style={{ padding: '32px', flex: 1 }}>
//         <h2
//           style={{
//             color: 'rgb(99, 102, 241)', // vibrant indigo
//             marginBottom: '28px',
//             textShadow: '1px 1px 2px rgba(99, 102, 241, 0.4)',
//           }}
//         >
//           Teachers
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
//             boxShadow:
//               '0 8px 24px rgba(99, 102, 241, 0.15)', // soft indigo shadow
//             border: '1.5px solid #c7d2fe',
//           }}
//         >
//           <div style={{ display: 'flex', flexDirection: 'column' }}>
//             <label style={labelStyle}>Teacher Name</label>
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
//             <label style={labelStyle}>Select Courses</label>
//             <select
//               multiple
//               value={form.courses}
//               onChange={e => {
//                 const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
//                 setForm({ ...form, courses: selected });
//               }}
//               style={{ ...inputStyle, height: '110px' }}
//             >
//               {courses.map(c => (
//                 <option
//                   value={c.code}
//                   key={c._id}
//                   style={{ backgroundColor: '#fff', color: '#1f2937' }}
//                 >
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={{ display: 'flex', flexDirection: 'column' }}>
//             <label style={labelStyle}>Max Work Hours</label>
//             <input
//               type="number"
//               placeholder="Max Hours"
//               value={form.max_hours}
//               onChange={e => setForm({ ...form, max_hours: Number(e.target.value) })}
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
//             <label style={labelStyle}>Max Teaching Hours/Day</label>
//             <input
//               type="number"
//               placeholder="Max per Day"
//               value={form.max_per_day}
//               onChange={e => setForm({ ...form, max_per_day: Number(e.target.value) })}
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
//             onClick={handleTeacherSubmit}
//             style={{
//               padding: '14px 36px',
//               backgroundColor: '#6366f1', // vibrant indigo
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
//             {editingId ? 'Update Teacher' : 'Add Teacher'}
//           </button>
//         </div>

//         {/* Teacher Table */}
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
//               <th style={thStyle}>Courses</th>
//               <th style={thStyle}>Max Hrs</th>
//               <th style={thStyle}>Max/Day</th>
//               <th style={thStyle}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {teachers.map(t => (
//               <tr
//                 key={t._id}
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
//                 <td style={tdStyle}>{t.name}</td>
//                 <td style={tdStyle}>{t.courses.join(', ')}</td>
//                 <td style={tdStyle}>{t.max_hours}</td>
//                 <td style={tdStyle}>{t.max_per_day}</td>
//                 <td style={tdStyle}>
//                   <button
//                     onClick={() => populateTeacherFormForEdit(t)}
//                     style={{ ...buttonStyle, backgroundColor: '#818cf8', marginRight: '10px' }}
//                     onMouseEnter={e => (e.target.style.backgroundColor = '#4f46e5')}
//                     onMouseLeave={e => (e.target.style.backgroundColor = '#818cf8')}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => deleteTeacher(t._id)}
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
//   color: '#4338ca', // dark indigo
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


// import { useEffect, useState } from 'react';
// import api from '../api';
// import Sidebar from '../components/Sidebar';

// export default function TeachersPage() {
//   const [teachers, setTeachers] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [form, setForm] = useState({ name: '', courses: [], max_hours: 0, max_per_day: 0 });
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const t = await api.get('/teachers');
//     const c = await api.get('/courses');
//     setTeachers(t.data);
//     setCourses(c.data);
//   };

//   const handleSubmit = async () => {
//     if (editingId) {
//       await api.put(`/teachers/${editingId}`, form);
//       setEditingId(null);
//     } else {
//       await api.post('/teachers', form);
//     }
//     fetchData();
//     setForm({ name: '', courses: [], max_hours: 0, max_per_day: 0 });
//   };

//   const handleEdit = (teacher) => {
//     setForm({
//       name: teacher.name,
//       courses: teacher.courses,
//       max_hours: teacher.max_hours,
//       max_per_day: teacher.max_per_day,
//     });
//     setEditingId(teacher._id);
//   };

//   const handleDelete = async (id) => {
//     await api.delete(`/teachers/${id}`);
//     fetchData();
//   };

//   const labelStyle = {
//     fontWeight: 'bold',
//     marginBottom: '5px',
//     height: '20px',
//     color: '#000'
//   };

//   const inputStyle = {
//     padding: '8px',
//     borderRadius: '4px',
//     border: '1px solid #ccc'
//   };

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh' }}>
//       <Sidebar />
//       <div style={{ padding: 20, flex: 1 }}>
//         <h2>Teachers</h2>

//         {/* Form */}
//         <div
//           style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//             gap: '20px',
//             marginBottom: '20px',
//           }}
//         >
//           {/* Teacher Name */}
//           <div style={{ display: 'flex', flexDirection: 'column' }}>
//             <label style={labelStyle}>Teacher Name</label>
//             <input
//               placeholder="Enter name"
//               value={form.name}
//               onChange={e => setForm({ ...form, name: e.target.value })}
//               style={{ ...inputStyle }}
//             />
//           </div>

//           {/* Select Courses */}
//           <div style={{ display: 'flex', flexDirection: 'column', minWidth: '250px' }}>
//             <label style={labelStyle}>Select Courses</label>
//             <select
//               multiple
//               value={form.courses}
//               onChange={e => {
//                 const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
//                 setForm({ ...form, courses: selected });
//               }}
//               style={{ ...inputStyle, height: '100px' }}
//             >
//               {courses.map(c => (
//                 <option value={c.code} key={c._id}>{c.name}</option>
//               ))}
//             </select>
//           </div>

//           {/* Max Hours */}
//           <div style={{ display: 'flex', flexDirection: 'column' }}>
//             <label style={labelStyle}>Max Work Hours</label>
//             <input
//               type="number"
//               placeholder="Max Hours"
//               value={form.max_hours}
//               onChange={e => setForm({ ...form, max_hours: Number(e.target.value) })}
//               style={{ ...inputStyle }}
//             />
//           </div>

//           {/* Max Per Day */}
//           <div style={{ display: 'flex', flexDirection: 'column' }}>
//             <label style={labelStyle}>Max Teaching Hours/Day</label>
//             <input
//               type="number"
//               placeholder="Max per Day"
//               value={form.max_per_day}
//               onChange={e => setForm({ ...form, max_per_day: Number(e.target.value) })}
//               style={{ ...inputStyle }}
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
//           <button
//             onClick={handleSubmit}
//             style={{
//               padding: '10px 20px',
//               backgroundColor: '#007bff',
//               color: 'white',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer'
//             }}
//           >
//             {editingId ? 'Update Teacher' : 'Add Teacher'}
//           </button>
//         </div>

//         {/* Teacher List */}
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr>
//               <th style={thStyle}>Name</th>
//               <th style={thStyle}>Courses</th>
//               <th style={thStyle}>Max Hrs</th>
//               <th style={thStyle}>Max/Day</th>
//               <th style={thStyle}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {teachers.map(t => (
//               <tr key={t._id}>
//                 <td style={tdStyle}>{t.name}</td>
//                 <td style={tdStyle}>{t.courses.join(', ')}</td>
//                 <td style={tdStyle}>{t.max_hours}</td>
//                 <td style={tdStyle}>{t.max_per_day}</td>
//                 <td style={tdStyle}>
//                   <button
//                     onClick={() => handleEdit(t)}
//                     style={{ ...buttonStyle, marginRight: '8px' }}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(t._id)}
//                     style={{ ...buttonStyle, backgroundColor: 'red' }}
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

// // Styles
// const thStyle = {
//   textAlign: 'left',
//   padding: '10px',
//   backgroundColor: '#f2f2f2',
//   borderBottom: '1px solid #ccc'
// };

// const tdStyle = {
//   padding: '10px',
//   borderBottom: '1px solid #eee'
// };

// const buttonStyle = {
//   padding: '6px 12px',
//   backgroundColor: '#28a745',
//   color: 'white',
//   border: 'none',
//   borderRadius: '4px',
//   cursor: 'pointer'
// };



// import { useEffect, useState } from 'react';
// import api from '../api';
// import Sidebar from '../components/Sidebar';

// export default function TeachersPage() {
//   const [teachers, setTeachers] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [form, setForm] = useState({ name: '', courses: [], max_hours: 0, max_per_day: 0 });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const t = await api.get('/teachers');
//     const c = await api.get('/courses');
//     setTeachers(t.data);
//     setCourses(c.data);
//   };

//   const handleSubmit = async () => {
//     await api.post('/teachers', form);
//     fetchData();
//   };

//   return (
//     <div style={{ display: 'flex' }}>
//       <Sidebar />
//       <div style={{ padding: 20 }}>
//         <h2>Teachers</h2>
//         <div>
//           <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
//           <select multiple onChange={e => {
//             const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
//             setForm({ ...form, courses: selected });
//           }}>
//             {courses.map(c => (
//               <option value={c.code} key={c._id}>{c.name}</option>
//             ))}
//           </select>
//           <input type="number" placeholder="Max Hours" onChange={e => setForm({ ...form, max_hours: Number(e.target.value) })} />
//           <input type="number" placeholder="Max per Day" onChange={e => setForm({ ...form, max_per_day: Number(e.target.value) })} />
//           <button onClick={handleSubmit}>Add Teacher</button>
//         </div>
//         <table>
//           <thead><tr><th>Name</th><th>Courses</th><th>Max Hrs</th><th>Max/Day</th></tr></thead>
//           <tbody>
//             {teachers.map(t => (
//               <tr key={t._id}>
//                 <td>{t.name}</td>
//                 <td>{t.courses.join(', ')}</td>
//                 <td>{t.max_hours}</td>
//                 <td>{t.max_per_day}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
