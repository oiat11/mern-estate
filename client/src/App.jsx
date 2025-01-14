import React from 'react'
import { Routes, Route, BrowserRouter} from 'react-router-dom'
import SignIn from './pages/SignIn'
import About from './pages/About'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Header from './components/Header'

export default function App() {
  return <BrowserRouter>
  <Header/>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/sign-in" element={<SignIn />} />
    <Route path="/sign-out" element={<SignUp />} />
    <Route path="/about" element={<About />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
  </BrowserRouter>
}
