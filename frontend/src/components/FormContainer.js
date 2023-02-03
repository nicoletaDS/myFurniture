import React, { Children } from 'react'

import './FormContainer.css'


function FormContainer({ children }) {
  return (
    <div className='container'>
      {children}
    </div>
  )
}

export default FormContainer
