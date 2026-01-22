import { Link } from 'react-router';
import './MenuCard.css';

/**
 * MenuCard component
 * @param {string} logo - Emoji or icon for the card
 * @param {string} text - Main text/label
 * @param {string} image - Image URL or import
 * @param {string} url - Link destination
 */
export const MenuCard = ({ logo, text, image, url }) => {
    return (
        <Link to={url} className="menu-card flexColumn centeredContent">
            <div className="menu-card-logo">{logo}</div>
            <div className="menu-card-text">{text}</div>
            {image
                && <div className='img-container'>
                    <img src={image} alt={text} className="menu-card-image" />
                </div>}
        </Link>
    );
};