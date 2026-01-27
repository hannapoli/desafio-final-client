import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { useFetch } from '../hooks/useFetch';
import { auth } from '../firebase/firebaseConfig';

export const AdminUserEdit = () => {
    const location = useLocation();
    const { user: foundUser } = location.state || {};
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: foundUser?.name_user || '',
        email: foundUser?.email_user || '',
        role: foundUser?.rol_type || ''
    });
    const [modifyError, setModifyError] = useState(null);
    const [modifyLoading, setModifyLoading] = useState(false);
    const [modifySuccess, setModifySuccess] = useState('');

    const { fetchData } = useFetch();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleModifyUser = async (e) => {
        e.preventDefault();
        setModifyLoading(true);
        setModifyError(null);
        setModifySuccess('');
        try {
            if (!foundUser) {
                setModifyError('No se ha encontrado el usuario.');
                return;
            }
            const token = await auth.currentUser?.getIdToken();
            await fetchData(
                `${backendUrl}/admin/users/edit/${foundUser.firebase_uid_user}`,
                'PUT',
                {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role
                },
                token
            );
            setModifySuccess('Usuario modificado correctamente.');
            setTimeout(() => {
                navigate('/admin/users');
            }, 2500);
        } catch (error) {
            setModifyError(error.message || 'Error al modificar el usuario.');
        } finally {
            setModifyLoading(false);
        }
    };

    return (
        <>
            <h1>Gestión de usuarios</h1>

            <article className='flexColumn centeredContent'>
                <h2>Modificar usuario</h2>
                {modifySuccess && <p className='successMessage'>{modifySuccess}</p>}
                {modifyError && <p className='errorMessage'>{modifyError}</p>}

                <form onSubmit={handleModifyUser} className='flexColumn centeredContent'>
                    <div className='flexColumn'>
                        <label htmlFor='firebase_uid'>Firebase UID:</label>
                        <input
                            type='text'
                            id='firebase_uid'
                            value={foundUser.firebase_uid_user}
                            disabled
                            noValidate
                        />
                    </div>

                    <div className='flexColumn'>
                        <label htmlFor='name'>Nombre:</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            placeholder='Nombre'
                            value={formData.name}
                            onChange={handleChange}
                            noValidate

                        />
                    </div>

                    <div className='flexColumn'>
                        <label htmlFor='email'>Email:</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            placeholder='Email'
                            value={formData.email}
                            onChange={handleChange}
                            noValidate

                        />
                    </div>

                    <div className='register-select flexColumn'>
                        <label htmlFor='role'>Role</label>
                        <select name='role' id='role' value={formData.role} onChange={handleChange} noValidate>
                            <option value='' disabled>--Selecciona tu rol--</option>
                            <option value='productor' name='productor' id='productor'>Productor/a</option>
                            <option value='distribuidor' name='distribuidor' id='distribuidor'>Distribuidor/a</option>
                            <option value='asesor' name='asesor' id='asesor'>Asesor/a</option>
                            <option value='analista' name='analista' id='analista'>Analista</option>
                            <option value='director' name='director' id='director'>Director/a</option>
                            <option value='admin' name='admin' id='admin'>Administrador/a</option>
                        </select>

                    </div>

                    <div>
                        <button type='submit' disabled={modifyLoading} className='confirmBtn'>
                            {modifyLoading ? 'Modificando...' : 'Modificar usuario'}
                        </button>
                    </div>
                </form>
            </article>
        </>
    );
}
