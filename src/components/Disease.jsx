import React from 'react'

export const Disease = ({setShowDiseasePopup, disease}) => {
  return (
    <div
        className="popup-overlay"
        onClick={(e) => e.target === e.currentTarget && setShowDiseasePopup(false)}
        >
        <div className="popup-content">
            <button
            className="popup-close"
            onClick={() => setShowDiseasePopup(false)}
            >
            x
            </button>

            <h2>Resultado de la predicción 🌱</h2>

            {/* TAXONOMÍA */}
            <section>
            <h3>Planta detectada</h3>
            <p><strong>Nombre científico:</strong> {disease.taxonomy?.scientific_name}</p>
            <p><strong>Probabilidad:</strong> {(disease.taxonomy?.probability * 100).toFixed(2)}%</p>
            <p>{disease.taxonomy?.description}</p>
            </section>

            {/* SALUD */}
            <section>
            <h3>Estado de salud</h3>
            <p>
                <strong>¿Está sana?</strong>{" "}
                {disease.health_assessment?.is_healthy ? "Sí ✅" : "No ❌"}
            </p>
            <p>
                <strong>Probabilidad de estar sana:</strong>{" "}
                {(disease.health_assessment?.healthy_probability * 100).toFixed(2)}%
            </p>
            </section>

            {/* ENFERMEDADES */}
            {!disease.health_assessment?.is_healthy && (
            <section>
                <h3>Enfermedades detectadas</h3>
                <ul>
                {disease.health_assessment?.diseases.map((d, index) => (
                    <li key={index}>
                    <strong>{d.name}</strong> – {(d.probability * 100).toFixed(2)}%
                    </li>
                ))}
                </ul>
            </section>
            )}

            {/* IMÁGENES SIMILARES */}
            {disease.taxonomy?.image_refs?.length > 0 && (
            <section>
                <h3>Imágenes de referencia</h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {disease.taxonomy.image_refs.map((img, i) => (
                    <img
                    key={i}
                    src={img}
                    alt="Referencia"
                    style={{ width: "120px", borderRadius: "8px" }}
                    />
                ))}
                </div>
            </section>
            )}
        </div>
        </div>
  )
}
