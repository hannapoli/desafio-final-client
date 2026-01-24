import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { auth } from '../firebase/firebaseConfig';
import { ViewerParcelProducer } from "../components/ViewerParcelProducer";
import { Report } from '../components/Report';

export const ProducerFieldInfo = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { fetchData, loading, error, setError } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [parcel, setParcel] = useState(null);
  const [reportData, setReportData] = useState({
    email_creator: '',
    email_receiver: '',
    content_message: '',
    attached: null
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
<<<<<<< HEAD

  /////////////////////////////////
  const infoParcelUrl = import.meta.env.VITE_API_DATA_URL;
  const [dataPhoto, setDataPhoto] = useState(null);

    // Para obtener la data de la API de Data
    useEffect(() => {

      const getDataPhoto = async () => {
        try {
          const response = await fetchData(
            `${infoParcelUrl}/analyze?id_parcela=123`, /////////////// PENDIENTE PREGUNTAR POR EL TEMA DEL ID Y EL TEMA DEL ADJUNTO DE LA FOTO, YO NO LO PUEDO PASAR
          )

          setDataPhoto(response.data || null);
        } catch (err) {
          setDataPhoto(null);
          setError("Error al obtener la información de la parcela")
        }
      }

      getDataPhoto();

    }, [user, infoParcelUrl]);

    const points = [
      {
        id: "Cielo",
        position: "-0.054 5.0 8.66"

      },
      {
        id: "Suelo",
        position: "-4.959 -5.197 -6.957"
      },
      {
        id: "Cultivo",
        position: "-7.12 -0.054 -7.022"
      }
    ]
    /////////////////////////////////
=======

  //========CLOUDINARY VIEWER PARCEL========//

  const imageUrl = "https://res.cloudinary.com/dbi5thf23/image/upload/v1769010767/bloem_field_sunrise_4k_e3mlls.jpg"
  // Pendiente fetch para traer la imagen
  const points = {
    sky: { x: 2045, y: 513 },
    soil: { x: 2047, y: 1523 },
    crop: { x: 1024, y: 900 },
  };

  //========CLOUDINARY VIEWER PARCEL========//
>>>>>>> 01893c9 (ADD: views for reports management by the producer.)

  useEffect(() => {
    const getParcel = async () => {
      if (!user?.uid || !id) return;

      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
          console.error('No hay usuario autenticado en Firebase');
          return;
        }

        const token = await firebaseUser.getIdToken();

        const response = await fetchData(
          `${backendUrl}/producer/parcel/${id}`,
          'GET',
          null,
          token
        );
        setParcel(response.data || null);
        // console.log('Datos de la parcela elegida:', response);
      } catch (err) {
        setParcel(null);
        if (err.message?.includes('403') || err.message?.includes('permiso')) {
          setError('No tienes permiso para ver esta parcela');
        } else {
          setError('Error al obtener la parcela');
        }
      }
    };

    getParcel();
  }, [user, backendUrl, fetchData, id]);

  useEffect(() => {
    if (user?.email) {
      setReportData(currentData => ({
        ...currentData,
        email_creator: user.email
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData(currentData => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setReportData(currentData => ({
      ...currentData,
      attached: e.target.files[0]
    }));
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        setSubmitError('No hay usuario autenticado');
        return;
      }

      const token = await firebaseUser.getIdToken();

      const formData = new FormData();
      formData.append('email_creator', reportData.email_creator);
      formData.append('email_receiver', reportData.email_receiver);
      formData.append('content_message', reportData.content_message);
      if (reportData.attached) {
        formData.append('attached', reportData.attached);
      }

      const response = await fetch(
        `${backendUrl}/producer/reports/create/${user.email}/${id}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Error al mandar el reporte: ${response.status}`);
      }

      const result = await response.json();
      // console.log('Reporte creado:', result);
      setSubmitSuccess(true);

      setReportData({
        email_creator: user.email,
        email_receiver: '',
        content_message: '',
        attached: null
      });

      // Resetear las entradas del formulario y el archivo
      e.target.reset();
    } catch (err) {
      setSubmitError('Error al crear el reporte. Inténtalo de nuevo.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <section className='flexColumn centeredContent'>
      <h1>Información de la Parcela</h1>

      {loading && <p>Cargando la información de la parcela...</p>}
      {error && <p>Error al cargar la parcela: {error}</p>}

      {parcel && (
        <>
        <article >
          <h2>Detalles de la Parcela</h2>
          <pre>{JSON.stringify(parcel, null, 2)}</pre>
        </article>

        <ViewerParcelProducer imageUrl={parcel.photo_url} points={points}/> {/* --- CUIDADO, SI CAMBIA EL CAMPO EN LA BBDD HAY QUE CAMBIAR ESTE CAMPO ---*/}
        </>
      )}
      <article className='flexColumn centeredContent'>
        <h2>Crear Reporte</h2>

        {submitSuccess && <p className='successMessage'>¡Reporte creado exitosamente!</p>}
        {submitError && <p className='errorMessage'>{submitError}</p>}

        <Report reportData={reportData}
          onChange={handleInputChange}
          onFileChange={handleFileChange}
          onSubmit={handleSubmitReport}
          submitLoading={submitLoading}
          submitLabel='Guardar Cambios'
          disabledFields={{ email_creator: true }}
        />
      </article>
    </section>
  );
}
