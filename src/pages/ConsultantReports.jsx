import { auth } from '../firebase/firebaseConfig';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import {normalizeFileData} from '../helpers/normalizeFileData';
import '../components/List.css';

export const ConsultantReports = () => {
  const { user } = useAuth();
    const { fetchData, loading, error, setError } = useFetch();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [producerEmail, setProducerEmail] = useState('');
    const [reports, setReports] = useState([]);

        const fetchReports = async () => {
            if (!user?.email) return;
            try {
                const token = user.token || await auth.currentUser?.getIdToken();
                const response = await fetchData(
                    `${backendUrl}/consultant/reports/getAll/${producerEmail}`,
                    'GET',
                    null,
                    token
                );

                const reportsData = Array.isArray(response.data) ? response.data : response.data ? [response.data] : [];
                
                const normalizedReports = reportsData.map(report => ({
                    ...report,
                    attached: normalizeFileData(report.attached)
                }));

                setReports(normalizedReports);
            } catch (err) {
                setError('Error al obtener los reportes');
            }
        };

    const sortedReports = [...reports].sort((a, b) => {
        if (!a.created_at || !b.created_at) return 0;
        return new Date(b.created_at) - new Date(a.created_at);
    });

    const handleSearch = (e) => {
        e.preventDefault();
        fetchReports();
    };
    
    return (
        <>
            <section>
                <h1 className='centeredText'>Mis Reportes</h1>
                {loading && <p>Cargando reportes...</p>}
                {error && <p className='errorMessage'>{error}</p>}

                <form className='report-form' onSubmit={handleSearch}>
                    <input
                        type="email"
                        placeholder="Email del productor"
                        value={producerEmail}
                        onChange={(e) => setProducerEmail(e.target.value)}
                    />
                    <button type="submit">Buscar</button>
                </form>

                <ul className='report-list'>
                    {sortedReports.map((report) => (
                        <li className='report-list-item' key={report.uid_report}>
                            <div>Parcela: {report.uid_parcel}</div>
                            <div>Para: {report.email_receiver}</div>
                            <div>Mensaje: {report.content_message}</div>
                            {report.attached && report.attached.length > 0 && (
                                <div>Archivos adjuntos ({report.attached.length}):
                                    <ul>
                                        {report.attached.map((fileUrl, index) => (
                                            <li key={index}>
                                                <a href={fileUrl} target='_blank' rel='noopener noreferrer'>
                                                    Archivo {index + 1}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
        </>
    )
}
