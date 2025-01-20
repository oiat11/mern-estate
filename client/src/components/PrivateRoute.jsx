// this component is used to protect the routes that are only accessible to authenticated users
import React from 'react'
import {useSelector} from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function PrivateRoute() {
    const {currentUser} = useSelector(state => state.user)
// if the user is authenticated, the Outlet component is rendered, otherwise the user is redirected to the sign-in page
  return currentUser ? <Outlet/> : <Navigate to='/sign-in'/>
}
