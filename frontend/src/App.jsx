import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login/Login'
import Info from './components/Info/Info'
import Register from './components/Register/Register'

export default function App() {
  
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/rules" element={<Info body="rules" />} />
      <Route path="/about" element={<Info body="about" />} />
      <Route path="/api" element={<Info body="api" />} />
      <Route path="/verification" element={<Info body="email_verification" />} />
      </Routes>
    </Router>
  );
}

