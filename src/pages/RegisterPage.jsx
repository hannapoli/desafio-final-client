import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
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
      setAuthError(error.message || 'Error al registrarse');
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

            {showTerms && (
              <div className='popup-overlay agreement-overlay' onClick={e => e.target === e.currentTarget && setShowTerms(false)}>
                <section className='agreement-content'>
                  <button className='popup-close' onClick={() => setShowTerms(false)} aria-label="Cerrar">×</button>
                  <h2>Términos y Condiciones de AgroSync</h2>
                  <section className='agreement-text'>
                    <p><strong>Última actualización: 24 de enero de 2026</strong></p>
                    <p>¡Te damos la bienvenida a AgroSync! Al registrarte y utilizar nuestros servicios, aceptas los siguientes términos y condiciones. Por favor, léelos detenidamente antes de continuar.</p>
                    <ol>
                      <li><p><strong>Objeto del Servicio</strong></p>
                      <p>AgroSync es una plataforma que conecta productores, asesores y empresas distribuidoras de frutas y verduras, facilitando la gestión, predicción y visualización de información agrícola mediante tecnologías avanzadas, incluyendo realidad mixta y predicción inteligente.</p></li>

                      <li><p><strong>Privacidad y Protección de Datos</strong></p>
                      <p>Tus datos personales serán tratados conforme a nuestra Política de Privacidad. Nos comprometemos a proteger tu información y a utilizarla únicamente para los fines relacionados con la prestación de nuestros servicios.</p></li>

                      <li><p><strong>Uso de la Plataforma</strong></p>
                      <p>Debes proporcionar información veraz y actualizada. El uso indebido de la plataforma, incluyendo la suplantación de identidad o el uso fraudulento, resultará en la suspensión o eliminación de tu cuenta.</p></li>

                      <li><p><strong>Propiedad Intelectual</strong></p>
                      <p>Todos los contenidos, marcas, logos y tecnologías presentes en AgroSync son propiedad de la empresa o de sus respectivos titulares y están protegidos por las leyes de propiedad intelectual.</p></li>

                      <li><p><strong>Limitación de Responsabilidad</strong></p>
                      <p>AgroSync no se hace responsable por daños directos o indirectos derivados del uso de la plataforma, ni por la veracidad de la información proporcionada por los usuarios.</p></li>

                      <li><p><strong>Actualizaciones</strong></p>
                      <p>Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Te notificaremos sobre cambios relevantes a través de la plataforma o por correo electrónico.</p></li>
                      
                      <li><p><strong>Contacto</strong></p>
                      <p>Si tienes dudas sobre estos términos o sobre nuestra política de privacidad, puedes contactarnos a través de los canales oficiales de AgroSync.</p></li>
                    </ol>
                    <p className="agreement-ending">Al registrarte, confirmas que has leído y aceptas estos términos y condiciones, así como nuestra política de privacidad.</p>
                  </section>
                </section>
              </div>
            )}
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
