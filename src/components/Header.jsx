import './Header.css'

export const Header = ({ children }) => {
    return (
        <header className='fullContainer'>
            {children}
        </header>
    )
}
