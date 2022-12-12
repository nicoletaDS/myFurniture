import React from 'react'
import { Link } from 'react-router-dom'

import './Breadcrumbs.css'

function Breadcrumbs({children}) {
  return (
    <div className='breadcrumbs'>
        <Link to='/'>Home</Link>/
        {children}
    </div>
  )
}

export default Breadcrumbs;
