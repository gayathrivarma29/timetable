
import { useEffect, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await api.get('/rooms');
    setRooms(res.data);
  };

  const handleSubmit = async () => {
    if (!roomName.trim()) return alert('Please enter a room name.');
    if (editingId) {
      await api.put(`/rooms/${editingId}`, { name: roomName });
      setEditingId(null);
    } else {
      await api.post('/rooms', { name: roomName });
    }
    setRoomName('');
    fetchRooms();
  };

  const handleEdit = (room) => {
    setRoomName(room.name);
    setEditingId(room._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      await api.delete(`/rooms/${id}`);
      fetchRooms();
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
    width: '140px',
    maxWidth: '100%',
    boxShadow: '0 2px 6px rgba(165, 180, 252, 0.3)',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  };

  const buttonStyle = {
    padding: '10px 24px',
    backgroundColor: editingId ? '#10b981' : '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    boxShadow: editingId
      ? '0 6px 16px rgba(16, 185, 129, 0.5)'
      : '0 6px 16px rgba(99, 102, 241, 0.5)',
    transition: 'background-color 0.3s ease',
    height: '42px',
    marginLeft: '12px',
    whiteSpace: 'nowrap',
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
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
          Rooms
        </h2>

        {/* Form */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '40px',
            backgroundColor: '#fff',
            padding: '28px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)',
            border: '1.5px solid #c7d2fe',
          }}
        >
          <label style={labelStyle}>Room Name</label>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <input
              placeholder="Enter room"
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
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
              {editingId ? 'Update Room' : 'Add Room'}
            </button>
          </div>
        </div>

        {/* Table */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 10px',
            backgroundColor: 'transparent',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#c7d2fe', borderRadius: '10px' }}>
              <th style={thStyle}>Room</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr
                key={room._id}
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
                <td style={tdStyle}>{room.name}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(room)}
                    style={{
                      ...actionButtonStyle,
                      backgroundColor: '#818cf8',
                      marginRight: '10px',
                    }}
                    onMouseEnter={e =>
                      (e.target.style.backgroundColor = '#4f46e5')
                    }
                    onMouseLeave={e =>
                      (e.target.style.backgroundColor = '#818cf8')
                    }
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
                    style={{ ...actionButtonStyle, backgroundColor: '#f87171' }}
                    onMouseEnter={e =>
                      (e.target.style.backgroundColor = '#dc2626')
                    }
                    onMouseLeave={e =>
                      (e.target.style.backgroundColor = '#f87171')
                    }
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

// export default function RoomsPage() {
//   const [rooms, setRooms] = useState([]);
//   const [name, setName] = useState('');
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const r = await api.get('/rooms');
//     setRooms(r.data);
//     setName('');
//     setEditingId(null);
//   };

//   const handleSubmit = async () => {
//     if (!name) return alert('Please enter a room name');
//     if (editingId) {
//       await api.put(`/rooms/${editingId}`, { name });
//     } else {
//       await api.post('/rooms', { name });
//     }
//     fetchData();
//   };

//   const handleEdit = (room) => {
//     setName(room.name);
//     setEditingId(room._id);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this room?')) {
//       await api.delete(`/rooms/${id}`);
//       fetchData();
//     }
//   };

//   const labelStyle = { marginBottom: '5px', fontWeight: 'bold', color: '#000' };
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
//         <h2 style={{ marginBottom: '20px', color: '#333' }}>Rooms</h2>

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
//             <label style={labelStyle}>Room Name</label>
//             <input
//               placeholder="Enter room name"
//               value={name}
//               onChange={e => setName(e.target.value)}
//               style={inputStyle}
//             />
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
//             {editingId ? 'Update Room' : 'Add Room'}
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
//               <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
//               <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rooms.map(room => (
//               <tr key={room._id}>
//                 <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{room.name}</td>
//                 <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
//                   <button
//                     onClick={() => handleEdit(room)}
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
//                     onClick={() => handleDelete(room._id)}
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

// export default function RoomsPage() {
//   const [rooms, setRooms] = useState([]);
//   const [name, setName] = useState('');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const r = await api.get('/rooms');
//     setRooms(r.data);
//   };

//   const handleSubmit = async () => {
//     await api.post('/rooms', { name });
//     fetchData();
//   };

//   return (
//     <div style={{ display: 'flex' }}>
//       <Sidebar />
//       <div style={{ padding: 20 }}>
//         <h2>Rooms</h2>
//         <input placeholder="Room Name" onChange={e => setName(e.target.value)} />
//         <button onClick={handleSubmit}>Add Room</button>
//         <table>
//           <thead><tr><th>Name</th></tr></thead>
//           <tbody>{rooms.map(r => <tr key={r._id}><td>{r.name}</td></tr>)}</tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
