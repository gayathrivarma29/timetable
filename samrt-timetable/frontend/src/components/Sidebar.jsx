import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { label: 'Courses', path: '/courses' },
    { label: 'Teachers', path: '/teachers' },
    { label: 'Rooms', path: '/rooms' },
    { label: 'Classes', path: '/classes' },
    { label: 'Timetable', path: '/timetable' },
  ];

  const smartScheduleItems = [
    { label: 'Daily Plan', path: '/daily' },
    { label: 'Weekly Plan', path: '/weekly' },
    { label: 'Monthly Plan', path: '/monthly' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Toggle Button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: '#1e1e2f',
        color: '#fff',
        padding: '10px 15px',
        justifyContent: 'space-between'
      }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Menu</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            color: '#fff',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ☰
        </button>
      </div>

      {/* Sidebar Content */}
      <div
        style={{
          width: isOpen ? '220px' : '0',
          overflow: isOpen ? 'visible' : 'hidden',
          transition: 'width 0.3s ease',
          background: '#1e1e2f',
          color: '#fff',
          height: '100vh',
          padding: isOpen ? '20px' : '0',
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)'
        }}
      >
        {isOpen && (
          <>
            {/* Main Section */}
            <h2 style={{
              fontSize: '20px',
              marginBottom: '20px',
              borderBottom: '1px solid #444',
              paddingBottom: '10px'
            }}>
              Time Table
            </h2>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {navItems.map(item => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    style={{
                      textDecoration: 'none',
                      color: location.pathname === item.path ? '#4ade80' : '#ccc',
                      backgroundColor: location.pathname === item.path ? '#2d2d44' : 'transparent',
                      padding: '10px 15px',
                      borderRadius: '6px',
                      display: 'block',
                      fontWeight: '500'
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Smart Scheduling Section */}
           <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
            <h2
              style={{
                fontSize: '20px',
                marginTop: '40px',
                marginBottom: '15px',
                borderBottom: '1px solid #444',
                paddingBottom: '8px',
                cursor: 'pointer'
              }}
            >
              Smart Scheduling
            </h2>
          </Link>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {smartScheduleItems.map(item => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    style={{
                      textDecoration: 'none',
                      color: location.pathname === item.path ? '#4ade80' : '#ccc',
                      backgroundColor: location.pathname === item.path ? '#2d2d44' : 'transparent',
                      padding: '10px 15px',
                      borderRadius: '6px',
                      display: 'block',
                      fontWeight: '500'
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}



// import { Link } from 'react-router-dom';

// export default function Sidebar() {
//   return (
//     <div style={{ width: 200, padding: 10, background: '#f0f0f0' }}>
//       <h3>Navigation</h3>
//       <ul style={{ listStyle: 'none', padding: 0 }}>
//         <li><Link to="/teachers">Teachers</Link></li>
//         <li><Link to="/courses">Courses</Link></li>
//         <li><Link to="/classes">Classes</Link></li>
//         <li><Link to="/rooms">Rooms</Link></li>
//         <li><Link to="/timetable">Timetable</Link></li>
//       </ul>
//     </div>
//   );
// }
