import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Terminos } from '../components/Terminos';
import "./RegisterPage.css"
import '../components/PopUp.css';


export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    accept: false
  });

  const [showTerms, setShowTerms] = useState(false);

  const { register, loading, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  //Limpiar error al cambiar datos del formulario
  useEffect(() => {
    setAuthError(null);
  }, [setAuthError]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.accept) {
      setAuthError('Debes aceptar los términos y condiciones para registrarte.');
      return;
    }
    try {
      await register(formData);
      navigate('/auth/login', {
        state: { message: '¡Gracias por registrarte! Por favor, inicia la sesión.' }
      });
    } catch (error) {
      setAuthError(getFirebaseErrorMessage(error));
    }
  };

  return (
    <>
      <section className='register-container flexColumn centeredContent'>
        <div className="glass register-glass">
          <div className="login-brand">
            <img
              className="logo-login"
              src="/logo.png"
              alt="AgroSync"
            />
            <span className="brand-name-login">AgroSync</span>
          </div>
          <h2 className="login-title">Regístrate</h2>

          {authError && <p className='errorMessage'>{authError}</p>}

          <form onSubmit={handleSubmit} className='register-form flexColumn centeredContent'>
            <div className='flexColumn'>
              <label htmlFor='name'></label>
              <input
                className='register-input register-name'
                type='text'
                name='name'
                id='name'
                placeholder='Nombre y Apellido'
                value={formData.name}
                onChange={handleChange}
                noValidate
              />
            </div>

            <div className='flexColumn'>
              <label htmlFor='email'></label>
              <input
                className='register-input register-email'
                type='email'
                name='email'
                id='email'
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                noValidate
              />
            </div>

            <div className='flexColumn'>
              <label htmlFor='password'></label>
              <input
                className='register-input register-password'
                type='password'
                name='password'
                id='password'
                placeholder='Contraseña'
                value={formData.password}
                onChange={handleChange}
                noValidate
              />
            </div>

            <div className='register-select flexColumn'>
              <label htmlFor='role'></label>
              <select name='role' id='role' value={formData.role} onChange={handleChange}>
                <option value='' disabled>--Selecciona tu rol--</option>
                <option value='productor' name='productor' id='productor'>Productor/a</option>
                <option value='distribuidor' name='distribuidor' id='distribuidor'>Distribuidor/a</option>
                <option value='asesor' name='asesor' id='asesor'>Asesor/a</option>
                <option value='analista' name='analista' id='analista'>Analista</option>
                <option value='director' name='director' id='director'>Director/a</option>
              </select>

            </div>

            <div>
              <input
                type="checkbox"
                id="accept"
                name="accept"
                checked={formData.accept}
                onChange={handleChange}
              />
              <label htmlFor="accept">
                Acepto los <span className='text-link' onClick={() => setShowTerms(true)}>términos y condiciones</span>
              </label>
            </div>

            <Terminos showPopup={showTerms} onClose={() => setShowTerms(false)} />
            <button className='register-btn' type='submit' disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
          <div className="link-login">
            Ya tienes una cuenta? <Link to='/auth/login'>Inicia sesión</Link>
          </div>
        </div>
      </section>
    </>
  )
}
