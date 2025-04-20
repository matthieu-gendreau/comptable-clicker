
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-4 text-xs text-pennylane-gray">
      <p>Un jeu promotionnel pour Pennylane - Le logiciel de comptabilité intelligent</p>
      <a 
        href="https://www.pennylane.com/fr" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-pennylane-purple hover:underline"
      >
        Découvrir Pennylane
      </a>
    </footer>
  );
};

export default Footer;
