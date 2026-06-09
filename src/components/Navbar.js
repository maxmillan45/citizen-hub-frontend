import React from 'react';
import { FiMenu } from 'react-icons/fi';

function Navbar({ onMenuClick }) {
  return (
    <button className="menu-toggle" onClick={onMenuClick}>
      <FiMenu size={24} />
    </button>
  );
}
export default Navbar;
