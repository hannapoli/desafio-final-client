import { auth } from '../firebase/firebaseConfig';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { Report } from '../components/Report';
import {normalizeFileData} from '../helpers/normalizeFileData';
import '../components/List.css';
import { Disease } from '../components/Disease';

export const ProducerReports = () => {
    const { user } = useAuth();
    const { fetchData, loading, error, setError } = useFetch();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const diseaseUrl = import.meta.env.VITE_API_DISEASE_URL;
    const [disease, setDisease] = useState(null);
    const [showDiseasePopup, setShowDiseasePopup] = useState(false);
    const [reports, setReports] = useState([]);
    const [editReport, setEditReport] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [popupError, setPopupError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            if (!user?.email) return;
            try {
                const token = user.token || await auth.currentUser?.getIdToken();
                const response = await fetchData(
                    `${backendUrl}/producer/reports/getAll/${user.email}`,
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

    const handleEdit = (report) => {
        setEditReport({ ...report });
        setShowEditPopup(true);
        setPopupError(null);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeletePopup(true);
        setPopupError(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditReport((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditFileChange = (e) => {
        const files = e.target.files;
        setEditReport((prev) => ({ ...prev, attached: files && files.length > 0 ? Array.from(files) : null }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setPopupError(null);
        try {
            const token = user.token || await auth.currentUser?.getIdToken();
            const formData = new FormData();
            formData.append('email_creator', editReport.email_creator);
            formData.append('email_receiver', editReport.email_receiver);
            formData.append('content_message', editReport.content_message);
            if (editReport.attached) {
                if (Array.isArray(editReport.attached)) {
                    editReport.attached.forEach((file) => {
                        if (file instanceof File) {
                            formData.append('attached', file);
                        }
                    });
                } else if (editReport.attached instanceof File) {
                    formData.append('attached', editReport.attached);
                }
            }
            const response = await fetch(
                `${backendUrl}/producer/reports/update/${editReport.uid_report}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                }
            );
            if (!response.ok) throw new Error('Error al modificar el reporte');
            const result = await response.json();

            const normalizedReport = {
                ...result.data,
                attached: normalizeFileData(result.data.attached)
            };

            setShowEditPopup(false);
            setReports((prev) => prev.map(r => r.uid_report === editReport.uid_report ? normalizedReport : r));
        } catch (err) {
            setPopupError('Error al modificar el reporte.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const confirmDelete = async () => {
        setSubmitLoading(true);
        setPopupError(null);
        try {
            const token = user.token || await auth.currentUser?.getIdToken();
            const response = await fetch(
                `${backendUrl}/producer/reports/delete/${deleteId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (!response.ok) throw new Error('Error al eliminar el reporte');
            setShowDeletePopup(false);
            setReports((prev) => prev.filter(r => r.uid_report !== deleteId));
        } catch (err) {
            setPopupError('Error al eliminar el reporte.');
        } finally {
            setSubmitLoading(false);
        }
    };

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
      // SE HAN ACABADO LOS TOKEN PARA LAS LLAMADAS A LA API EXTERNA ---> ESTO ES SIMULANDO DATOS
      // const mockDiseaseResponse = {
      //   health_assessment: {
      //     is_healthy: false,
      //     healthy_probability: 0.0017,
      //     diseases: [
      //       {
      //         name: "Mildiu",
      //         probability: 0.87,
      //       },
      //       {
      //         name: "Oídio",
      //         probability: 0.62,
      //       },
      //     ],
      //   },
      //   meta: {
      //     geo_mode: "global_demo",
      //     is_plant_probability: 0.9535,
      //     scan_date: null,
      //   },
      //   taxonomy: {
      //     scientific_name: "Vitis vinifera",
      //     probability: 0.0439,
      //     description: "Sin descripción disponible.",
      //     common_names: [],
      //     wiki_url: null,
      //     image_refs: [
      //       "https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/5/d0c/d670e63c9eb1aa8401224a4e79bcd9d90943b.jpeg",
      //       "https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/5/963/ebb29e55d122d69ac931e529820aedaa58667.jpeg",
      //     ],
      //     taxonomy_tree: {},
      //   },
      // };
      console.log(res)
      setDisease(res)
      setShowDiseasePopup(true);
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
        <section>
            <h1 className='centeredText'>Mis reportes</h1>
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
                            <button className='edit-btn' onClick={() => handleEdit(report)}>Modificar</button>
                            <button className='delete-btn' onClick={() => handleDelete(report.uid_report)}>Eliminar</button>
                            <button className='download-btn' onClick={() => handleDownload(report.uid_report)}>Descargar</button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Edit Popup */}
            {showEditPopup && (
                <div className='popup-overlay' onClick={e => e.target === e.currentTarget && setShowEditPopup(false)}>
                    <div className='popup-content'>
                        <button className='popup-close' onClick={() => setShowEditPopup(false)}>x</button>
                        <h2>Modificar reporte</h2>
                        {popupError && <p className='errorMessage'>{popupError}</p>}
                        <Report
                            reportData={editReport}
                            onChange={handleEditChange}
                            onFileChange={handleEditFileChange}
                            onSubmit={handleEditSubmit}
                            submitLoading={submitLoading}
                            submitLabel='Guardar Cambios'
                            disabledFields={{ email_creator: true }}
                        />
                    </div>
                </div>
            )}

            {/* Delete Popup */}
            {showDeletePopup && (
                <div className='popup-overlay' onClick={e => e.target === e.currentTarget && setShowDeletePopup(false)}>
                    <div className='popup-content'>
                        <button className='popup-close' onClick={() => setShowDeletePopup(false)}>x</button>
                        <h2>¿Eliminar reporte?</h2>
                        {popupError && <p className='errorMessage'>{popupError}</p>}
                        <div className='flexContainer'>
                            <button className='api-btn' onClick={confirmDelete} disabled={submitLoading}>Sí, eliminar</button>
                            <button onClick={() => setShowDeletePopup(false)} disabled={submitLoading}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
            {showDiseasePopup && disease && (
            <Disease setShowDiseasePopup= {setShowDiseasePopup} disease={disease} />
            )}
        </section>
    );
}
