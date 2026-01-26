import {auth} from '../firebase/firebaseConfig';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { Report } from '../components/Report';
import '../components/List.css';

export const ProducerReports = () => {
  const { user } = useAuth();
  const { fetchData, loading, error, setError } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
        setReports(Array.isArray(response.data) ? response.data : response.data ? [response.data] : []);
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
    setEditReport((prev) => ({ ...prev, attached: e.target.files[0] }));
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
      if (editReport.attached instanceof File) {
        formData.append('attached', editReport.attached);
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
      setShowEditPopup(false);
      setReports((prev) => prev.map(r => r.uid_report === editReport.uid_report ? result.data : r));
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

  const sortedReports = [...reports].sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
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
            <h2>Modificar Reporte</h2>
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
              <button className='delete-btn' onClick={confirmDelete} disabled={submitLoading}>Sí, eliminar</button>
              <button onClick={() => setShowDeletePopup(false)} disabled={submitLoading}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
