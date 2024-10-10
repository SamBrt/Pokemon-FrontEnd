import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState } from "react";
import "./Dashboard.css";
import Navbar from "./Navbar";
import bcrypt from "bcryptjs"; // Importa bcryptjs per la gestione delle password

const Dashboard = () => {
  const navigate = useNavigate();

  // Recupera i dati dell'utente dal Local Storage
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  // Stati per la modifica del profilo
  const [isEditing, setIsEditing] = useState(false); // Per mostrare/nascondere la sezione di modifica
  const [showPasswords, setShowPasswords] = useState(false); // Stato per mostrare/nascondere le password
  const [formData, setFormData] = useState({
    username: userData.username || "",
    email: userData.email || "",
    oldPassword: "",
    password: "",
  });
  const [passwordRequisites, setPasswordRequisites] = useState({
    hasUppercase: false,
    hasNumber: false,
    hasMinLength: false,
  });

  // Dati di esempio per la dashboard
  const totalPokemonCollected = 150;
  const totalTypes = 18;
  const recentActivities = ["Catturato Pikachu", "Evoluto Bulbasaur"];

  // Gestione dell'input nei campi del form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      setPasswordRequisites({
        hasUppercase: /[A-Z]/.test(value),
        hasNumber: /\d/.test(value),
        hasMinLength: value.length >= 8,
      });
    }
  };

  // Funzione per salvare le modifiche al profilo
  const handleSaveChanges = async () => {
    const isPasswordCorrect = await bcrypt.compare(
      formData.oldPassword,
      userData.password
    );

    if (!isPasswordCorrect) {
      Swal.fire({
        icon: "error",
        title: "Errore!",
        text: "La vecchia password non corrisponde!",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn-success-swal",
        },
      });
      return;
    }

    let updatedPassword = userData.password;

    if (formData.password) {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(formData.password, salt);
    }

    const updatedData = {
      ...userData,
      username: formData.username,
      password: updatedPassword, // Aggiorna la password hashata
    };

    localStorage.setItem("userData", JSON.stringify(updatedData));

    Swal.fire({
      icon: "success",
      title: "Modifiche salvate!",
      text: "Le informazioni del profilo sono state aggiornate.",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "btn-success-swal",
      },
    });

    setIsEditing(false); // Chiudi la sezione di modifica
  };

  // Funzione per il logout
  const handleLogout = () => {
    sessionStorage.removeItem("userSession");

    Swal.fire({
      icon: "success",
      title: "Logout effettuato!",
      text: "Sei stato disconnesso con successo.",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "btn-success-swal",
      },
    }).then(() => {
      navigate("/login");
    });
  };

  // Funzione per eliminare l'account
  const handleDeleteAccount = () => {
    Swal.fire({
      title: "Sei sicuro?",
      text: "Non potrai recuperare il tuo account una volta eliminato!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sì, elimina account!",
      cancelButtonText: "Annulla",
      customClass: {
        confirmButton: "btn-success-swal",
        cancelButton: "btn-danger",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("userData");
        sessionStorage.removeItem("userSession");

        Swal.fire({
          icon: "success",
          title: "Account eliminato!",
          text: "Il tuo account è stato eliminato con successo.",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn-success-swal",
          },
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h1 className="dashboard-title">
          Benvenuto nella tua Dashboard, {formData.username}!
        </h1>

        <div className="dashboard-grid">
          {/* Card Pokémon Collezionati */}
          <div className="card-dashboard">
            <h2>Pokémon Collezionati</h2>
            <div className="card-content">
              <span className="stat-number">{totalPokemonCollected}</span>
              <p>Numero totale di Pokémon nella tua collezione.</p>
            </div>
          </div>

          {/* Card Tipi di Pokémon */}
          <div className="card-dashboard">
            <h2>Tipi di Pokémon</h2>
            <div className="card-content">
              <span className="stat-number">{totalTypes}</span>
              <p>Numero totale di tipi di Pokémon scoperti.</p>
            </div>
          </div>

          {/* Card Attività Recenti */}
          <div className="card-dashboard">
            <h2>Attività Recenti</h2>
            <div className="card-content">
              <ul>
                {recentActivities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sezione nascosta per modificare il profilo */}
        <div className="account-actions-section">
          <div className="btn-div">
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(!isEditing)}
            >
              Modifica Profilo
            </button>
            <button className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
            <button className="btn btn-danger" onClick={handleDeleteAccount}>
              Elimina Account
            </button>
          </div>

          {isEditing && (
            <div className="edit-profile">
              <h2>Modifica il tuo profilo</h2>
              <div className="form-group">
                <label>Nome Utente</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Vecchia Password</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Nuova Password (opzionale)</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showPasswords"
                  checked={showPasswords}
                  onChange={() => setShowPasswords(!showPasswords)}
                />
                <label className="form-check-label" htmlFor="showPasswords">
                  Mostra Password
                </label>
              </div>
              <ul className="password-requisites">
                <li className={passwordRequisites.hasUppercase ? "valid" : ""}>
                  Lettera maiuscola
                </li>
                <li className={passwordRequisites.hasNumber ? "valid" : ""}>
                  Carattere numerico
                </li>
                <li className={passwordRequisites.hasMinLength ? "valid" : ""}>
                  Almeno 8 caratteri
                </li>
              </ul>

              <button className="btn btn-primary" onClick={handleSaveChanges}>
                Salva Modifiche
              </button>
            </div>
          )}
        </div>

        {/* Informazioni Utente */}
        <div className="user-info-section">
          <h2>Informazioni Personali</h2>
          <ul>
            <li>
              <strong>Nome Utente:</strong> {formData.username}
            </li>
            <li>
              <strong>Email:</strong> {formData.email}
            </li>
            <li>
              <strong>Data di Registrazione:</strong>{" "}
              {userData.registrationDate || "N/A"}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
