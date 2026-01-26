import { auth } from '../firebase/firebaseConfig';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import {normalizeFileData} from '../helpers/normalizeFileData';
import '../components/List.css';

export const DirectorReports = () => {

    const { user } = useAuth();
    const { fetchData, loading, error, setError } = useFetch();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const diseaseUrl = import.meta.env.VITE_API_DISEASE_URL;
    const [reports, setReports] = useState([]);
    const [disease, setDisease] = useState(null);

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
        fetchReports();
    }, [user, backendUrl, fetchData, setError]);

  const handleDownload = async (id) => {
    try {
      const token = user.token || await auth.currentUser?.getIdToken();
        const res = await fetch(
            `${backendUrl}/producer/reports/download/${id}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (!res.ok) {
            throw new Error(data.msg);
        }
        
        const blob = await res.blob();// Convertimos la respuesta en un Blob
        const url = window.URL.createObjectURL(blob); // Creamos una URL temporal
        const a = document.createElement("a");// Creamos un enlace para descargar el pdf de la url que hemos creado
        a.href = url;
        a.download = `reporte_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();// Borramos en elnace una vez lo hemos usado para descargar el pdf
        window.URL.revokeObjectURL(url);
        // navigate('/worker/dashboard');

    } catch (error) {
        console.log("ERROR:", error)
        alert(error);
    }
  };

  const handleDisease = async (url) => {
    try {
      const res = await fetchData(`${diseaseUrl}/analyze`,'POST', { image_url: url })
      setDisease(res)
    } catch{
      console.log("ERROR:", error)
      alert(error);
    }
  }

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
                            {report.attached && report.attached.length > 0 && (
                            <div>Archivos adjuntos ({report.attached.length}):
                                <ul>
                                    {report.attached.map((fileUrl, index) => (
                                        <li key={index}>
                                            <a href={fileUrl} target='_blank' rel='noopener noreferrer'>
                                                Archivo {index + 1}
                                            </a>
                                            <button className='api-btn' onClick={() => handleDisease (fileUrl)}>Prediccion enfermedades</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className='report-actions'>
                            <button className='download-btn' onClick={() => handleDownload(report.uid_report)}>Descargar</button>
                        </div>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    )
}
