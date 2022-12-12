import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'

import './LoginScreen.css'
import FormContainer from '../components/FormContainer'
import { login } from '../slices/user/userLoginSlice'
import Breadcrumbs from '../components/Breadcrumbs'


function LoginScreen() {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const redirect = location.state ? location.state.redirect : '/'
    
    const userLogin = useSelector(state => state.userLogin)
    const { loading, userInfo, error } = userLogin

    useEffect(() => {
        if(userInfo){
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }


  return (
    <FormContainer>
      <h1 className='form-title'>Log In</h1>
      <Breadcrumbs>Log in</Breadcrumbs>

      {loading && <h2>Loading...</h2>}
      { error && <p className='error'>{error}</p>}

      <div className='form-body'>

        <form onSubmit={submitHandler}>

            <label className='form-item'>
                Email:
                <input
                    type="email"
                    placeholder='enter email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </label>

            <label className='form-item'>
                Password:
                <input
                    type="password"
                    placeholder='enter password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </label>

            <div className='input-wrapper'>
                <button className='btn form-item' type='submit'>Login</button>
                <Link to=''>Forgot your password?</Link>
            </div>

        </form>  

        <div className='new-customer'>
            <h3 className='title'>New Customer?</h3>
            <p>Sign up for an account to take advantage of order tracking and history as well as pre-filled forms during checkout on subsequent orders.</p>
                
            <Link 
                to={redirect ? `/register?redirect=${redirect}` : '/register'}
                className='btn'
            >
                Register
            </Link>
            
        </div>

      </div>

    </FormContainer>
  )
}

export default LoginScreen
