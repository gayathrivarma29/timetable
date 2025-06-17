import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Daily Schedule',
      description: "Customize a schedule for today's activities.",
      action: () => alert('Feature not implemented yet'),
    },
    {
      title: 'Weekly Schedule',
      description: 'Make a schedule for your week by assigning tasks.',
      action: () => alert('Feature not implemented yet'),
    },
    {
      title: 'Monthly Schedule',
      description: 'Create a calendar for the present month.',
      action: () => alert('Feature not implemented yet'),
    },
    {
      title: 'Timetable',
      description: 'Generate and manage multiple classes timetables simultaneously.',
      action: () => navigate('/courses'),
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3f51b5 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '50px 20px',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          color: '#e0e7ff',
          marginBottom: '40px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Smart Timetable Generator
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          width: '100%',
          maxWidth: '1100px',
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              border: '1px solid #dbeafe',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(99, 102, 241, 0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.1)';
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#1e3a8a',
                  marginBottom: '10px',
                }}
              >
                {card.title}
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: '#334155',
                  marginBottom: '20px',
                }}
              >
                {card.description}
              </p>
            </div>
            <button
              style={{
                padding: '12px 20px',
                backgroundColor: '#3f51b5',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                alignSelf: 'flex-start',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={e => (e.target.style.backgroundColor = '#2c3eaa')}
              onMouseLeave={e => (e.target.style.backgroundColor = '#3f51b5')}
              onClick={card.action}
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


// import { useNavigate } from 'react-router-dom';

// export default function Dashboard() {
//   const navigate = useNavigate();

//   return (
//     <div style={{ padding: 40 }}>
//       <h1>Smart Scheduler</h1>
//       <div style={{ display: 'flex', gap: 20 }}>
//         <button onClick={() => alert('Feature not implemented yet')}>Daily Schedule</button>
//         <button onClick={() => alert('Feature not implemented yet')}>Weekly Schedule</button>
//         <button onClick={() => alert('Feature not implemented yet')}>Monthly Schedule</button>
//         <button onClick={() => navigate('/timetable')}>Timetable</button>
//       </div>
//     </div>
//   );
// }
