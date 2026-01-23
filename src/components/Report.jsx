import './Report.css';

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
        <label htmlFor='email_creator'>Email de remitente:</label>
        <input
          type='email'
          name='email_creator'
          id='email_creator'
          value={reportData.email_creator}
          onChange={onChange}
          readOnly={disabledFields.email_creator ?? true}
          noValidate
        />
      </div>

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
        <label htmlFor='content_message'>Contenido del Mensaje:</label>
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
        <label htmlFor='attached'>Archivo Adjunto (opcional):</label>
        <input
          type='file'
          name='attached'
          id='attached'
          onChange={onFileChange}
          disabled={disabledFields.attached ?? false}
        />
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
