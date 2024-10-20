import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Importa SweetAlert
import './Navbar.css'; 

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Stato per il menu a comparsa
  const navigate = useNavigate();

  // Controlla se l'utente è già loggato (esistenza di dati in sessionStorage)
  useEffect(() => {
    const userSession = sessionStorage.getItem("userSession");
    if (userSession) {
      setIsLoggedIn(true); // L'utente è già loggato
    }
  }, []);

  // Funzione per gestire l'apertura/chiusura del menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Gestione del clic su "Registrati"
  const handleRegisterClick = (e) => {
    if (isLoggedIn) {
      e.preventDefault();
      Swal.fire({
        icon: 'info',
        title: 'Sei già loggato!',
        text: 'Hai già effettuato l\'accesso. Non puoi registrarti di nuovo.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn-success-swal' // Bottone verde personalizzato
        }
      });
    } else {
      // Se non sei loggato, permetti l'accesso alla pagina di registrazione
      navigate("/register");
    }
  };

  // Gestione del clic su "Login"
  const handleLoginClick = (e) => {
    if (isLoggedIn) {
      e.preventDefault();
      Swal.fire({
        icon: 'info',
        title: 'Sei già loggato!',
        text: 'Hai già effettuato l\'accesso.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn-success-swal' // Bottone verde personalizzato
        }
      });
    }
  };

  // Gestione del clic su "Dashboard"
  const handleDashboardClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      Swal.fire({
        icon: 'error',
        title: 'Accesso negato!',
        text: 'Devi essere loggato per accedere alla dashboard.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn-success-swal' // Bottone verde personalizzato
        }
      });
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img
          src="\src\assets\International_Pokémon_logo.svg.png"
          alt="Pokemon Logo"
          className="navbar-logo"
        />
      </Link>
      <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/register" className="nav-link" onClick={handleRegisterClick}>
          Registrati
        </Link>
        <Link to="/login" className="nav-link" onClick={handleLoginClick}>
          Login
        </Link>
        <Link to="/dashboard" className="nav-link" onClick={handleDashboardClick}>
          Dashboard
        </Link>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        &#9776;
      </div>
    </nav>
  );
};

export default Navbar;
