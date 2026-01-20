import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { login, loading, authError, setAuthError, user, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || null;

  //Limpiar error al cambiar datos del formulario
  useEffect(() => {
    setAuthError(null);
  }, [setAuthError]);

  // Redirigir al usuario autenticado a su dashboard según su rol
  useEffect(() => {
    console.log(`Redirección de ${user}, con role: ${role}`);
    if (user && role) {
      switch (role) {
        case 'productor':
          navigate('/producer/dashboard');
          break;
        case 'distribuidor':
          navigate('/distributor/dashboard');
          break;
        case 'asesor':
          navigate('/consultant/dashboard');
          break;
        case 'analista':
          navigate('/analyst/dashboard');
          break;
        case 'director':
          navigate('/director/dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [user, role, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  }
  return (
    <>
      <section className='flexColumn centeredContent'>
        <h1>AgroSync</h1>
        <h2>Iniciar sesión</h2>

        {message && <p className='successMessage'>{message}</p>}
        {authError && <p className='errorMessage'>{authError}</p>}

        <form onSubmit={handleSubmit} className='flexColumn centeredContent'>
          <div className='flexColumn'>
            <label htmlFor='email'>Email:</label>
            <input
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
            <label htmlFor='password'>Contraseña:</label>
            <input
              type='password'
              name='password'
              id='password'
              placeholder='Contraseña'
              value={formData.password}
              onChange={handleChange}
              noValidate
            />
          </div>
          <button type='submit' disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
        <div>
          ¿No tienes una cuenta? <Link to='/auth/register'>Regístrate</Link>
        </div>
      </section>
    </>
  )
}
