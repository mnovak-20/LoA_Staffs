import { useState, useEffect } from 'react';
// Importing images
import logo from './assets/images/UofS_Master_Logo_RGB_Reverse.png';
import logo2 from './assets/images/UofS_Master_Logo_RGB_Reverse_notext.png';
import UofS from './assets/images/UofS_Logo.svg';
import UofSDeco from './assets/images/UofS_Logo_Deco.svg';
import anniversaryLogo from './assets/images/23YoG.png';
import UofSLogo from './assets/SU.svg';







// Dynamically import box art images
const boxArtImages = import.meta.glob('./assets/images/boxart/*', { eager: true });
const staffImages = import.meta.glob('./assets/images/staff/*', { eager: true });
const studioImages = import.meta.glob('./assets/images/studio/*', { eager: true });
const gameImages = import.meta.glob('./assets/images/games/*', { eager: true });


// Main component
export default function LoA() {
  const [activeTab, setActiveTab] = useState('CREDITS');
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(false);


  // GRID CSV Mapping
const tabConfigs = {
  CREDITS: {
    csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTB9a6UtJtvvOzJdKK4dozXmyP9J1ofMn4FFjB6VNfxJ72rgFp4JlNUMhSp0jJJCk5JPYGgWklX5PuR/pub?output=csv',
    parser: (row, index) => {
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
      return { id: index, title, image, students };
    }
  },

  STUDIOS: {
    csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQsRlsFc_V0Hv9ohZaakOtm7Krzo5GVCVIlIDemtsOpmEQFtFaapcZexH3nUC7uxXPNxDQCgk0Jd5lH/pub?output=csv',
    parser: (row, index) => {
      const [studioName, imageName, website] = row.split(",");
      const imagePath = `./assets/images/studio/${imageName.trim()}`;
      const image = studioImages[imagePath]?.default || '';
      return { id: index, title: studioName, image, website };
    }
  },

  STAFF: {
    csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSo7n2hUWWcqVfztryidahUsqwbQUAp5vNO7IFfMQbGFxOzK2HYB-ojPR5ZZ7aH0JKOXQd5vIODtHLT/pub?output=csv',
    parser: (row, index) => {
      const [staffName, imageName, role] = row.split(",");
      const imagePath = `./assets/images/staff/${imageName.trim()}`;
      const image = staffImages[imagePath]?.default || '';
      return { id: index, title: staffName, image, role };
    }
  },

  GAMES: {
    csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTRcczx33xixp4uvdKmm56MuouAu2taz8boXR8fF1FWnY70MSM_NQtjWn1fh6YtDwmjEvPbazotjjec/pub?output=csv',
    parser: (row, index) => {
      const [gameName, imageName, releaseYear] = row.split(",");
      const imagePath = `./assets/images/games/${imageName.trim()}`;
      const image = gameImages[imagePath]?.default || '';
      return { id: index, title: gameName, image, releaseYear };
    }
  }
};


const tabDescriptions = {
  CREDITS: "Credit list of games worked on by University of Staffordshire alumni.",
  STUDIOS: "A showcase of studios Staffordshire alumni are employed at.",
  STAFF: "Meet the passionate staff who've contributed to the success of the games courses.",
  GAMES: "Games created by the students at University of Staffordshire. Go Play!"
};

// Dynamic grid/card styles per tab
const tabStyles = {
  CREDITS: { cardHeight: 260, minWidth: 150 },
  STUDIOS: { cardHeight: 180, minWidth: 140 },
  STAFF:   { cardHeight: 250, minWidth: 100 },
  GAMES:   { cardHeight: 300, minWidth: 250 }
};

const cardMinWidth = {
  CREDITS: 160,
  STUDIOS: 150,
  STAFF: 180,
  GAMES: 240
}[activeTab] || 200;


const { cardHeight, minWidth } = tabStyles[activeTab] || { cardHeight: 260, minWidth: 150 };


  // Fetching data from Google Sheets CSV
useEffect(() => {
  const config = tabConfigs[activeTab];
  if (!config) return;

  setLoading(true); // start loading

  fetch(config.csvUrl)
    .then((res) => res.text())
    .then((csvText) => {
      const rows = csvText.split("\n").slice(1);
      const data = rows.map(config.parser);
      setItems(data);
      setLoading(false); // done loading
    });
}, [activeTab]);


  return (
    <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

{/* Header */}
<div style={{
  backgroundColor: 'var(--UofSBlue)',
  borderRadius: '60px',
  height: '120px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 50px',
  boxSizing: 'border-box',
  width: '100%',
}}>
  {/* Left: Title and inline logo */}
  <div style={{ display: 'flex', alignItems: 'left', gap: '20px' }}>
    <div style={{
      fontFamily: 'Arial Black, Gadget, sans-serif',
      color: 'var(--UofSRed)',
      fontSize: '28px',
      whiteSpace: 'nowrap',
    }}>
      List of Awesome
    </div>
            <a
  href="https://www.staffs.ac.uk/courses/search?q=games"
  target="_blank"
  rel="noreferrer"
   > 
   <img
      src={UofS}
      alt="University of Staffordshire"
      style={{ height: '40px', objectFit: 'contain' }}
    />
    </a>
  </div>

  {/* Right: Decorative SU logo */}
  <div style={{       
      position: 'absolute',
      top: '-150px',    // Move up
      right: '0',      // Align to right
      height: '150px', // Adjust as needed
      zIndex: 0}}>
    <img src={UofSDeco} alt="Staffs Decorative Logo" style={{ height: '200%', objectFit: 'contain' }} />
  </div>
</div>

{/* Navigation Tabs */}
<div style={{
  borderRadius: '60px',
  marginTop: '20px',
  padding: '0px 40px',
  display: 'flex',
  gap: '40px',
  alignContent: 'center',
  alignSelf: 'center',
  justifyContent: 'center',  
 
}}>

{['CREDITS', 'STUDIOS', 'STAFF', 'GAMES'].map(label => (
  <div
    key={label}
    onClick={() => setActiveTab(label)}
    style={{
      backgroundColor: activeTab === label ? 'var(--UofSRed)' : 'var(--UofSBlue)',
      color: 'white',
      fontFamily: activeTab === label ? 'Arial Black, Gadget, sans-serif': 'Arial, sans-serif',
      fontSize: '14px',
      padding: '15px 50px',
      borderRadius: '30px',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      alignContent: 'center',
      alignSelf: 'center',
      justifyContent: 'center'
    }}
  >
    {label}
  </div>
))}

</div>


{/* Grid of Items */}
<div style={{
  backgroundColor: 'var(--UofSGrey)',
  borderRadius: '1rem',
  marginTop: '30px',
  padding: '30px',
  display: loading ? 'none' : 'grid', // Hide while loading
  gridTemplateColumns: `repeat(auto-fill, minmax(${cardMinWidth}px, 1fr))`,

  gap: '20px',
  width: '100%',
  boxSizing: 'border-box',
  opacity: loading ? 0 : 1,
  transition: 'opacity 0.3s ease',
  

}}>
  {items.map((item) => (
    <div
      key={item.id}
      onClick={() => setSelected(item)}
      style={{
        width: '100%',
        height: `${cardHeight}px`,
        borderRadius: '18px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.4)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.querySelector('.overlay').style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.querySelector('.overlay').style.opacity = '0';
      }}
    >
      <img
        src={item.image}
        alt={item.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Hover Overlay */}
      <div className="overlay" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        fontFamily: 'Arial Black, Gadget, sans-serif',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        textAlign: 'center',
        padding: '0px 10px',
        boxSizing: 'border-box', 
        alignContent: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',   
        whiteSpace: 'normal'
      }}>
        {item.title}
      </div>
    </div>
  ))}
</div>

{loading && (
  <div style={{ textAlign: 'center', color: '#EF4A3B', fontFamily: 'Arial Black' }}>
    Loading...
  </div>
)}

{/* Description Text Below Grid */}
<div style={{
  marginTop: '20px',
  fontFamily: 'Arial, sans-serif',
  fontSize: '18px',
  color: 'var(--UofSBlue)',
  maxWidth: '800px',
  alignContent: 'center',
  alignSelf: 'center',
  justifyContent: 'center'
}}>
  {tabDescriptions[activeTab]}
</div>


      {/* Pop-up Modal */}
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
            backgroundColor: 'var(--UofSGrey)',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '60%',
            width: '400px',
            display: 'flex',
            gap: '20px'
          }}>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontFamily: 'Arial Black, Gadget, sans-serif',
                color: '#170D38',
                fontSize: '20px'
              }}>
                {selected.title}
              </h3>
              {selected.students.map((s, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <p style={{
                    fontFamily: 'Arial, sans-serif',
                    color: '#EF4A3B',
                    fontSize: '18px'
                  }}>{s.name}</p>
                  {s.linkedin && <a href={s.linkedin} target="_blank" rel="noreferrer" style={{
                    fontFamily: 'Arial, sans-serif',
                    color: '#170D38',
                    fontSize: '16px'
                  }}>LinkedIn</a>}<br />
                  {s.portfolio && <a href={s.portfolio} target="_blank" rel="noreferrer" style={{
                    fontFamily: 'Arial, sans-serif',
                    color: '#170D38',
                    fontSize: '16px'
                  }}>Portfolio</a>}
                </div>
              ))}
              <button onClick={() => setSelected(null)} style={{
                marginTop: '10px',
                backgroundColor: '#170D38',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px'
              }}>Close</button>
            </div>
            <div style={{ flex: '0 0 150px' }}>
              <img src={selected.image} alt={selected.title} style={{
                width: '100%',
                borderRadius: '6px',
                objectFit: 'cover'
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        backgroundColor: 'var(--UofSBlue)',
        borderRadius: '40px',
        height: '80px',
        marginTop: '40px',
        padding: '0 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Left: 23 Years of Games Logo */}
        <a
  href="https://www.staffs.ac.uk/news/2023/12/heralding-20-year-of-games-the-christmas-lectures"
  target="_blank"
  rel="noreferrer"
  style={{ height: '40px', display: 'block' }}
>
  <img
    src={anniversaryLogo}
    alt="23 Years of Games"
    style={{ height: '100%', objectFit: 'contain' }}
  />
</a>

        {/* Center: URL */}
        <a
          href="https://www.staffs.ac.uk/go/games"
          target="_blank"
          rel="noreferrer"
          style={{
            fontFamily: 'Arial Black, Gadget, sans-serif',
            color: 'white',
            fontSize: '22px',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          staffs.ac.uk/go/games
        </a>

        {/* Right: SU Logo */}
        <a
  href="https://www.staffs.ac.uk/"
  target="_blank"
  rel="noreferrer"
  style={{ height: '40px', display: 'block' }}
>
  <img src={UofSLogo} alt="Staffs Decorative Logo" style={{ height: '100%', objectFit: 'contain' }} />
</a>
      </div>

    </div>
  );
}
