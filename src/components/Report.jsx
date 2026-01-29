import './Report.css';

/**
 * Report component.
 *
 * Formulario reutilizable para la creación de reportes.
 * Recibe los datos del formulario y los handlers desde
 * el componente padre, manteniendo este componente
 * libre de lógica de negocio.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.reportData - Estado del formulario del reporte
 * @param {Function} props.onChange - Handler para cambios en inputs de texto
 * @param {Function} props.onFileChange - Handler para carga de archivos
 * @param {Function} props.onSubmit - Handler de envío del formulario
 * @param {boolean} props.submitLoading - Indica si el formulario está enviando datos
 * @param {string} [props.submitLabel] - Texto del botón de envío
 * @param {Object} [props.disabledFields] - Campos deshabilitados del formulario
 * @returns {JSX.Element} Formulario de creación de reportes
 */
export const Report = ({
  reportData,
  onChange,
  onFileChange,
  onSubmit,
  submitLoading,
  submitLabel = 'Crear Reporte',
  disabledFields = {},
}) => {
  return (
    <form onSubmit={onSubmit} className='report-form'>
      <div className='form-group'>
        <label htmlFor='email_receiver'>Email de receptor:</label>
        <input
          type='email'
          name='email_receiver'
          id='email_receiver'
          placeholder='Email del receptor'
          value={reportData.email_receiver}
          onChange={onChange}
          readOnly={disabledFields.email_receiver ?? false}
          noValidate
        />
      </div>

      <div className='form-group'>
        <label htmlFor='content_message'>Contenido del mensaje:</label>
        <textarea
          name='content_message'
          id='content_message'
          placeholder='Escribe el contenido del reporte...'
          value={reportData.content_message}
          onChange={onChange}
          rows={6}
          readOnly={disabledFields.content_message ?? false}
          noValidate
        />
      </div>

      <div className='form-group'>
        <label htmlFor='attached'>Archivo(s):</label>
        <input
          type='file'
          name='attached'
          id='attached'
          onChange={onFileChange}
          disabled={disabledFields.attached ?? false}
          multiple
        />
        {reportData.attached && (
          <div className='file-list'>
            <strong>Archivos seleccionados ({Array.isArray(reportData.attached) ? reportData.attached.length : reportData.attached instanceof FileList ? reportData.attached.length : 1}):</strong>
            <ul>
              {Array.isArray(reportData.attached) ? (
                reportData.attached.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))
              ) : reportData.attached instanceof FileList ? (
                Array.from(reportData.attached).map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))
              ) : (
                <li>{reportData.attached.name}</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <button
        type='submit'
        disabled={submitLoading}
        className='submit-btn'
      >
        {submitLoading ? 'Enviando...' : submitLabel}
      </button>
    </form>
  );
};
