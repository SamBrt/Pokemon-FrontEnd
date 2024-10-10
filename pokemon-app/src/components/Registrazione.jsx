import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Registrazione.css";
import Navbar from "./Navbar";

const Registrazione = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    showPassword: false,
  });

  const [errors, setErrors] = useState({
    passwordMismatch: false,
    termsNotAccepted: false,
  });

  const [passwordValidations, setPasswordValidations] = useState({
    hasUppercase: false,
    hasNumber: false,
    hasMinLength: false,
  });

  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      password: value,
    }));

    setPasswordValidations({
      hasUppercase: /[A-Z]/.test(value),
      hasNumber: /\d/.test(value),
      hasMinLength: value.length >= 8,
    });
  };

  const isPasswordValid =
    passwordValidations.hasUppercase &&
    passwordValidations.hasNumber &&
    passwordValidations.hasMinLength;

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      // Reset degli errori
      setErrors({
        passwordMismatch: false,
        termsNotAccepted: false,
      });
    
      // Controlla se le password corrispondono
      if (formData.password !== formData.confirmPassword) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          passwordMismatch: true,
        }));
        Swal.fire({
          icon: "error",
          title: "Errore!",
          text: "Le password non corrispondono!",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn-success-swal",
          },
        });
        return;
      }
    
      // Controlla se i termini sono accettati
      if (!formData.termsAccepted) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          termsNotAccepted: true,
        }));
        Swal.fire({
          icon: "error",
          title: "Errore!",
          text: "Devi accettare i termini e le condizioni!",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn-success-swal",
          },
        });
        return;
      }
    
      // Verifica che la password soddisfi tutti i requisiti
      if (!isPasswordValid) {
        Swal.fire({
          icon: "error",
          title: "Errore!",
          text: "La password non soddisfa i requisiti richiesti.",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn-success-swal",
          },
        });
        return;
      }
    
      try {
        // Invia i dati al server (password non hashata)
        const response = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password, // Invia la password non hashata al server
          }),
        });
    
        const data = await response.json();
    
        if (response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Registrazione completata!",
            text: data.message,
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn-success-swal",
            },
          }).then(() => {
            navigate("/login");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Errore!",
            text: data.message,
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn-success-swal",
            },
          });
        }
      } catch (error) {
        console.error("Errore durante la registrazione:", error);
        Swal.fire({
          icon: "error",
          title: "Errore!",
          text: "Si è verificato un errore durante la registrazione",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn-success-swal",
          },
        });
      }
    };
    

  return (
    <>
      <Navbar />
      <div
        className="container mt-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="col-md-6 col-lg-5">
          <h2 className="text-center mb-4">Registrati</h2>
          <form onSubmit={handleSubmit} className="p-4 shadow-sm rounded bg-white">
            <div className="form-group mb-3">
              <label>Nome utente</label>
              <input
                type="text"
                name="username"
                placeholder="Inserisci il tuo nome utente"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Inserisci la tua email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Password</label>
              <input
                type={formData.showPassword ? "text" : "password"}
                name="password"
                placeholder="Inserisci la tua password"
                value={formData.password}
                onChange={handlePasswordChange}
                className="form-control"
                required
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setShowSuggestions(false)}
              />
            </div>

            <div className="form-group mb-3">
              <label>Conferma Password</label>
              <input
                type={formData.showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Conferma la tua password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="form-control"
                required
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setShowSuggestions(false)}
              />
              {errors.passwordMismatch && (
                <small className="text-danger">Le password non corrispondono</small>
              )}
            </div>

            {/* Requisiti della password */}
            {showSuggestions && (
              <ul className="password-requirements">
                <strong>Deve contenere</strong>
                <li style={{ color: passwordValidations.hasUppercase ? "green" : "red" }}>
                  &#8226; Almeno una lettera maiuscola
                </li>
                <li style={{ color: passwordValidations.hasNumber ? "green" : "red" }}>
                  &#8226; Almeno un carattere numerico
                </li>
                <li style={{ color: passwordValidations.hasMinLength ? "green" : "red" }}>
                  &#8226; Almeno 8 caratteri
                </li>
              </ul>
            )}

            <div className="form-check mb-4">
              <input
                type="checkbox"
                name="showPassword"
                checked={formData.showPassword}
                onChange={(e) => setFormData({ ...formData, showPassword: e.target.checked })}
                className="form-check-input"
                id="showPassword"
              />
              <label className="form-check-label" htmlFor="showPassword">
                Mostra Password
              </label>
            </div>

            <div className="form-check mb-4">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="form-check-input"
                id="termsAccepted"
              />
              <label className="form-check-label" htmlFor="termsAccepted">
                Accetto i Termini e le Condizioni
              </label>
            </div>

            <button type="submit" className="btn btn-success btn-block mt-3" disabled={!isPasswordValid}>
              Registrati
            </button>

            <div className="text-center mt-4">
              <p>Sei già registrato? <a href="/login">Accedi</a></p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registrazione;
