import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Station from './pages/Station'
import Donation from './pages/Donation'
import Success from './pages/Success'
import RegisterStep1 from './pages/RegisterStep1'
import RegisterStep2 from './pages/RegisterStep2'
import RegisterStep3 from './pages/RegisterStep3'
import RegisterStep4 from './pages/RegisterStep4'
import { Header } from './components/Header'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)] items-center">
      <div className="relative w-full max-w-screen-sm flex-1 px-2 pt-20">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/station" element={<Station />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/success" element={<Success />} />
          <Route path="/register-step1" element={<RegisterStep1 />} />
          <Route path="/register-step2" element={<RegisterStep2 />} />
          <Route path="/register-step3" element={<RegisterStep3 />} />
          <Route path="/register-step4" element={<RegisterStep4 />} />
        </Routes>
        <Footer />
      </div>
    </div>
  )
}