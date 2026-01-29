import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useFetch } from '../hooks/useFetch';
import { auth } from '../firebase/firebaseConfig';
import { PopUp } from '../components/PopUp';
import { InfoList } from '../components/InfoList';
import '../components/ParcelDetails.css';
import '../components/InfoList.css';

/**
 * AdminUsers component.
 *
 * Página de listado y gestión de usuarios.
 * Permite al Administrador visualizar y
 * acceder a la edición de los usuarios del sistema.
 *
 * @component
 * @returns {JSX.Element}
 */

export const AdminUsers = () => {
    const [email, setEmail] = useState('');
    const [foundUser, setFoundUser] = useState(null);
    const [searchError, setSearchError] = useState(null);
    const [users, setUsers] = useState([]);

    const [userToDelete, setUserToDelete] = useState(null);

    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState('');

    const { fetchData, loading } = useFetch();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    //Mostrar todos los usuarios al cargar la página
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                const response = await fetchData(
                    `${backendUrl}/admin/users/getall`,
                    'GET',
                    null,
                    token
                );
                setUsers(response.users || []);
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            }
        };
        loadUsers();
    }, [backendUrl, fetchData]);


    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchError(null);
        setFoundUser(null);

        if (!email.trim()) {
            setSearchError('Ingresa un email');
            return;
        }

        try {
            const token = await auth.currentUser?.getIdToken();
            const response = await fetchData(
                `${backendUrl}/admin/users/get/${email}`,
                'GET',
                null,
                token
            );
            // console.log(response.user)
            setFoundUser(response.user);

        } catch (error) {
            setSearchError(error.message || 'Usuario no encontrado');
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        setDeleteLoading(true);
        setDeleteError(null);
        setDeleteSuccess('');
        try {
            const token = await auth.currentUser?.getIdToken();
            await fetchData(
                `${backendUrl}/admin/users/delete/${userToDelete.firebase_uid_user}`,
                'DELETE',
                null,
                token
            );
            setShowDeletePopup(false);
            setUsers(users.filter(user => user.firebase_uid_user !== userToDelete.firebase_uid_user));
            if (foundUser?.firebase_uid_user === userToDelete.firebase_uid_user)
                setFoundUser(null);
            setEmail('');
            setUserToDelete(null);
            setDeleteSuccess('Se ha eliminado el usuario correctamente.');
        } catch (error) {
            setDeleteError(error.message || 'Error al eliminar el usuario');
        } finally {
            setDeleteLoading(false);
        }
    };

    const openDeletePopup = (user) => {
        setUserToDelete(user);
        setShowDeletePopup(true);
    };

    return (
        <>
            <section className='flexColumn centeredContent'>
                <h1>Gestión de usuarios</h1>

                <form onSubmit={handleSearch} className='flexColumn centeredContent form-get-users'>
                    <div className='flexColumn'>
                        <label htmlFor='email'>Buscar usuario por email:</label>
                        <input
                            type='email'
                            id='email'
                            placeholder='Escribe el email del usuario...'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            noValidate
                            className='register-input search-input'
                        />
                    </div>
                    <button type='submit' disabled={loading} className='register-btn'>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>

                {deleteSuccess && <p className='successMessage'>{deleteSuccess}</p>}
                {searchError && <p className='errorMessage'>{searchError}</p>}
                {foundUser && (
                    <article className='flexColumn centeredContent found-card'>
                        <h2 className='margin-block'>Información del usuario encontrado:</h2>
                        <div className='itemInfo found-user'>
                            <h3 className='user-name'>{foundUser.name_user}</h3>
                            <p><span className='bold'>UID:</span> {foundUser.firebase_uid_user}</p>
                            <p><span className='bold'>Email:</span> {foundUser.email_user}</p>
                            <p><span className='bold'>Role:</span> {foundUser.rol_type}</p>

                            <div className='userManagementActions'>
                                <Link to={`/admin/users/edit/${foundUser.firebase_uid_user}`} state={{ user: foundUser }}>
                                    <button className='edit-btn'>Modificar</button>
                                </Link>
                                <button onClick={() => openDeletePopup(foundUser)} className='delete-btn'>Eliminar</button>
                            </div>
                        </div>
                    </article>
                )}
                <h2 className='margin-block'>Lista de todos los usuarios:</h2>
                <section className='userList'>
                    {loading && <p>Cargando usuarios...</p>}
                    {users.length === 0 && !loading && <p>No hay usuarios registrados.</p>}
                    {users.map((user) => (
                        <InfoList
                            key={user.firebase_uid_user}
                            itemObject={user}
                            stateObject={{ user: user }}
                            onModifyPath={`/admin/users/edit/${user.firebase_uid_user}`}
                            onDelete={openDeletePopup}
                        />
                    ))}
                </section>
            </section>

            {/* Popup para eliminar el usuario seleccionado */}
            <PopUp
                isOpen={showDeletePopup && userToDelete !== null}
                onClose={() => {
                    setShowDeletePopup(false);
                    setUserToDelete(null);
                    setDeleteError(null);
                }}
            >
                <h2 className="text-green centeredText">¿Eliminar este usuario?</h2>
                {userToDelete && (
                    <p className="text-dark centeredText user-delete">{userToDelete.email_user}</p>
                )}
                {deleteError && <p className='errorMessage'>{deleteError}</p>}
                <div className='flexContainer'>
                    <button
                        onClick={handleDeleteUser}
                        className='edit-btn'
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? 'Eliminando...' : 'Sí, eliminar'}
                    </button>
                    <button
                        className='delete-btn'
                        onClick={() => {
                            setShowDeletePopup(false);
                            setUserToDelete(null);
                            setDeleteError(null);
                        }}
                        disabled={deleteLoading}
                    >
                        Cancelar
                    </button>
                </div>
            </PopUp>
        </>
    );
}