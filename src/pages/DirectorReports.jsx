import { auth } from '../firebase/firebaseConfig';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { Report } from '../components/Report';
import '../components/List.css';

export const DirectorReports = () => {

    const { user } = useAuth();
    const { fetchData, loading, error, setError } = useFetch();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            if (!user?.email) return;
            try {
                const token = user.token || await auth.currentUser?.getIdToken();
                const response = await fetchData(
                    `${backendUrl}/director/reports/getAll/${user.email}`,
                    'GET',
                    null,
                    token
                );
                setReports(Array.isArray(response.data) ? response.data : response.data ? [response.data] : []);
            } catch (err) {
                setError('Error al obtener los reportes');
            }
        };
        fetchReports();
    }, [user, backendUrl, fetchData, setError]);

    const sortedReports = [...reports].sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0;
    return new Date(b.created_at) - new Date(a.created_at);
  });


    return (
        <>
            <section>
                <h1 className='centeredText'>Mis Reportes</h1>
                {loading && <p>Cargando reportes...</p>}
                {error && <p className='errorMessage'>{error}</p>}
                <ul className='report-list'>
                    {sortedReports.map((report) => (
                        <li className='report-list-item' key={report.uid_report}>
                            <div>Parcela: {report.uid_parcel}</div>
                            <div>Para: {report.email_receiver}</div>
                            <div>Mensaje: {report.content_message}</div>
                            {report.attached && (
                                <div>Archivo: <a href={Array.isArray(report.attached) ? report.attached[0] : report.attached} target='_blank' rel='noopener noreferrer'>Ver archivo</a></div>
                            )}
                            <div className='report-actions'>
                                <button className='edit-btn' onClick={() => handleEdit(report)}>Modificar</button>
                                <button className='delete-btn' onClick={() => handleDelete(report.uid_report)}>Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    )
}
