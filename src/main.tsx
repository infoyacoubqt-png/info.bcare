import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FormProvider } from './FormContext'
import { initFirebase } from './firebase'
import { useSessionTracking } from './hooks/useSessionTracking'
import './index.css'

import Layout from './components/Layout'
import Home from './pages/Home'
import VehicleForm from './pages/VehicleForm'
import CustomerForm from './pages/CustomerForm'
import OTPVerify from './pages/OTPVerify'
import Offers from './pages/Offers'
import OfferDetails from './pages/OfferDetails'
import Payment from './pages/Payment'
import AdminApproval from './pages/AdminApproval'
import PaymentResult from './pages/PaymentResult'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Cookies from './pages/Cookies'

initFirebase()

function AppRoutes() {
  useSessionTracking()
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/vehicle-form" element={<VehicleForm />} />
        <Route path="/customer-form" element={<CustomerForm />} />
        <Route path="/verify" element={<OTPVerify />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/offer-details" element={<OfferDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/admin-approval" element={<AdminApproval />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
      </Route>
    </Routes>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FormProvider>
        <AppRoutes />
      </FormProvider>
    </BrowserRouter>
  </StrictMode>,
)
