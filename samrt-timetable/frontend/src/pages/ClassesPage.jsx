import { useEffect, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ name: '', courses: [] });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

    const fetchData = async () => {
      try {
        const cl = await api.get('/classes');
        const co = await api.get('/courses');

        console.log('Classes response:', cl.data);
        console.log('Courses response:', co.data);

        setClasses(cl.data);
        setCourses(co.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setClasses([]);
        setCourses([]);
      }
    };



  const handleSubmit = async () => {
    if (!form.name.trim() || form.courses.length === 0) {
      return alert('Please enter class name and select at least one course.');
    }

    const payload = {
      name: form.name,
      courses: form.courses, // rename key here
    };

    console.log('Submitting payload:', payload);

    if (editingId) {
      await api.put(`/classes/${editingId}`, payload);
      setEditingId(null);
    } else {
      try{
          await api.post('/classes', payload);
          alert('Class created!');
        }catch (err) {
          alert('Error: ' + (err.response?.data?.error || err.message));
      }
    }

  setForm({ name: '', courses: [] });
  fetchData();
};


  const handleEdit = (cls) => {
    setForm({ name: cls.name, courses: cls.courses.map(c => c._id) });
    setEditingId(cls._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      await api.delete(`/classes/${id}`);
      fetchData();
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
    minWidth: '220px',
  };

  const buttonStyle = {
    padding: '14px 36px',
    backgroundColor: editingId ? '#10b981' : '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: editingId
      ? '0 6px 16px rgba(16, 185, 129, 0.5)'
      : '0 6px 16px rgba(99, 102, 241, 0.5)',
    transition: 'background-color 0.3s ease',
    width: '160px',
    justifySelf: 'center',
    marginTop: 0,
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6', // light cool gray background
        color: '#1f2937',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <Sidebar />
      <div style={{ padding: '32px', flex: 1 }}>
        <h2
          style={{
            color: 'rgb(99, 102, 241)',
            marginBottom: '28px',
            textShadow: '1px 1px 2px rgba(99, 102, 241, 0.4)',
          }}
        >
          Classes
        </h2>

        {/* Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(220px, 1fr) minmax(220px, 1fr) auto',
            gap: '28px',
            marginBottom: '40px',
            backgroundColor: '#fff',
            padding: '28px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)',
            border: '1.5px solid #c7d2fe',
            alignItems: 'center', // vertical centering
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Class Name</label>
            <input
              placeholder="Enter class name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
              onFocus={e => {
                e.target.style.borderColor = '#6366f1';
                e.target.style.boxShadow = '0 0 10px rgba(99,102,241,0.6)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#a5b4fc';
                e.target.style.boxShadow = '0 2px 6px rgba(165, 180, 252, 0.3)';
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Select Courses</label>
              <select
              multiple
              value={form.courses}
              onChange={e => {
                const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                setForm({ ...form, courses: selected });
              }}
              style={{ ...inputStyle, height: '120px', overflowY: 'auto' }}>
              {courses.map(c => (
                <option
                  key={c._id}
                  value={c._id}
                  style={{ padding: '6px 8px', fontSize: '15px' }}
                >
                  {c.name}
                </option>
              ))}
            </select>

          </div>

          <button
            onClick={handleSubmit}
            style={buttonStyle}
            onMouseEnter={e =>
              (e.target.style.backgroundColor = editingId ? '#059669' : '#4f46e5')
            }
            onMouseLeave={e =>
              (e.target.style.backgroundColor = editingId ? '#10b981' : '#6366f1')
            }
          >
            {editingId ? 'Update Class' : 'Add Class'}
          </button>
        </div>

        {/* Classes Table */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 10px',
            backgroundColor: 'transparent',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: '#c7d2fe',
                borderRadius: '10px',
              }}
            >
              <th style={thStyle}>Class</th>
              <th style={thStyle}>Courses</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(classes) && classes.map(c => (
              <tr
                key={c._id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.12)',
                  transition: 'background-color 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#eef2ff')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                <td style={tdStyle}>{c.name}</td>
                <td style={tdStyle}>{c.courses.map(co => co.name).join(', ')}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(c)}
                    style={{ ...actionButtonStyle, backgroundColor: '#818cf8', marginRight: '10px' }}
                    onMouseEnter={e => (e.target.style.backgroundColor = '#4f46e5')}
                    onMouseLeave={e => (e.target.style.backgroundColor = '#818cf8')}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    style={{ ...actionButtonStyle, backgroundColor: '#f87171' }}
                    onMouseEnter={e => (e.target.style.backgroundColor = '#dc2626')}
                    onMouseLeave={e => (e.target.style.backgroundColor = '#f87171')}
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

const actionButtonStyle = {
  padding: '7px 16px',
  borderRadius: '12px',
  border: 'none',
  color: '#fff',
  fontWeight: '600',
  fontSize: '14px',
  cursor: 'pointer',
  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
  transition: 'background-color 0.3s ease',
};




// import { useEffect, useState } from 'react';
// import api from '../api';
// import Sidebar from '../components/Sidebar';

// export default function ClassesPage() {
//   const [classes, setClasses] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [form, setForm] = useState({ name: '', courses: [] });
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const cl = await api.get('/classes');
//     const co = await api.get('/courses');
//     setClasses(cl.data);
//     setCourses(co.data);
//   };

//   const handleSubmit = async () => {
//     if (!form.name || form.courses.length === 0) {
//       return alert('Please enter class name and select at least one course.');
//     }
//     if (editingId) {
//       await api.put(`/classes/${editingId}`, form);
//     } else {
//       await api.post('/classes', form);
//     }
//     setForm({ name: '', courses: [] });
//     setEditingId(null);
//     fetchData();
//   };

//   const handleEdit = (cls) => {
//     setForm({ name: cls.name, courses: cls.courses.map(c => c._id) });
//     setEditingId(cls._id);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this class?')) {
//       await api.delete(`/classes/${id}`);
//       fetchData();
//     }
//   };

//   const labelStyle = { marginBottom: '5px', fontWeight: 'bold', color: '#000' }; // Label color changed to black
//   const inputStyle = {
//     padding: '8px',
//     borderRadius: '5px',
//     border: '1px solid #ccc',
//     width: '200px',
//   };

//   return (
//     <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
//       <Sidebar />
//       <div style={{ flex: 1, padding: '40px', backgroundColor: '#f9f9f9' }}>
//         <h2 style={{ marginBottom: '20px', color: '#333' }}>Classes</h2>

//         <div
//           style={{
//             display: 'flex',
//             flexWrap: 'wrap',
//             gap: '20px',
//             alignItems: 'center',
//             backgroundColor: '#fff',
//             padding: '20px',
//             borderRadius: '8px',
//             boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//             marginBottom: '30px',
//           }}
//         >
//           <div style={{ display: 'flex', flexDirection: 'column' }}>
//             <label style={labelStyle}>Class Name</label>
//             <input
//               placeholder="Enter class name"
//               value={form.name}
//               onChange={e => setForm({ ...form, name: e.target.value })}
//               style={inputStyle}
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
//               style={{ ...inputStyle, height: '100px' }}
//             >
//               {courses.map(c => (
//                 <option value={c._id} key={c._id}>{c.name}</option>
//               ))}
//             </select>
//           </div>

//           <button
//             onClick={handleSubmit}
//             style={{
//               marginTop: '22px',
//               padding: '10px 20px',
//               backgroundColor: editingId ? '#28a745' : '#007bff',
//               color: '#fff',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer',
//               height: '40px',
//             }}
//           >
//             {editingId ? 'Update Class' : 'Add Class'}
//           </button>
//         </div>

//         <table
//           style={{
//             width: '100%',
//             borderCollapse: 'collapse',
//             backgroundColor: '#fff',
//             borderRadius: '8px',
//             boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//             overflow: 'hidden',
//           }}
//         >
//           <thead style={{ backgroundColor: '#f0f0f0' }}>
//             <tr>
//               <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Class</th>
//               <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Courses</th>
//               <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {classes.map(c => (
//               <tr key={c._id}>
//                 <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{c.name}</td>
//                 <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
//                   {c.courses.map(co => co.name).join(', ')}
//                 </td>
//                 <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
//                   <button
//                     onClick={() => handleEdit(c)}
//                     style={{
//                       marginRight: '10px',
//                       backgroundColor: '#ffc107',
//                       border: 'none',
//                       padding: '6px 12px',
//                       color: '#fff',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(c._id)}
//                     style={{
//                       backgroundColor: '#dc3545',
//                       border: 'none',
//                       padding: '6px 12px',
//                       color: '#fff',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                     }}
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


// import { useEffect, useState } from 'react';
// import api from '../api';
// import Sidebar from '../components/Sidebar';

// export default function ClassesPage() {
//   const [classes, setClasses] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [form, setForm] = useState({ name: '', courses: [] });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const cl = await api.get('/classes');
//     const co = await api.get('/courses');
//     setClasses(cl.data);
//     setCourses(co.data);
//   };

//   const handleSubmit = async () => {
//     await api.post('/classes', form);
//     fetchData();
//   };

//   return (
//     <div style={{ display: 'flex' }}>
//       <Sidebar />
//       <div style={{ padding: 20 }}>
//         <h2>Classes</h2>
//         <input placeholder="Class Name" onChange={e => setForm({ ...form, name: e.target.value })} />
//         <select multiple onChange={e => {
//           const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
//           setForm({ ...form, courses: selected });
//         }}>
//           {courses.map(c => (
//             <option value={c._id} key={c._id}>{c.name}</option>
//           ))}
//         </select>
//         <button onClick={handleSubmit}>Add Class</button>
//         <table>
//           <thead><tr><th>Class</th><th>Courses</th></tr></thead>
//           <tbody>
//             {classes.map(c => (
//               <tr key={c._id}><td>{c.name}</td><td>{c.courses.map(co => co.name).join(', ')}</td></tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
