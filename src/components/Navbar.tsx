import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => (
  <nav
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      borderBottom: '1px solid #e6e6e6',
      background: '#fff',
    }}
  >
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Link to="/" style={{ fontWeight: 700, textDecoration: 'none', color: '#111' }}>
        StudyBuddy
      </Link>
      <Link to="/swipe" style={{ textDecoration: 'none', color: '#444' }}>
        Swipe
      </Link>
      <Link to="/matches" style={{ textDecoration: 'none', color: '#444' }}>
        Matches
      </Link>
    </div>
    <div>
      <Link to="/profile" style={{ textDecoration: 'none', color: '#444' }}>
        Profile
      </Link>
    </div>
  </nav>
);

export default Navbar;