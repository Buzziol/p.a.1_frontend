# Frontend Blueprint MVP — Sistema Multi-Clínica Dermatológico

## 1. Resumo executivo

Este documento define o **blueprint técnico do frontend** para evoluir o projeto atual (Vue 3 + Vite + Tailwind + Axios) de uma tela única de análise de imagem para um **MVP intermediário multi-clínica** com perfis (Super Admin, Admin da Clínica, Médico e Recepcionista), sem quebrar o fluxo legado de IA (`POST /api/v1/predict`) nem o health check (`GET /api/v1/health`).

Premissas desta fase:
- Foco em **planejamento e documentação**.
- **Sem implementação funcional** de módulos nesta etapa.
- Backend e frontend em repositórios separados.
- Contrato da API deve seguir o blueprint oficial do backend (`src/api/docs/backend_blueprint_mvp.md`, no repositório backend).
- Execução local (localhost) com dados segregados por clínica.

Objetivo de entrega: base técnica viável para implementação por 1 pessoa em ~1 mês, em ondas incrementais.

---

## 2. Decisões técnicas recomendadas

### Stack mantida
- Vue 3 (Composition API)
- Vite
- Tailwind CSS
- Axios

### Dependências complementares recomendadas (planejadas)
> **Não instalar nesta fase**, apenas recomendar.

- `vue-router`: roteamento por módulo/perfil.
- `pinia`: estado global (auth, sessão, clínica ativa, permissões, feedback global).
- Validação:
  - opção A: `zod` (schemas + parse seguro de payload);
  - opção B: `yup` + `vee-validate` (forms complexos).
- Ícones: `lucide-vue-next` (leve e consistente).
- Toast/feedback: `vue-sonner` ou `notiwind`.
- Datas/agenda: `dayjs`.
- Máscaras/input helpers: `maska` (CPF, telefone, CEP).

### Diretriz arquitetural
- Organizar por **domínio de negócio** (modules/features), não por tipo técnico isolado.
- API layer com separação: `http client` + `domain services` + `mapeadores/DTO`.
- Controle de acesso em três camadas:
  1. Guard de rota.
  2. Renderização de menu por permissão.
  3. Gating de ações (botões/operações).

---

## 3. Arquitetura frontend proposta

Arquitetura em camadas:

1. **App Core**
   - bootstrap, providers, router, stores globais, interceptors.
2. **Shell/Layout**
   - layouts por contexto (Auth, App, Super Admin, Clínica/Assistencial).
3. **Features por domínio**
   - auth, clinics, users, appointments, prontuários etc.
4. **Shared UI + Shared Logic**
   - componentes reutilizáveis, utilitários, composables, tipos, constants.
5. **Infra/API**
   - client Axios central, normalização de erros, retry controlado, integração auth.

Princípios:
- Tela não conversa direto com Axios bruto: usa service do domínio.
- Toda resposta crítica passa por normalização de erro.
- Tenant (clínica ativa) explícito em store e enviado conforme contrato (header ou path param, conforme backend blueprint).

---

## 4. Estrutura futura de pastas

```txt
src/
  app/
    main.js
    router/
      index.js
      guards.js
      route-meta.js
    providers/
    layouts/
      AuthLayout.vue
      AppLayout.vue
      SuperAdminLayout.vue
      ClinicLayout.vue
      DoctorLayout.vue
  shared/
    ui/
      table/
      form/
      modal/
      badge/
      feedback/
      calendar/
      uploader/
      empty-state/
      error-state/
      skeleton/
    components/
      PageHeader.vue
      PermissionGate.vue
      ConfirmDialog.vue
    composables/
      usePagination.js
      useFilters.js
      useDebouncedSearch.js
      useApiState.js
    utils/
      formatters.js
      validators.js
      permissions.js
      whatsapp.js
    constants/
      roles.js
      routes.js
      statuses.js
    types/
      api.js
      models.js
  services/
    http/
      client.js
      interceptors.js
      error-normalizer.js
    api/
      auth.service.js
      clinics.service.js
      units.service.js
      users.service.js
      doctors.service.js
      specialties.service.js
      patients.service.js
      appointments.service.js
      schedule-blocks.service.js
      records.service.js
      record-versions.service.js
      documents.service.js
      ai-analyses.service.js
      dashboards.service.js
      audit-logs.service.js
      profile.service.js
      health.service.js
    legacy/
      ai-legacy.service.js
  stores/
    auth.store.js
    session.store.js
    tenant.store.js
    permissions.store.js
    ui.store.js
  modules/
    auth/
    super-admin-dashboard/
    clinics/
    units/
    users/
    doctors/
    specialties/
    patients/
    appointments/
    schedule-blocks/
    medical-records/
    medical-record-audit/
    documents/
    ai-analyses/
    dashboards/
    audit-logs/
    profile/
    health/
  components/
    UploadZone.vue
    ResultView.vue
  App.vue
```

---

## 5. Mapa de rotas por perfil

### Públicas
- `/login`
- `/health` (visualização técnica/status da API para suporte local)

### Autenticadas (base)
- `/app/profile`
- `/app/settings` (opcional no MVP, pode consolidar em profile)

### Super Admin
- `/super-admin/dashboard`
- `/super-admin/clinics`
- `/super-admin/clinics/:clinicId`
- `/super-admin/audit-logs` (globais)

### Admin da Clínica
- `/clinic/dashboard`
- `/clinic/units`
- `/clinic/users`
- `/clinic/doctors`
- `/clinic/specialties`
- `/clinic/patients`
- `/clinic/appointments`
- `/clinic/schedule-blocks`
- `/clinic/medical-records`
- `/clinic/documents`
- `/clinic/ai-analyses`
- `/clinic/audit-logs`

### Médico
- `/doctor/dashboard`
- `/doctor/my-patients`
- `/doctor/all-patients`
- `/doctor/appointments`
- `/doctor/schedule-blocks`
- `/doctor/care/:appointmentId` (atendimento)
- `/doctor/medical-records/:patientId`
- `/doctor/ai-analyses`

### Recepcionista
- `/clinic/patients`
- `/clinic/appointments`
- `/clinic/appointments/:id`
- `/clinic/whatsapp-reminders`

### Rotas de suporte
- `/forbidden` (403)
- `/not-found` (404)

Meta sugerida por rota:
- `requiresAuth`
- `rolesAllowed`
- `permissionsRequired`
- `tenantRequired`

---

## 6. Layouts e navegação

### Layouts
- **AuthLayout**: login/recuperação de acesso.
- **AppLayout**: estrutura base autenticada (header, breadcrumbs, sessão).
- **SuperAdminLayout**: menu focado em governança global.
- **ClinicLayout**: operações clínicas/administrativas locais.
- **DoctorLayout**: foco assistencial e produtividade médica.

### Sidebar por perfil (resumo)
- **Super Admin**: Dashboard, Clínicas, Logs Globais, Perfil.
- **Admin Clínica**: Dashboard Clínica, Unidades, Usuários, Médicos, Especialidades, Pacientes, Agenda, Prontuários, Documentos, IA, Logs, Perfil.
- **Médico**: Dashboard Médico, Meus Pacientes, Todos Pacientes, Agenda, Bloqueios, Atendimento, Prontuários, IA, Perfil.
- **Recepcionista**: Pacientes, Agenda/Consultas, Lembretes WhatsApp, Perfil.

Observação crítica de regra de negócio:
- Recepcionista sem acesso a prontuários sensíveis, diagnósticos, documentos médicos e resultados IA.

---

## 7. Estratégia de autenticação

Fluxo recomendado:
1. Login (`POST /auth/login` planejado no backend) retorna `accessToken`, `refreshToken`, dados do usuário/perfil/tenant.
2. Armazenamento:
   - `accessToken`: memória + persistência controlada (sessionStorage).
   - `refreshToken`: preferir cookie HttpOnly se backend suportar; fallback localStorage apenas em ambiente local de desenvolvimento.
3. Interceptor request:
   - injeta `Authorization: Bearer <token>`.
   - injeta contexto de clínica ativa conforme contrato (header ex.: `X-Clinic-Id`).
4. Interceptor response:
   - em 401 tenta refresh uma vez.
   - se refresh falhar: logout forçado + redirect `/login` + aviso "Sessão expirada".
5. Logout:
   - invalida sessão no backend (se endpoint existir).
   - limpa stores e caches locais.

Compatibilidade legado:
- `predict` e `health` atuais devem continuar operando sem regressão durante transição.

---

## 8. Estratégia de autorização

### Regras
- RBAC base por perfil + permissões granulares por ação.

### Implementação frontend
- **Route Guards**:
  - bloqueia acesso por perfil/permissão.
  - redireciona para `/forbidden`.
- **Menu dinâmico**:
  - itens renderizados por `canView(module)`.
- **Action Gates**:
  - botões (editar, excluir, ver IA, ver prontuário) condicionados por `can(action, resource)`.
- **Fail-safe UI**:
  - nunca confiar só no frontend; tratar 403 da API com feedback claro.

### Casos mandatórios
- Recepcionista: sem leitura de IA/prontuário/documentos sensíveis.
- Médico: pode ver prontuário e IA.
- Admin Clínica: visão total do tenant.
- Super Admin: visão global cross-clinic.

---

## 9. Estado global

Stores mínimas (Pinia):
- `auth.store`: tokens, login status, timestamps de sessão.
- `session.store`: usuário autenticado, perfil, CRM (quando médico), preferências.
- `tenant.store`: clínica ativa, unidade ativa, contexto de escopo.
- `permissions.store`: matriz de permissões resolvida no login.
- `ui.store`: loading global, toasts, modal global, erros não tratados.

Estados transversais:
- `isBootstrappingApp`
- `isRefreshingToken`
- `globalError`
- `connectivityStatus`

---

## 10. Módulos/telas por domínio

> Endpoints abaixo devem ser ajustados ao contrato final do backend blueprint.

### 10.1 Auth
- Objetivo: autenticar, manter sessão, encerrar sessão.
- Perfis: todos internos.
- Componentes: LoginForm, PasswordField, SessionBanner.
- Endpoints: `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me`.
- Estados: loading submit, erro credencial, sessão expirada.
- Ações: entrar, sair, renovar sessão.

### 10.2 Dashboard Super Admin
- Objetivo: visão macro da plataforma.
- Perfis: Super Admin.
- Componentes: KPI cards, tabela de clínicas, alertas operacionais.
- Endpoints: `/super-admin/dashboard`, `/clinics`.
- Ações: abrir clínica, ativar/desativar clínica.

### 10.3 Clinics
- Objetivo: CRUD de clínicas e dados institucionais.
- Perfis: Super Admin.
- Componentes: ClinicsTable, ClinicForm, StatusBadge.
- Endpoints: `/clinics`, `/clinics/:id`.
- Ações: criar/editar/listar/detalhar.

### 10.4 Units
- Objetivo: gerenciar unidades de cada clínica.
- Perfis: Admin Clínica.
- Componentes: UnitTable, UnitForm, AddressFields.
- Endpoints: `/units`.
- Ações: CRUD, ativar/inativar.

### 10.5 Users
- Objetivo: gestão de usuários internos (admin/med/recepção).
- Perfis: Admin Clínica.
- Componentes: UserTable, RoleSelect, ResetAccessModal.
- Endpoints: `/users`, `/users/:id`.
- Ações: criar, editar perfil, bloquear acesso.

### 10.6 Doctors
- Objetivo: cadastro de médicos e vínculo com especialidades/unidades.
- Perfis: Admin Clínica.
- Componentes: DoctorForm (CRM obrigatório), SpecialtyPicker.
- Endpoints: `/doctors`, `/doctors/:id`.
- Ações: CRUD, vincular especialidade.

### 10.7 Specialties
- Objetivo: catálogo de especialidades médicas.
- Perfis: Admin Clínica.
- Componentes: SpecialtyTable/Form.
- Endpoints: `/specialties`.
- Ações: CRUD.

### 10.8 Patients
- Objetivo: cadastro e manutenção de pacientes.
- Perfis: Admin Clínica, Recepcionista, Médico (leitura conforme regra).
- Componentes: PatientForm, PatientTable, PatientSummaryCard.
- Endpoints: `/patients`, `/patients/:id`.
- Ações: cadastrar, editar, buscar.
- Campos obrigatórios: nome, CPF, endereço, CEP, telefone, nascimento, tipo sanguíneo, e-mail, estado civil.

### 10.9 Appointments
- Objetivo: agenda clínica baseada em médico.
- Perfis: Admin Clínica, Recepcionista, Médico (escopo próprio).
- Componentes: CalendarView, AppointmentForm, StatusBadge.
- Endpoints: `/appointments`, `/appointments/:id`.
- Ações: agendar, remarcar, cancelar, confirmar.

### 10.10 Schedule Blocks
- Objetivo: bloqueios de agenda por médico.
- Perfis: Médico (próprio), Admin Clínica (geral).
- Componentes: BlockForm, Timeline/Calendar overlay.
- Endpoints: `/schedule-blocks`.
- Ações: bloquear/desbloquear horários.

### 10.11 Medical Records
- Objetivo: prontuário dermatológico estruturado.
- Perfis: Médico, Admin Clínica.
- Componentes: RecordEditor, SOAP-like sections, PatientHeader.
- Endpoints: `/medical-records`, `/medical-records/:id`.
- Campos: identificação, anamnese, exame físico, hipóteses, diagnóstico, conduta, prescrição/orientações, exames solicitados, evolução, data/hora, médico, CRM.
- Ações: criar/editar/consultar.

### 10.12 Medical Record Versions/Audit
- Objetivo: histórico/versionamento de alterações.
- Perfis: Médico, Admin Clínica.
- Componentes: VersionTimeline, DiffViewer.
- Endpoints: `/medical-records/:id/versions`, `/medical-records/:id/audit`.
- Ações: comparar versões, rastrear autoria.

### 10.13 Documents/Attachments
- Objetivo: anexar e consultar exames/documentos.
- Perfis: Médico, Admin Clínica.
- Componentes: FileUploader, DocumentList, PreviewModal.
- Endpoints: `/documents`, `/documents/:id`.
- Ações: upload, download, associação ao paciente/prontuário.

### 10.14 AI Analyses
- Objetivo: gerir análises de IA associadas ao cuidado clínico.
- Perfis: Médico, Admin Clínica.
- Componentes: LegacyUploadAdapter, AIResultViewer, AnalysisHistoryTable.
- Endpoints: legado `/predict`; futuro `/ai-analyses`, `/ai-analyses/:id`.
- Ações: enviar imagem, registrar vínculo com paciente/prontuário, revisar histórico.

### 10.15 Dashboards
- Objetivo: dashboards separados por perfil assistencial/gerencial.
- Perfis: Admin Clínica, Médico.
- Componentes: KPI cards, gráficos simples, listas operacionais.
- Endpoints: `/dashboards/clinic`, `/dashboards/doctor`.

### 10.16 Audit Logs
- Objetivo: rastreabilidade LGPD e auditoria operacional.
- Perfis: Admin Clínica, Super Admin (global).
- Componentes: AuditPanel, FilterBar, ExportAction (futuro).
- Endpoints: `/audit-logs`.

### 10.17 Profile/Settings
- Objetivo: dados de conta e preferências.
- Perfis: todos.
- Componentes: ProfileForm, PasswordChangeForm.
- Endpoints: `/profile`, `/profile/password`.

### 10.18 Health/Status
- Objetivo: status técnico local do backend.
- Perfis: autenticados (ou público técnico local).
- Componentes: HealthCard.
- Endpoints: legado `/health`.

---

## 11. Componentes reutilizáveis

- Tabelas: paginação, ordenação, filtro server-side.
- Cards/KPIs: indicadores por contexto.
- Formulários: Field wrapper, validação, máscaras.
- Modais: confirmação, edição rápida, anexos.
- Badges: status (ativo, confirmado, cancelado, bloqueado).
- Calendário/agenda: visão dia/semana por médico.
- Upload arquivos: drag-and-drop com validação tipo/tamanho.
- Visualizador IA: probabilidade, classificação, recomendação + disclaimer.
- Timeline prontuário: evolução e versões.
- Painel auditoria: filtros por usuário, data, ação, recurso.

---

## 12. Padrão de consumo da API

### Organização
- `services/http/client.js`: instância Axios.
- `services/http/interceptors.js`: auth, tenant, retry refresh.
- `services/api/*.service.js`: funções por domínio.

### DTO/modelos frontend
- Modelos normalizados por domínio (`PatientModel`, `AppointmentModel`, `MedicalRecordModel`).
- Mapear snake_case↔camelCase em borda de API.

### Erros
- Normalizador único:
  - `code`, `message`, `details`, `fieldErrors`, `status`.
- UI decide feedback: toast, inline error, modal.

### Paginação/filtros/busca
- Convenção padrão:
  - query params: `page`, `pageSize`, `search`, `sortBy`, `sortDir`, filtros específicos.
- Composable `usePagination/useFilters` para consistência.

---

## 13. Tratamento de erros/loading/empty states

Padrões obrigatórios:
- Loading:
  - skeleton para listas;
  - botão com estado de submissão em forms;
  - bloqueio de duplo submit.
- Empty:
  - CTA claro (“Cadastrar primeiro paciente”, “Criar primeiro bloqueio”).
- Error:
  - erro recuperável com botão “Tentar novamente”;
  - 401: sessão expirada;
  - 403: acesso negado contextual;
  - 500: mensagem amigável + log técnico no console em dev.

---

## 14. Estratégia de reaproveitamento do fluxo atual de IA

Componentes existentes:
- `UploadZone.vue`
- `ResultView.vue`
- `src/services/api.js`
- `App.vue`

Plano de reaproveitamento:
1. **Congelar comportamento atual** como fluxo legado funcional.
2. Extrair `predict`/`health` para camada `services/legacy/ai-legacy.service.js` (mantendo assinatura inicial).
3. Encapsular `UploadZone` e `ResultView` como `LegacyAIAnalysisWidget` para uso em nova tela `AI Analyses`.
4. Evoluir `ResultView` para suportar metadados de vínculo (paciente, consulta, prontuário) sem remover exibição atual.
5. `App.vue` evolui para host de router gradualmente, preservando rota/entry de demonstração até migração completa.

---

## 15. UX do WhatsApp com mensagem pronta

Fluxo recepção:
1. Em consulta/agendamento, botão “Enviar lembrete”.
2. Modal com pré-visualização da mensagem (template editável leve).
3. Ação abre `https://wa.me/<telefone>?text=<mensagem-encodada>`.

Template sugerido:
- Saudação + nome paciente.
- Data/hora consulta.
- Médico/unidade.
- Instruções curtas (chegar com antecedência).
- Aviso de contato da clínica.

Regras:
- Telefone validado/máscara.
- Log de evento “lembrete iniciado” (quando endpoint existir).
- Sem envio automático por API nesta fase (somente deep link/manual).

---

## 16. Direção visual/UI

Diretriz clínica:
- Limpo, profissional, confiável.
- Contraste e legibilidade altos.
- Hierarquia visual clara para reduzir erro operacional.

Recomendação:
- Base neutra (brancos/cinzas) + cor de destaque dermatologia (azul/teal suave).
- Tipografia sem serifa legível.
- Componentes padronizados para tabelas/formulários.
- Densidade equilibrada para uso intenso por recepção e médico.
- Feedbacks visuais explícitos para ações críticas.

---

## 17. Ordem recomendada de implementação (1 mês / 1 dev)

### Semana 1
- Infra base: router, layouts, stores, interceptors, guards, estrutura de pastas.
- Auth básico + perfil/sessão + página Forbidden.

### Semana 2
- Cadastros core: Clinics (se necessário para fluxo SA), Units, Users, Doctors, Specialties.
- Pacientes (CRUD + validações obrigatórias).

### Semana 3
- Agenda/Appointments + Schedule Blocks.
- WhatsApp reminder UX.
- Dashboards iniciais (cards e listas simples).

### Semana 4
- Prontuário + versões/auditoria.
- Documentos/anexos.
- Integração IA no módulo AI Analyses reaproveitando legado.
- Hardening final: erros, empty states, permissões finas, health/status.

---

## 18. Riscos técnicos

- Divergência entre contrato backend planejado e endpoints realmente entregues.
- Complexidade de autorização fina por perfil/ação.
- Versionamento de prontuário exigir payloads complexos.
- Upload de documentos/imagens com tamanhos variados.
- Gestão de tenant (clínica ativa) inconsistente sem contrato claro.
- Escopo excessivo para 1 dev em 1 mês sem priorização incremental.

Mitigação:
- Versionar contrato (OpenAPI/blueprint backend).
- Definir “MVP do MVP” por sprint.
- Feature flags simples para módulos incompletos.

---

## 19. O que preservar

- Fluxo atual de IA funcional (upload + resultado).
- Endpoints legados `/predict` e `/health`.
- Stack atual e estilo visual base já existente.
- Simplicidade de setup local.

---

## 20. O que evitar

- Refatoração total “big bang”.
- Acoplamento tela↔Axios sem camada de domínio.
- Permissão apenas visual (sem guard + tratamento 403).
- Misturar regra de negócio clínica em componentes genéricos.
- Introduzir financeiro/procedimentos/pacotes (fora de escopo).

---

## 21. Evolução frontend x backend sem quebra de contrato

Práticas recomendadas:
- Consumir endpoints via services versionados por domínio.
- Manter `legacy services` para rotas antigas até depreciação oficial.
- Usar adaptadores de resposta (mapper DTO) para absorver pequenas mudanças no backend.
- Testes de contrato básicos no frontend (mock/schema).
- Checklist de release: contrato alterado => atualizar service + mapper + guards.
- Comunicação explícita de breaking changes com versão de API.

---

## 22. Próxima fase sugerida

1. Validar este blueprint contra o documento backend oficial.
2. Consolidar matriz RBAC (perfil x ação x módulo) em tabela objetiva.
3. Definir contrato mínimo de auth/tenant/permissões com exemplos JSON.
4. Criar issue breakdown por semana (sequência da seção 17).
5. Iniciar implementação incremental preservando fluxo legado de IA.

