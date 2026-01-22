import { Link } from 'react-router';



export const HomePage = () => {
    return (
        <>
            <main>
                <h1>¡Bienvenido/a a AgroSync!</h1>
                <div>
                    <Link to='auth/register'><button>Registrarse</button></Link>
                    <Link to='auth/login'><button>Iniciar sesión</button></Link>
                </div>
            </main>
        </>
    );
}