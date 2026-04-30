import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import LoginPage from '../pages/LoginPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import PatientsPage from '../pages/PatientsPage.vue'
import PatientFormPage from '../pages/PatientFormPage.vue'
import AppointmentsPage from '../pages/AppointmentsPage.vue'
import AppointmentFormPage from '../pages/AppointmentFormPage.vue'
import MedicalRecordFormPage from '../pages/MedicalRecordFormPage.vue'
import MedicalRecordDetailPage from '../pages/MedicalRecordDetailPage.vue'
import MedicalRecordAIPage from '../pages/MedicalRecordAIPage.vue'
import ForbiddenPage from '../pages/ForbiddenPage.vue'

const routes = [
  { path: '/login', component: AuthLayout, children: [{ path: '', component: LoginPage }] },
  { path: '/forbidden', component: ForbiddenPage },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: DashboardPage, meta: { roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'DOCTOR', 'RECEPTIONIST'] } },
      { path: 'patients', component: PatientsPage, meta: { roles: ['CLINIC_ADMIN', 'DOCTOR', 'RECEPTIONIST'] } },
      { path: 'patients/new', component: PatientFormPage, meta: { roles: ['CLINIC_ADMIN', 'RECEPTIONIST'] } },
      { path: 'appointments', component: AppointmentsPage, meta: { roles: ['CLINIC_ADMIN', 'DOCTOR', 'RECEPTIONIST'] } },
      { path: 'appointments/new', component: AppointmentFormPage, meta: { roles: ['CLINIC_ADMIN', 'RECEPTIONIST'] } },
      { path: 'medical-records/new', component: MedicalRecordFormPage, meta: { roles: ['CLINIC_ADMIN', 'DOCTOR'] } },
      { path: 'medical-records/:id', component: MedicalRecordDetailPage, meta: { roles: ['CLINIC_ADMIN', 'DOCTOR'] } },
      { path: 'medical-records/:id/ai', component: MedicalRecordAIPage, meta: { roles: ['CLINIC_ADMIN', 'DOCTOR'] } },
    ],
  },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.path === '/login' || to.path === '/forbidden') {
    return true
  }

  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchMe()
    } catch {
      authStore.logout()
      return '/login'
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) return '/login'

  if (to.path === '/login' && authStore.isAuthenticated) return '/dashboard'

  console.log('AUTH ROLE:', authStore.role, 'REQUIRED:', to.meta.roles)

  if (to.meta.roles && !authStore.hasRole(to.meta.roles)) return '/forbidden'

  return true
})

export default router
