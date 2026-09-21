import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardPage } from '@/features/dashboard'
import { OnboardingPage } from '@/features/onboarding'
import { AppLayout } from '../layouts/AppLayout'
import { RequireProfile } from './RequireProfile'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route
        element={
          <RequireProfile>
            <AppLayout />
          </RequireProfile>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/profile" element={<OnboardingPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
