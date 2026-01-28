import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { auth } from '../firebase/firebaseConfig';
import './DirectorConsultants.css'

export const DirectorConsultants = () => {
    const { user } = useAuth();
    const { fetchData, loading, error } = useFetch();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [productores, setProductores] = useState([]);
    const [asesores, setAsesores] = useState([]);
    const [selectedAsesor, setSelectedAsesor] = useState({});
    const [assigning, setAssigning] = useState(false);
    const [consultantsByProductor, setConsultantsByProductor] = useState({});
    const [productoresParaContratar, setProductoresParaContratar] = useState([]);

  /* ================= PRODUCTORES ================= */
    const getProductores = async () => {
        try {
            const firebaseUser = auth.currentUser;
            if (!firebaseUser) return;

            const token = await firebaseUser.getIdToken();
            const response = await fetchData(
            `${backendUrl}/director/productor/getAll/${user.uid}`,
            'GET',
            null,
            token
            );

            setProductores(response.data || []);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        getProductores();
    }, [backendUrl, fetchData, user]);

  /* ================= ASESORES ================= */
    useEffect(() => {
        const getConsultants = async () => {
        try {
            const firebaseUser = auth.currentUser;
            if (!firebaseUser) return;

            const token = await firebaseUser.getIdToken();
            const response = await fetchData(
            `${backendUrl}/director/consultant/getAll`,
            'GET',
            null,
            token
            );

            setAsesores(response.data || []);
        } catch (err) {
            console.error('ERROR:', err);
        }
        };

        getConsultants();
    }, [backendUrl, fetchData]);

    const getConsultantsByProductor = async (emailProductor) => {
        try {
            const token = await auth.currentUser.getIdToken();

            const response = await fetchData(
            `${backendUrl}/director/productor/getAllConsultants/${emailProductor}`,
            'GET',
            null,
            token
            );

            setConsultantsByProductor((prev) => ({
            ...prev,
            [emailProductor]: response.data || [],
            }));
        } catch (err) {
            console.error(err);
        }
    };


  /* ================= ASIGNAR ================= */
    const handleAssign = async (emailProductor) => {
        const emailConsultant = selectedAsesor[emailProductor];
        if (!emailConsultant) {
        alert('Selecciona un asesor');
        return;
        }

        try {
        setAssigning(true);
        const token = await auth.currentUser.getIdToken();

        await fetchData(
            `${backendUrl}/director/consultant/assign/${emailProductor}/${emailConsultant}`,
            'POST',
            null,
            token
        );
        await getConsultantsByProductor(emailProductor);
        alert('Asesor asignado correctamente');
        } catch (err) {
        console.error(err);
        alert('Error al asignar asesor');
        } finally {
        setAssigning(false);
        }
    };

  /* ================= DESASIGNAR ================= */
    const handleUnassign = async (emailProductor, emailConsultant) => {
        if (!window.confirm('¿Seguro que quieres desasignar este asesor?')) {
            return;
        }
        try {
            const token = await auth.currentUser.getIdToken();

            await fetchData(
            `${backendUrl}/director/consultant/unassign/${emailProductor}/${emailConsultant}`,
            'DELETE', // o 'POST' si tu backend lo usa así
            null,
            token
            );

            await getConsultantsByProductor(emailProductor);
        } catch (err) {
            console.error(err);
            alert('Error al desasignar asesor');
        }
    };

/* ================= PRODUCTORES PARA CONTRATAR ================= */
const handleContratar = async (emailProductor) => {
        try {
            const token = await auth.currentUser.getIdToken();
                // Llamada al backend
            await fetchData(
            `${backendUrl}/director/productor/contratar/${emailProductor}`,
            'POST',
            null,
            token
            );

            await getProductores();
            await getProductoresParaContratar(); 
        } catch (err) {
            console.error(err);
            alert('Error al contratar productor');
        }
    };

    const handleDescontratar = async (emailProductor) => {
        try {
            const token = await auth.currentUser.getIdToken();
            await fetchData(
            `${backendUrl}/director/productor/despedir/${emailProductor}`,
            'DELETE',
            null,
            token
            );
            await getProductores();
            await getProductoresParaContratar(); 
        } catch (err) {
            console.error(err);
            alert('Error al descontratar productor');
        }
    };

    const getProductoresParaContratar = async () => {
        try {
        const token = await auth.currentUser.getIdToken();
        const response = await fetchData(
            `${backendUrl}/director/productor/getAll`,
            'GET',
            null,
            token
        );

        setProductoresParaContratar(response.data || []);
        } catch (err) {
        console.error(err);
        }
    };

    useEffect(() => {
        getProductoresParaContratar();
    }, [backendUrl, fetchData]);

    useEffect(() => {
        if (productores.length === 0) return;

        productores.forEach((productor) => {
            getConsultantsByProductor(productor.email_user);
        });
    }, [productores]);

    const productoresParaContratarFiltrados = productoresParaContratar.filter((productor) => !productores.some(p => p.email_user === productor.email_user));

  return (
    <>
        {loading && <p>Cargando productores...</p>}
        {error && <p>Error al cargar datos: {error}</p>}

        <section className="flexContainer CenteredContent">
            <h1 className="centeredText">Mis Productores</h1>

            {productores.length === 0 && !loading && (
            <p>No hay productores registrados</p>
            )}

            <div className="consultantsGrid">
            {productores.map((productor) => (
                <div
                key={productor.email_user}
                className="consultantCard"
                >
                <h3>{productor.name_user}</h3>
                <p>{productor.email_user}</p>
                {/* Botón para descontratar */}
                <button onClick={() => handleDescontratar(productor.email_user)}>
                Despedir
                </button>

                {/* SELECT ASESOR */}
                <select
                    value={selectedAsesor[productor.email_user] || ''}
                    onChange={(e) =>
                    setSelectedAsesor({
                        ...selectedAsesor,
                        [productor.email_user]: e.target.value,
                    })
                    }
                >
                    <option value="">Selecciona asesor</option>
                    {asesores.map((asesor) => (
                    <option
                        key={asesor.email_user}
                        value={asesor.email_user}
                    >
                        {asesor.name_user} ({asesor.email_user})
                    </option>
                    ))}
                </select>

                <button
                    disabled={assigning}
                    onClick={() =>
                    handleAssign(productor.email_user)
                    }
                >
                    Asignar asesor
                </button>
                    {/* ASESORES ASIGNADOS */}
                    <div className="assignedConsultants">
                    <h4>Asesores asignados</h4>

                    {consultantsByProductor[productor.email_user]?.length > 0 ? (
                        <ul>
                            {consultantsByProductor[productor.email_user].map((asesor) => (
                            <li key={asesor.email_user} className="assignedConsultantItem">
                                <span>
                                {asesor.name_user} ({asesor.email_user})
                                </span>

                                <button
                                className="unassignButton"
                                onClick={() =>
                                    handleUnassign(
                                    productor.email_user,
                                    asesor.email_user
                                    )
                                }
                                >
                                ✕
                                </button>
                            </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="emptyText">No tiene asesores asignados</p>
                    )}
                    </div>
                </div>
            ))}
            </div>
        </section>
        <section className="flexContainer CenteredContent">
        <h1 className="centeredText">Productores para contratar</h1>

        {productoresParaContratarFiltrados.length === 0 && <p>No hay productores disponibles</p>}

        <div className="consultantsGrid">
            {productoresParaContratarFiltrados.map((productor) => (
            <div key={productor.email_user} className="consultantCard">
                <h3>{productor.name_user}</h3>
                <p>{productor.email_user}</p>
                <button onClick={() => handleContratar(productor.email_user)}>
                Contratar
                </button>
            </div>
            ))}
        </div>
        </section>
    </>
  );
};
