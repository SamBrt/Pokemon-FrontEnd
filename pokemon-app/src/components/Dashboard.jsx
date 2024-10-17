import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import "./Dashboard.css";
import Navbar from "./Navbar";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();

  // Recupera i dati dell'utente dal sessionStorage
  const userSession = JSON.parse(sessionStorage.getItem("userSession"));
  const userId = userSession ? userSession.id : null;

  // Stati per la modifica del profilo
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [formData, setFormData] = useState({
    username: userSession?.username || "",
    email: userSession?.email || "",
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

  // Dati per il grafico a torta, con i tipi di Pokémon e percentuali fittizie
  const pokemonTypes = [
    { type: "Fuoco", percent: 10, color: "#FF4500" },
    { type: "Acqua", percent: 15, color: "#1E90FF" },
    { type: "Erba", percent: 12, color: "#32CD32" },
    { type: "Elettrico", percent: 8, color: "#FFD700" },
    { type: "Psico", percent: 7, color: "#FF1493" },
    { type: "Ghiaccio", percent: 6, color: "#ADD8E6" },
    { type: "Buio", percent: 5, color: "#708090" },
    { type: "Acciaio", percent: 9, color: "#B0C4DE" },
    { type: "Drago", percent: 4, color: "#8A2BE2" },
    { type: "Folletto", percent: 4, color: "#FFB6C1" },
    { type: "Roccia", percent: 6, color: "#A52A2A" },
    { type: "Spettro", percent: 4, color: "#4B0082" },
    { type: "Terra", percent: 10, color: "#DEB887" },
  ];

  const pieData = {
    labels: pokemonTypes.map(type => type.type),
    datasets: [
      {
        label: "Pokémon",
        data: pokemonTypes.map(type => type.percent),
        backgroundColor: pokemonTypes.map(type => type.color),
        hoverOffset: 4,
      },
    ],
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

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

  const handleSaveChanges = async () => {
    if (
      formData.password &&
      (!passwordRequisites.hasUppercase ||
        !passwordRequisites.hasNumber ||
        !passwordRequisites.hasMinLength)
    ) {
      Swal.fire({
        icon: "error",
        title: "Errore!",
        text: "La nuova password non soddisfa i requisiti di sicurezza.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn-success-swal",
        },
      });
      return;
    }

    Swal.fire({
      title: "Conferma le modifiche",
      text: "Vuoi davvero salvare le modifiche apportate al profilo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#28a745",
      confirmButtonText: "Sì, salva",
      cancelButtonText: "Annulla",
      customClass: {
        confirmButton: "btn-danger-swal",
        cancelButton: "btn-success-swal",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:3000/updateProfile/${userId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: formData.username,
                oldPassword: formData.oldPassword,
                newPassword: formData.password,
              }),
            }
          );

          const data = await response.json();

          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Modifiche salvate!",
              text: "Le informazioni del profilo sono state aggiornate.",
              confirmButtonText: "OK",
              customClass: {
                confirmButton: "btn-success-swal",
              },
            });
            setIsEditing(false);
            sessionStorage.setItem(
              "userSession",
              JSON.stringify({ ...userSession, username: formData.username })
            );
          } else {
            Swal.fire({
              icon: "error",
              title: "Errore!",
              text: data.message,
              confirmButtonText: "OK",
            });
          }
        } catch (error) {
          console.error("Errore durante l'aggiornamento del profilo:", error);
          Swal.fire({
            icon: "error",
            title: "Errore!",
            text: "Si è verificato un errore durante l'aggiornamento del profilo.",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

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

  const handleDeleteAccount = async () => {
    Swal.fire({
      title: "Sei sicuro?",
      text: "Questa azione eliminerà il tuo account in modo permanente. Vuoi continuare?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#28a745",
      confirmButtonText: "Sì, elimina",
      cancelButtonText: "Annulla",
      customClass: {
        confirmButton: "btn-danger-swal",
        cancelButton: "btn-success-swal",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:3000/deleteAccount/${userId}`,
            {
              method: "DELETE",
            }
          );

          const data = await response.json();

          if (response.status === 200) {
            sessionStorage.removeItem("userSession");
            Swal.fire({
              icon: "success",
              title: "Account eliminato",
              text: data.message,
              confirmButtonText: "OK",
              customClass: {
                confirmButton: "btn-success-swal"
              }
            }).then(() => {
              navigate("/");
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Errore",
              text: data.message,
              confirmButtonText: "OK",
              customClass: {
                confirmButton: "btn-success-swal"
              }
            });
          }
        } catch (error) {
          console.error("Errore durante l'eliminazione dell'account:", error);
          Swal.fire({
            icon: "error",
            title: "Errore",
            text: "Si è verificato un errore durante l'eliminazione dell'account",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn-success-swal"
            }
          });
        }
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

        {/* Aggiungere il grafico a torta */}
        <div className="chart-container">
          <h2>Suddivisione dei Tipi di Pokémon</h2>
          <Pie data={pieData} />
        </div>

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
              <strong>Data di Registrazione:</strong> {userSession?.registrationDate || "N/A"}
            </li>
          </ul>
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
        </div>

        {/* Sezione nascosta per modificare il profilo */}
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
    </>
  );
};

export default Dashboard;
