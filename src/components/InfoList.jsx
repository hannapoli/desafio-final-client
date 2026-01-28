import { Link } from 'react-router';
import './InfoList.css';

export const InfoList = ({
    itemObject,
    stateObject,
    onModifyPath,
    onDelete

}) => {
    return (
        <>
            <article className='flexColumn centeredContent itemInfo'>
                <h3 className='user-name'>{itemObject.name_user}</h3>
                <p className='text-dark'><span className='bold'>UID:</span></p>
                <p> {itemObject.firebase_uid_user}</p>
                <p className='text-dark'><span className='bold'>Email:</span> {itemObject.email_user}</p>
                <p className='text-dark'><span className='bold'>Role:</span> {itemObject.rol_type}</p>
                <div className='flexContainer'>
                    <Link
                        to={onModifyPath}
                        state={stateObject}>
                        <button className='edit-btn register-btn'>Modificar</button>
                    </Link>
                    <button onClick={() => onDelete(itemObject)} className='register-btn delete-btn'>
                        Eliminar
                    </button>
                </div>
            </article >
        </>
    )
}
