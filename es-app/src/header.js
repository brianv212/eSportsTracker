import React from 'react'

function Header() {
    return (
        <header style={headerStyle}>
            <h3>All the popular games. All in one!</h3>
        </header>
    )
}

const headerStyle = {
    background: 'rgb(133, 10, 10)',
    color: '#fff',
    textAlign: 'center',
}

export default Header