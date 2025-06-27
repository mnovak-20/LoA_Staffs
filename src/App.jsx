import { useState, useEffect } from 'react';
// Importing images
import logo from './assets/images/UofS_Master_Logo_RGB_Reverse.png';
import logo2 from './assets/images/UofS_Master_Logo_RGB_Reverse_notext.png';
import UofSLight from './assets/images/UofS_Logo_Light.svg';
import UofSDark from './assets/images/UofS_Logo_dark.svg';
import UofSDeco from './assets/images/UofS_Logo_Deco.svg';
import anniversaryLogo from './assets/images/23YoG.png';
import UofSLogo from './assets/SU.svg';
import lightModeIcon from './assets/lightmode.svg';
import darkModeIcon from './assets/darkmode.svg';



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

  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  useEffect(() => {
    document.body.className = theme === 'light' ? '' : 'light';
  }, [theme]);

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
      const [staffName, imageName, level, role, department, specialism, linkedin, research, portfolio  ] = row.split(",");
      const imagePath = `./assets/images/staff/${imageName.trim()}`;
      const image = staffImages[imagePath]?.default || '';
      return { id: index, title: staffName, image, level, role, department, specialism, linkedin, research, portfolio};
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
  backgroundColor: 'var(--bg-light)',
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
    <div
  className="doto-title"
  style={{
    color: 'var(--UofSRed)',
    fontSize: '36px',
    whiteSpace: 'nowrap'
  }}
>
  List of Awesome
</div>
            <a
  href="https://www.staffs.ac.uk/courses/search?q=games"
  target="_blank"
  rel="noreferrer"
   > 
   <img
      src={theme === 'light' ? UofSLight : UofSDark}
      alt="University of Staffordshire"
      style={{ 
        height: '40px', 
        objectFit: 'contain'}}
    />
    </a>
  </div>

  {/* Right: Decorative SU logo 
  <div style={{       
      position: 'absolute',
      top: '-150px',    // Move up
      right: '0',      // Align to right
      height: '150px', // Adjust as needed
      zIndex: 0}}>
    <img src={UofSDeco} alt="Staffs Decorative Logo" style={{ 
      height: '200%'}} />
  </div>*/}
</div>

{/* Navigation Tabs */}
<div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
  <img
    src={theme === 'light' ?   lightModeIcon : darkModeIcon}
    alt="Toggle light/dark mode"
    onClick={toggleTheme}
    style={{
      cursor: 'pointer',
      width: '40px',
      height: '40px',
      marginRight: '10px',
      marginTop: '20px',
      transition: 'filter 0.3s',

    }}
    tabIndex={0}
    role="button"
    aria-label="Toggle light/dark mode"
    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleTheme(); }}
  />
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
        className={activeTab === label ? 'doto-heavy' : 'doto-light'}
        style={{
          backgroundColor: activeTab === label ? 'var(--UofSRed)' : 'transparent',
          color: 'var(--text-button)',
          fontSize: '20px',
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
</div>


{/* Grid of Items */}
<div style={{
  borderRadius: '1rem',
  marginTop: '20px',
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
  <div className="doto-title"
  style={{ padding: ('80px') ,textAlign: 'center', color: 'var(--UofSRed)', 
  fontSize: '40px' }}>
    LOADING...
  </div>
)}

{/* Description Text Below Grid */}
<div style={{
  marginTop: '20px',
  fontFamily: 'Arial, sans-serif',
  fontSize: '18px',
  color: 'var(--text-light)',
  maxWidth: '800px',
  alignContent: 'center',
  alignSelf: 'center',
  justifyContent: 'center',
  filter: theme === 'dark'
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
      backgroundColor: 'var(--bg-light)',
      borderRadius: '20px',
      padding: '25px',
      maxWidth: '90%',
      width: '500px',
      display: 'flex',
      flexDirection: 'row',
      gap: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontFamily: 'Arial Black, Gadget, sans-serif',
          color: 'var(--text-light)',
          fontSize: '20px',
          marginBottom: '-10px',
          marginTop: '10px'
        }}>
          {selected.title}
        </h3>

        {/* Tab-specific content */}
        {activeTab === 'CREDITS' && selected.students?.map((s, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <p style={{
              fontFamily: 'Arial, sans-serif',
              color: 'var(--text-light)',
              fontSize: '18px'
            }}>{s.name}</p>
            {s.linkedin && <a href={s.linkedin} target="_blank" rel="noreferrer" style={{
              fontFamily: 'Arial, sans-serif',
              color: 'var(--UofSRed)',
              fontSize: '16px'
            }}>LinkedIn</a>}<br />
            {s.portfolio && <a href={s.portfolio} target="_blank" rel="noreferrer" style={{
              fontFamily: 'Arial, sans-serif',
              color: 'var(--UofSRed)',
              fontSize: '16px'
            }}>Portfolio</a>}
          </div>
        ))}

        {activeTab === 'STUDIOS' && selected.website && (
          <a href={selected.website} target="_blank" rel="noreferrer" style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#170D38'
          }}>
            Visit Website
          </a>
        )}

                {activeTab === 'STAFF' && selected.role && (
                  <p style={{fontFamily: 'Arial Black, sans-serif',fontSize: '16px',color: 'var(--UofSRed)'}}>{selected.role}</p>
                )}
                {activeTab === 'STAFF' && selected.department && (
                  <p style={{fontFamily: 'Arial, sans-serif',fontSize: '16px',color: 'var(--text-light)',marginTop: '30px'}}>
                    <b>Department: </b> {selected.department}<br></br>
                    <b>Specialism: </b> {selected.specialism}</p>
                )}
                {activeTab === 'STAFF' && selected.linkedin && (
                  <p style={{fontFamily: 'Arial, sans-serif',fontSize: '16px',color: 'var(--UofSRed)'}}>
                    LinkedIn: {selected.linkedin}</p>
                )}

                

                {activeTab === 'GAMES' && selected.releaseYear && (
                  <p style={{fontFamily: 'Arial, sans-serif', fontSize: '16px', color: '#170D38'}}> Released: {selected.releaseYear}</p>
                )}

      </div>

            <div style={{
              flex: '0 0 150px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end' // Aligns children (button) to the right
            }}>
              <img src={selected.image} alt={selected.title} style={{
                width: '100%',
                borderRadius: '10px',
                objectFit: 'cover',
                boxShadow: '0 6px 8px rgba(0, 0, 0, 0.6)'
              }} />
              <button onClick={() => setSelected(null)} style={{
                marginTop: '20px',
                backgroundColor: 'var(--UofSRed)',
                color: 'var(--text-button)',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '20px',
                alignSelf: 'flex-end' // Ensures the button is at the right
              }}>Close</button>
            </div>
    </div>
  </div>
)}


      {/* Footer */}
      <div style={{
        backgroundColor: 'var(--bg-light)',
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
            fontFamily: 'Arial, Gadget, sans-serif',
            color: 'var(--text-light)',
            fontSize: '18px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            filter: theme === 'dark'
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
