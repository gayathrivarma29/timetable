import { useEffect, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';

export default function TimetablePage() {
  const [classes, setClasses] = useState([]);
  const [selected, setSelected] = useState('');
  const [timetable, setTimetable] = useState({});
  const [days, setDays] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await api.get('/classes');
    setClasses(res.data);
  };

//   const generateTimetable = async () => {
//   try {
//     const response = await axios.post('http://localhost:5000/api/timetable/generate', requestData);
//     console.log('Timetable:', response.data);
//   } catch (error) {
//     console.error('ERROR\n', error);
//   }
// };


  const generateTimetable = async () => {
    const res = await api.post('/timetable/generate');
    setTimetable(res.data.timetable);
    setDays(res.data.days);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f4ff' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '30px' }}>
        <div
          style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            maxWidth: '100%',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '25px' }}>
            Timetable Generator
          </h2>

          {/* Controls */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '30px',
              alignItems: 'center',
            }}
          >
            <button
              onClick={generateTimetable}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              Generate Timetable
            </button>

            <select
              onChange={(e) => setSelected(e.target.value)}
              value={selected}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '14px',
                minWidth: '200px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <option value="">Select a Class</option>
             {Array.isArray(classes) && classes.map(c => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Timetable Table */}
          {selected && timetable[selected] && (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: '650px',
                }}
              >
                <thead>
                  <tr>
                    <th style={thStyle}>Day</th>
                    {timetable?.[selected]?.[0]?.map((_, i) => (
                      <th key={i} style={thStyle}>
                        Slot {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timetable?.[selected]?.map((row, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>{days[i]}</td>
                      {row.map((cell, j) => (
                        <td key={j} style={tdStyle}>
                          {cell ? `${cell.subject} (${cell.teacher}/${cell.room})` : 'Free'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Styles
const thStyle = {
  textAlign: 'left',
  padding: '12px',
  backgroundColor: '#eef2ff',
  borderBottom: '2px solid #c7d2fe',
  fontWeight: '600',
  color: '#333',
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '14px',
};


// import { useEffect, useState } from 'react';
// import api from '../api';
// import Sidebar from '../components/Sidebar';

// export default function TimetablePage() {
//   const [classes, setClasses] = useState([]);
//   const [selected, setSelected] = useState('');
//   const [timetable, setTimetable] = useState({});
//   const [days, setDays] = useState([]);

//   useEffect(() => {
//     fetchClasses();
//   }, []);

//   const fetchClasses = async () => {
//     const res = await api.get('/classes');
//     setClasses(res.data);
//   };

//   const generateTimetable = async () => {
//     const res = await api.get('/timetable/generate');
//     setTimetable(res.data.timetable);
//     setDays(res.data.days);
//   };

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh' }}>
//       <Sidebar />
//       <div style={{ flex: 1, padding: '20px' }}>
//         <h2 style={{ marginBottom: '20px' }}>Timetable</h2>

//         {/* Controls */}
//         <div style={{
//           display: 'flex',
//           flexWrap: 'wrap',
//           gap: '15px',
//           marginBottom: '25px',
//           alignItems: 'center'
//         }}>
//           <button
//             onClick={generateTimetable}
//             style={{
//               padding: '10px 16px',
//               backgroundColor: '#007bff',
//               color: '#fff',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer',
//               height: '40px'
//             }}
//           >
//             Generate Timetable
//           </button>

//           <select
//             onChange={e => setSelected(e.target.value)}
//             value={selected}
//             style={{
//               padding: '8px 10px',
//               border: '1px solid #ccc',
//               borderRadius: '5px',
//               width: '180px',
//               fontSize: '14px',
//               height: '38px'
//             }}
//           >
//             <option value="">Select a Class</option>
//             {classes.map(c => (
//               <option key={c._id} value={c.name}>{c.name}</option>
//             ))}
//           </select>
//         </div>

//         {/* Timetable Table */}
//         {selected && timetable[selected] && (
//           <div style={{ overflowX: 'auto' }}>
//             <table style={{
//               width: '100%',
//               borderCollapse: 'collapse',
//               minWidth: '600px'
//             }}>
//               <thead>
//                 <tr>
//                   <th style={thStyle}>Day</th>
//                   {timetable[selected][0].map((_, i) => (
//                     <th key={i} style={thStyle}>Slot {i + 1}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {timetable[selected].map((row, i) => (
//                   <tr key={i}>
//                     <td style={tdStyle}>{days[i]}</td>
//                     {row.map((cell, j) => (
//                       <td key={j} style={tdStyle}>
//                         {cell ? `${cell.subject} (${cell.teacher}/${cell.room})` : 'Free'}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Styles
// const thStyle = {
//   textAlign: 'left',
//   padding: '10px',
//   backgroundColor: '#f5f5f5',
//   borderBottom: '1px solid #ddd',
//   fontWeight: 'bold'
// };

// const tdStyle = {
//   padding: '10px',
//   borderBottom: '1px solid #eee'
// };


// import { useEffect, useState } from 'react';
// import api from '../api';
// import Sidebar from '../components/Sidebar';

// export default function TimetablePage() {
//   const [classes, setClasses] = useState([]);
//   const [selected, setSelected] = useState('');
//   const [timetable, setTimetable] = useState({});
//   const [days, setDays] = useState([]);

//   const fetchClasses = async () => {
//     const res = await api.get('/classes');
//     setClasses(res.data);
//   };

//   const generateTimetable = async () => {
//     const res = await api.get('/timetable/generate');
//     setTimetable(res.data.timetable);
//     setDays(res.data.days);
//   };

//   useEffect(() => {
//     fetchClasses();
//   }, []);

//   return (
//     <div style={{ display: 'flex' }}>
//       <Sidebar />
//       <div style={{ padding: 20 }}>
//         <h2>Timetable</h2>
//         <button onClick={generateTimetable}>Generate Timetable</button>
//         <select onChange={e => setSelected(e.target.value)}>
//           <option>Select a Class</option>
//           {classes.map(c => (
//             <option key={c._id} value={c.name}>{c.name}</option>
//           ))}
//         </select>
//         {selected && timetable[selected] && (
//           <table border="1">
//             <thead>
//               <tr><th>Day</th>{[...Array(timetable[selected][0].length)].map((_, i) => <th key={i}>Slot {i + 1}</th>)}</tr>
//             </thead>
//             <tbody>
//               {timetable[selected].map((row, i) => (
//                 <tr key={i}>
//                   <td>{days[i]}</td>
//                   {row.map((cell, j) => (
//                     <td key={j}>{cell ? `${cell.subject} (${cell.teacher}/${cell.room})` : 'Free'}</td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }
