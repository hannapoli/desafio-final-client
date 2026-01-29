import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { getFirebaseErrorMessage } from "../helpers/firebaseErrorMessage";
import { PopUp } from "../components/PopUp";

import "./LoginPage.css";

/**
 * LoginPage component.
 *
 * Página de inicio de sesión de la aplicación.
 * Permite a los usuarios autenticarse
 * y acceder a su área correspondiente.
 *
 * @component
 * @returns {JSX.Element}
 */

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);

  const {
    login,
    loginWithGoogle,
    resetPassword,
    loading,
    authError,
    setAuthError,
    user,
    role,
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || null;

  //Limpiar error al cambiar datos del formulario
  useEffect(() => {
    setAuthError(null);
    if (showPopUp) {
      setResetEmail("");
      setResetSent(false);
    }
  }, [setAuthError, showPopUp]);

  // Redirigir al usuario autenticado a su dashboard según su rol
  useEffect(() => {
    console.log(`Redirección de ${user}, con role: ${role}`);
    if (user && role) {
      switch (role) {
        case "productor":
          navigate("/producer/dashboard");
          break;
        case "distribuidor":
          navigate("/distributor/dashboard");
          break;
        case "asesor":
          navigate("/consultant/dashboard");
          break;
        case "analista":
          navigate("/analyst/dashboard");
          break;
        case "director":
          navigate("/director/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, role, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (error) {
      setAuthError(getFirebaseErrorMessage(error));
    }
  };

  return (
    <>
      <main className="login-body-container">
        <section className="login-glass flexColumn centeredContent">
          <div className="login-brand">
            <img
              className="logo-login"
              src="/logo.png"
              alt="AgroSync"
            />
            <span className="brand-name-login">AgroSync</span>
          </div>
          <h2 className="login-title">¡Bienvenid@!</h2>

          {message && <p className="successMessage">{message}</p>}
          {authError && <p className="errorMessage">{authError}</p>}

          <form
            onSubmit={handleSubmit}
            className="login-form flexColumn centeredContent"
          >
            <div className="input-container input-group flexColumn">
              <label htmlFor="email"></label>
              <input
                className="email-input"
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                noValidate
              />
            </div>

            <div className="input-container input-group flexColumn">
              <label htmlFor="password"></label>
              <input
                className="password-input"
                type="password"
                name="password"
                id="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                noValidate
              />
            </div>

            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <section className="google-container">
            <button
              className="login-google"
              onClick={loginWithGoogle}
              disabled={loading}
            >
              Iniciar sesión con Google
            </button>

            <p className="login-register">
              ¿No tienes una cuenta? <Link to="/auth/register">Regístrate</Link>
            </p>

            <p className="login-forgot" onClick={() => setShowPopUp(true)}>
              ¿Olvidaste tu contraseña?
            </p>
          </section>
        </section>

        {/* PopUp para reestablecer contraseña */}
        <PopUp isOpen={showPopUp} onClose={() => setShowPopUp(false)} className="reset-popup">
          <h3>Restablecer contraseña</h3>
          <div className="flexColumn">
            <input
              type="email"
              name="resetEmail"
              id="resetEmail"
              placeholder="Introduce tu email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              noValidate
              className="password-reset"
            />
          </div>
          <div>
            <button onClick={handleResetPassword} disabled={loading} className="password-reset">
              {loading ? "Enviando email..." : "Reestablecer contraseña"}
            </button>
          </div>
          {resetSent && (
            <p className="successMessage">
              Se ha enviado un email para restablecer la contraseña.
            </p>
          )}
        </PopUp>
      </main>
    </>
  );
};
