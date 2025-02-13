import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login/Login'
import Info from './components/Info/Info'
import Register from './components/Register/Register'
import EmailVerification from './components/EmailVerification'
import Profile from './components/Profile/Profile'
import EditProfile from './components/EditProfile/EditProfile'
import CreatePost from './components/CreatePost/CreatePost'
import SinglePost from './components/SinglePost/SinglePost'
import Notifications from './components/Notifications/Notifications'

export default function App() {
  
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/rules" element={<Info body="rules" />} />
      <Route path="/about" element={<Info body="about" />} />
      <Route path="/api" element={<Info body="api" />} />
      <Route path="/email" element={<Info body="email_verification" />} />
      <Route path="/email/verification" element={<EmailVerification />} />
      <Route path="/profile/:username" element={<Profile />} />
      <Route path="/profile-edit" element={<EditProfile />} />
      <Route path="/post/create" element={<CreatePost />} />
      <Route path=":username/post/:id" element={<SinglePost />} />
      <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

