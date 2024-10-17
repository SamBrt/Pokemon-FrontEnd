import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>&copy; {currentYear} Pokémon. Tutti i diritti riservati.</p>
    </footer>
  );
};

export default Footer;
