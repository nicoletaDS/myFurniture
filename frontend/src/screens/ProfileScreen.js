import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'

import './ProfileScreen.css'
import { getUserDetails } from '../slices/user/userDetailsSlice'
import { updateUserProfile, userUpdateProfileReset } from '../slices/user/userUpdateProfileSlice'
import Breadcrumbs from '../components/Breadcrumbs'


function ProfileScreen() {
    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const [ message, setMessage ] = useState('')

    
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userDetails = useSelector(state => state.userDetails)
    const { loading, user, error } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    // after the profile is updated (when success == true),
    // clear the state (reset the state.userUpdateProfile)
    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    useEffect(() => {
        if(!userInfo){
            navigate('/login')
        } else {
            if(!user || !user.email || success){
                dispatch(userUpdateProfileReset())
                dispatch(getUserDetails('profile'))
            } else {
                if(user.first_name){ setFirstName(user.first_name)}
                if(user.last_name){ setLastName(user.last_name)}
                setEmail(user.email)
            }
        }
    }, [dispatch, navigate, userInfo, user, success])

    const submitHandler = (e) => {
        e.preventDefault()

        if(password != confirmPassword){
            setMessage('Passwords do not match')
        } else {
            setMessage('')
            dispatch(updateUserProfile({
                'id': user.id,
                'firstName': firstName,
                'lastName': lastName,
                'email': email,
                'password': password
            }))
        }
    }

  return (
    <div className='row'>
        <div className='col'>
            <h2>User Profile</h2>
            
            { message && <p className='error'>{message}</p> }
            { loading && <h2>Loading...</h2>}
            { error && <p className='error'>{error}</p>}

            <div className='form-body'>

                <form onSubmit={submitHandler}>

                    <label className='form-item'>
                        First Name:
                        <input
                            type="text"
                            placeholder='enter first name'
                            value={firstName || ''}
                            onChange={e => setFirstName(e.target.value)}
                        />
                    </label>

                    <label className='form-item'>
                        Last Name:
                        <input
                            type="text"
                            placeholder='enter last name'
                            value={lastName || ''}
                            onChange={e => setLastName(e.target.value)}
                        />
                    </label>

                    <label className='form-item'>
                        Email:
                        <input
                            type="email"
                            placeholder='enter email'
                            value={email || ''}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </label>

                    <label className='form-item'>
                        Password:
                        <input
                            type="password"
                            placeholder='enter password'
                            value={password || ''}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </label>

                    <label className='form-item'>
                        Confirm Password:
                        <input
                            type="password"
                            placeholder='enter confirm password'
                            value={confirmPassword || ''}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </label>

                    <div className='input-wrapper'>
                        <button className='btn form-item' type='submit'>Update</button>
                    </div>

                </form> 
            </div>
        </div>

        <div className='col'>
            <h2>My orders</h2>
            <Breadcrumbs>My Account</Breadcrumbs>
        </div>

    </div>
  )
}

export default ProfileScreen
