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
      { path: 'patients', component: PatientsPage, meta: { roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'DOCTOR', 'RECEPTIONIST'] } },
      { path: 'patients/new', component: PatientFormPage, meta: { roles: ['CLINIC_ADMIN', 'RECEPTIONIST'] } },
      { path: 'appointments', component: AppointmentsPage, meta: { roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'DOCTOR', 'RECEPTIONIST'] } },
      { path: 'appointments/new', component: AppointmentFormPage, meta: { roles: ['CLINIC_ADMIN', 'RECEPTIONIST'] } },
      { path: 'medical-records/new', component: MedicalRecordFormPage, meta: { roles: ['CLINIC_ADMIN', 'DOCTOR'] } },
      { path: 'medical-records/:id', component: MedicalRecordDetailPage, meta: { roles: ['CLINIC_ADMIN', 'DOCTOR'] } },
      { path: 'medical-records/:id/ai', component: MedicalRecordAIPage, meta: { roles: ['CLINIC_ADMIN', 'DOCTOR'] } },
    ],
  },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (auth.token && !auth.user) {
    try { await auth.fetchMe() } catch { auth.logout() }
  }
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
  if (to.path === '/login' && auth.isAuthenticated) return '/dashboard'
  if (to.meta.roles && !auth.hasRole(to.meta.roles)) return '/forbidden'
})

export default router
