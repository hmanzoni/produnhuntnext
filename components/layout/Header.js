import React from 'react'
import Buscar from '../ui/Buscar'
import Navegacion from './Navegacion'

const Header = () => (
  <header>
    <div>
      <div>
        <h1>Header</h1>
        <Buscar />
        <Navegacion />
      </div>
      <div>
        <p>Hola User</p>
        <button type="submit">Cerrar sesion</button>
      </div>
    </div>
  </header>
)

export default Header
