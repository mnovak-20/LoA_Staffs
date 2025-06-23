import { useState, useEffect } from 'react';
import logo from './assets/images/UofS_Master_Logo_RGB_Reverse.png';

const boxArtImages = import.meta.glob('./assets/images/boxart/*', { eager: true });

export default function Header() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTB9a6UtJtvvOzJdKK4dozXmyP9J1ofMn4FFjB6VNfxJ72rgFp4JlNUMhSp0jJJCk5JPYGgWklX5PuR/pub?output=csv")
      .then((res) => res.text())
      .then((csvText) => {
        const rows = csvText.split("\n").slice(1);
        const data = rows.map((row, index) => {
          const [title, imageName, studentNames, linkedins, portfolios] = row.split(",");
          const names = studentNames?.split("|") || [];
          const links = linkedins?.split("|") || [];
          const ports = portfolios?.split("|") || [];
          const students = names.map((name, i) => ({
            name: name.trim(),
            linkedin: links[i]?.trim() || "",
            portfolio: ports[i]?.trim() || ""
          }));

          const imagePath = `./assets/images/boxart/${imageName.trim()}`;
          const image = boxArtImages[imagePath]?.default || '';

          return {
            id: index,
            title,
            image,
            students
          };
        });
        setItems(data);
      });
  }, []);

  {/* Header */}
  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          backgroundColor: '#170D38',
          borderRadius: '1rem',
          height: '100px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
          boxSizing: 'border-box',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>
          <div
            style={{
              fontFamily: 'Arial Black, Gadget, sans-serif',
              color: 'white',
              fontSize: '24px',
              lineHeight: '1.2',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            List of Awesome
          </div>
          <div
            style={{
              fontFamily: 'Arial, sans-serif',
              color: '#C2BFD2',
              fontSize: '16px',
              marginTop: '4px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            Credit List for Staffordshire Games Alumni
          </div>
        </div>

        <div style={{ height: '50%', paddingLeft: '20px' }}>
          <img
            src={logo}
            alt="University of Staffordshire"
            style={{ height: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Grid of items */}

      <div
        style={{
          backgroundColor: '#170D38',
          borderRadius: '1rem',
          marginTop: '30px',
          padding: '30px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '30px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{ width: '100%', height: '260px', backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', border: '3px solid #fff' }}
            onClick={() => setSelected(item)}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      {/* PopUp */}

              {selected && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}>
            <div style={{
              backgroundColor: '#C2BFD2',
              borderRadius: '8px',
              padding: '30px',
              maxWidth: '60%',
              width: '400px',
              display: 'flex',
              gap: '20px'
            }}>
              {/* Left - student info */}
              <div style={{ flex: 1 }}>
                <h3 style={{fontFamily: 'Arial Black, Gadget, sans-serif', color: '#170D38',fontSize: '20px',}}>{selected.title}</h3>
                {selected.students.map((s, i) => (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <p style={{fontFamily: 'Arial, sans-serif', color: '#EF4A3B', fontSize: '18px'}}>{s.name}</p>
                    {s.linkedin && (
                      <a
                        href={s.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#170D38', fontSize: '16px' }}
                      >
                        LinkedIn
                      </a>
                    )}
                    <br />
                    {s.portfolio && (
                      <a
                        href={s.portfolio}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#170D38', fontSize: '16px' }}
                      >
                        Portfolio
                      </a>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    marginTop: '10px',
                    backgroundColor: '#170D38',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Close
                </button>
              </div>

              {/* Right - box art image */}
              <div style={{ flex: '0 0 150px' }}>
                <img
                  src={selected.image}
                  alt={selected.title}
                  style={{ width: '100%', borderRadius: '6px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}