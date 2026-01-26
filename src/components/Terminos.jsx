import '../components/PopUp.css';

export const Terminos = ({ showPopup, onClose }) => {
  if (!showPopup) return null;

  return (
    <div className='popup-overlay agreement-overlay' onClick={e => e.target === e.currentTarget && onClose()}>
      <section className='agreement-content'>
        <button className='popup-close' onClick={onClose}>×</button>
        <h2>Términos y Condiciones de AgroSync</h2>
        <section className='agreement-text'>
          <p><strong>Última actualización: 24 de enero de 2026</strong></p>
          <p>¡Te damos la bienvenida a AgroSync! Al registrarte y utilizar nuestros servicios, aceptas los siguientes términos y condiciones. Por favor, léelos detenidamente antes de continuar.</p>
          <ol>
            <li><p><strong>Objeto del Servicio</strong></p>
            <p>AgroSync es una plataforma que conecta productores, asesores y empresas distribuidoras de frutas y verduras, facilitando la gestión, predicción y visualización de información agrícola mediante tecnologías avanzadas, incluyendo realidad mixta y predicción inteligente.</p></li>

            <li><p><strong>Privacidad y Protección de Datos</strong></p>
            <p>Tus datos personales serán tratados conforme a nuestra Política de Privacidad. Nos comprometemos a proteger tu información y a utilizarla únicamente para los fines relacionados con la prestación de nuestros servicios.</p></li>

            <li><p><strong>Uso de la Plataforma</strong></p>
            <p>Debes proporcionar información veraz y actualizada. El uso indebido de la plataforma, incluyendo la suplantación de identidad o el uso fraudulento, resultará en la suspensión o eliminación de tu cuenta.</p></li>

            <li><p><strong>Propiedad Intelectual</strong></p>
            <p>Todos los contenidos, marcas, logos y tecnologías presentes en AgroSync son propiedad de la empresa o de sus respectivos titulares y están protegidos por las leyes de propiedad intelectual.</p></li>

            <li><p><strong>Limitación de Responsabilidad</strong></p>
            <p>AgroSync no se hace responsable por daños directos o indirectos derivados del uso de la plataforma, ni por la veracidad de la información proporcionada por los usuarios.</p></li>

            <li><p><strong>Actualizaciones</strong></p>
            <p>Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Te notificaremos sobre cambios relevantes a través de la plataforma o por correo electrónico.</p></li>
            
            <li><p><strong>Contacto</strong></p>
            <p>Si tienes dudas sobre estos términos o sobre nuestra política de privacidad, puedes contactarnos a través de los canales oficiales de AgroSync.</p></li>
          </ol>
          <p className="agreement-ending">Al registrarte, confirmas que has leído y aceptas estos términos y condiciones, así como nuestra política de privacidad.</p>
        </section>
      </section>
    </div>
  );
};
