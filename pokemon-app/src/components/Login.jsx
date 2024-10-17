import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert
import "./Login.css";
import Navbar from "./Navbar";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Dati del form inviati:", {
      email: formData.email,
      password: '*****',
    });
  
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password, // Invia la password non hashata al server
        }),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        sessionStorage.setItem("userSession", JSON.stringify(data.user));
  
        Swal.fire({
          icon: "success",
          title: "Login riuscito!",
          text: "Benvenuto nella tua dashboard!",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn-success-swal",
          },
        }).then(() => {
          navigate("/dashboard");
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
      console.error("Errore durante il login:", error);
      Swal.fire({
        icon: "error",
        title: "Errore!",
        text: "Si è verificato un errore durante il login",
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
      <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="col-md-6 col-lg-5">
          <h2 className="text-center mb-4">Accedi</h2>
          <form onSubmit={handleSubmit} className="p-4 shadow-sm rounded bg-white">
            <div className="form-group mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Inserisci la tua email"
                value={formData.email}
                onChange={handleChange}
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
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-check mb-4">
              <input
                type="checkbox"
                name="showPassword"
                checked={formData.showPassword}
                onChange={handleChange}
                className="form-check-input"
                id="showPassword"
              />
              <label className="form-check-label" htmlFor="showPassword">
                Mostra Password
              </label>
            </div>

            <button type="submit" className="btn btn-success btn-block mt-3">
              Accedi
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
