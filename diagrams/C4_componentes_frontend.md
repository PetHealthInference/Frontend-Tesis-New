# Diagrama C4 — Nivel 3: Componentes del Frontend

## Descripción

Detalla los componentes internos de la Aplicación Web (SPA). La arquitectura separa responsabilidades en: páginas (orquestación de UI), servicios (clientes HTTP), hooks (estado compartido) y guardias de ruta (control de acceso). El flujo clínico más relevante es `ClinicalEvaluationPage`, que concentra el ingreso de hechos y la visualización de resultados de inferencia.

---

## Componentes — Páginas (Pages)

### Módulo de Autenticación

| Componente | Tipo | Responsabilidad | Ubicación |
|---|---|---|---|
| LoginPage | Página | Formulario de autenticación con credenciales; almacena JWT en localStorage al autenticar | `src/pages/auth/LoginPage.tsx` |
| ResetPasswordPage | Página | Formulario de restablecimiento de contraseña usando token de un solo uso recibido por email | `src/pages/auth/ResetPasswordPage.tsx` |

### Módulo de Gestión Clínica

| Componente | Tipo | Responsabilidad | Ubicación |
|---|---|---|---|
| PatientsPage | Página | Listado paginado y búsqueda de pacientes | `src/pages/patients/PatientsPage.tsx` |
| PatientDetailPage | Página | Vista de detalle de paciente: datos, especie, raza y acceso a historial clínico | `src/pages/patients/PatientDetailPage.tsx` |
| PatientFormPage | Página | Formulario de creación y edición de paciente (valida consistencia especie/raza) | `src/pages/patients/PatientFormPage.tsx` |
| OwnersPage | Página | Listado paginado y búsqueda de propietarios | `src/pages/owners/OwnersPage.tsx` |
| OwnerDetailPage | Página | Vista de detalle de propietario con lista de pacientes asociados | `src/pages/owners/OwnerDetailPage.tsx` |
| OwnerFormPage | Página | Formulario de creación y edición de propietario; incluye selector de ubigeo peruano (departamento, provincia, distrito) | `src/pages/owners/OwnerFormPage.tsx` |

### Módulo de Evaluación e Inferencia

| Componente | Tipo | Responsabilidad | Ubicación |
|---|---|---|---|
| ClinicalEvaluationPage | Página principal | Flujo completo de evaluación clínica: selección de paciente, ingreso de hechos (síntomas y variables clínicas), ejecución del motor de inferencia y visualización de resultados | `src/pages/evaluations/ClinicalEvaluationPage.tsx` |
| ResultsPage | Página | Visualización de resultados de inferencia almacenados: diagnósticos, nivel de riesgo y reglas activadas | `src/pages/results/ResultsPage.tsx` |
| HistoryPage | Página | Historial clínico global de todos los pacientes | `src/pages/history/HistoryPage.tsx` |
| PatientHistoryPage | Página | Historial clínico detallado de un paciente específico en línea de tiempo | `src/pages/history/PatientHistoryPage.tsx` |
| KnowledgeBasePage | Página | Consulta de la base de conocimiento: fuentes académicas y referencias de reglas | `src/pages/knowledge/KnowledgeBasePage.tsx` |

### Módulo de Administración

| Componente | Tipo | Responsabilidad | Ubicación |
|---|---|---|---|
| DashboardPage | Página | Panel de estadísticas del sistema con gráficos (Recharts) | `src/pages/dashboard/DashboardPage.tsx` |
| RulesAdminPage | Página (solo admin) | Administración de reglas de inferencia: creación, edición y gestión de condiciones | `src/pages/rules/RulesAdminPage.tsx` |
| SettingsPage | Página | Configuración de cuenta del usuario autenticado: datos personales y cambio de contraseña | `src/pages/settings/SettingsPage.tsx` |

---

## Componentes — Servicios API (Clientes HTTP)

| Componente | Tipo | Endpoints consumidos | Ubicación |
|---|---|---|---|
| api.ts | Cliente HTTP base | Instancia Axios con `VITE_API_BASE_URL`; interceptor de request inyecta `Authorization: Bearer {jwt}`; interceptor de response maneja 401 con logout automático | `src/services/api.ts` |
| auth.service.ts | Servicio API | `POST /auth/login`, `POST /auth/refresh`, `GET /auth/me`, `PATCH /auth/change-password`, `POST /auth/forgot-password`, `POST /auth/reset-password` | `src/services/auth.service.ts` |
| patient.service.ts | Servicio API | `GET /patients`, `POST /patients`, `GET /patients/{id}`, `PUT /patients/{id}` | `src/services/patient.service.ts` |
| owner.service.ts | Servicio API | `GET /owners`, `POST /owners`, `GET /owners/{id}`, `PUT /owners/{id}`, `DELETE /owners/{id}` | `src/services/owner.service.ts` |
| evaluation.service.ts | Servicio API | `POST /evaluations`, `GET /evaluation-facts`, `POST /inference/run`, `POST /inference/evaluations/{id}/run` | `src/services/evaluation.service.ts` |
| history.service.ts | Servicio API | `GET /history`, `GET /patients/{id}/history` | `src/services/history.service.ts` |
| knowledge.service.ts | Servicio API | Endpoints de base de conocimiento | `src/services/knowledge.service.ts` |
| user.service.ts | Servicio API | `GET /users`, `POST /users`, `GET /users/{id}`, `PUT /users/{id}` | `src/services/user.service.ts` |
| dashboard.service.ts | Servicio API | Endpoints de estadísticas para el dashboard | `src/services/dashboard.service.ts` |
| emailjs.service.ts | Servicio externo | Envío de correo de recuperación de contraseña vía SDK EmailJS (modo alternativo al SMTP del backend) | `src/services/emailjs.service.ts` |

---

## Componentes — Hooks de Estado

| Componente | Tipo | Responsabilidad | Ubicación |
|---|---|---|---|
| useAuth | Hook personalizado | Estado de autenticación global mediante `useSyncExternalStore`; expone usuario actual, rol y funciones de login/logout; sincroniza con `storage.ts` | `src/hooks/useAuth.ts` |
| useEvaluationFacts | Hook personalizado | Estado local de hechos clínicos durante el flujo de evaluación; gestiona ingreso, edición y eliminación de facts antes de enviar al motor de inferencia | `src/hooks/useEvaluationFacts.ts` |

---

## Componentes — Seguridad y Enrutamiento

| Componente | Tipo | Responsabilidad | Ubicación |
|---|---|---|---|
| router.tsx | Configuración de rutas | Define árbol de rutas con React Router 7; envuelve rutas protegidas en guardias | `src/app/router.tsx` |
| ProtectedRoute | Guardia de ruta | Verifica sesión activa; redirige a `/login` si no hay JWT válido | `src/components/route/ProtectedRoute.tsx` |
| AdminRoute | Guardia de ruta | Verifica que el usuario autenticado tenga rol `admin`; redirige si no | `src/components/route/AdminRoute.tsx` |
| storage.ts | Utilidad | Lectura y escritura del JWT en `localStorage`; punto único de acceso al token | `src/utils/storage.ts` |

---

## Componentes — Layout

| Componente | Tipo | Responsabilidad | Ubicación |
|---|---|---|---|
| AppLayout | Layout principal | Contenedor de la aplicación autenticada: combina Sidebar y Topbar con el área de contenido | `src/components/layout/AppLayout.tsx` |
| Sidebar | Navegación lateral | Muestra enlaces de navegación según el rol del usuario autenticado; usa `config/routes.ts` | `src/components/layout/Sidebar.tsx` |
| Topbar | Barra superior | Muestra usuario activo y acceso a logout | `src/components/layout/Topbar.tsx` |

---

## Componentes — Evaluación Clínica (Específicos del Dominio)

| Componente | Tipo | Responsabilidad | Ubicación |
|---|---|---|---|
| EvaluationFactsPanel | Panel de evaluación | Interfaz para ingresar hechos clínicos: síntomas observados y valores de variables clínicas (temperatura, glucosa, etc.) | `src/components/evaluations/EvaluationFactsPanel.tsx` |
| EvaluationResultsPanel | Panel de resultados | Visualización de enfermedades inferidas con score, probabilidad Bayesiana y nivel de riesgo | `src/components/evaluations/EvaluationResultsPanel.tsx` |
| ActivatedRulesPanel | Panel de reglas | Muestra las reglas IF-THEN que se activaron durante la inferencia, con justificación de cada condición evaluada | `src/components/evaluations/ActivatedRulesPanel.tsx` |
| HistoryTimeline | Línea de tiempo | Visualización cronológica del historial clínico del paciente: evaluaciones previas y resultados | `src/components/evaluations/HistoryTimeline.tsx` |
| ForgotPasswordForm | Formulario auth | Formulario de solicitud de recuperación de contraseña; dispara envío vía EmailJS o redirige al flujo SMTP | `src/components/auth/ForgotPasswordForm.tsx` |
| PatientForm | Formulario | Campos de paciente: nombre, especie, raza, fecha de nacimiento, peso, sexo | `src/components/patients/PatientForm.tsx` |
| OwnerForm | Formulario | Campos de propietario con selector jerárquico de ubigeo peruano (departamento → provincia → distrito) | `src/components/owners/OwnerForm.tsx` |

---

## Relaciones entre Componentes

| Origen | Destino | Relación |
|---|---|---|
| router.tsx | ProtectedRoute | Todas las rutas autenticadas pasan por este guardia |
| router.tsx | AdminRoute | Rutas de administración (`/rules`) pasan por este guardia adicional |
| ProtectedRoute | useAuth | Consulta si hay sesión activa |
| AdminRoute | useAuth | Consulta rol del usuario autenticado |
| useAuth | storage.ts | Lee y escribe JWT en localStorage |
| AppLayout | Sidebar | Renderiza navegación lateral |
| AppLayout | Topbar | Renderiza barra superior |
| Sidebar | config/routes.ts | Construye navegación desde configuración de rutas y rol activo |
| ClinicalEvaluationPage | useEvaluationFacts | Gestiona estado local de hechos durante la evaluación |
| ClinicalEvaluationPage | EvaluationFactsPanel | Renderiza panel de ingreso de hechos clínicos |
| ClinicalEvaluationPage | EvaluationResultsPanel | Renderiza resultados de inferencia tras ejecutar el motor |
| ClinicalEvaluationPage | ActivatedRulesPanel | Renderiza justificación de reglas activadas |
| ClinicalEvaluationPage | evaluation.service.ts | `POST /evaluations` y `POST /inference/run` |
| PatientHistoryPage | HistoryTimeline | Renderiza línea de tiempo del historial del paciente |
| PatientHistoryPage | history.service.ts | `GET /patients/{id}/history` |
| OwnerFormPage | OwnerForm | Renderiza formulario con selector ubigeo |
| PatientFormPage | PatientForm | Renderiza formulario de paciente |
| ResetPasswordPage | ForgotPasswordForm | Incluye formulario de solicitud de reset |
| ForgotPasswordForm | emailjs.service.ts | Envía correo vía EmailJS SDK (modo alternativo) |
| Todos los servicios API | api.ts | Cliente HTTP base con JWT Bearer |
| api.ts | API REST (Backend) | HTTPS / REST / JSON con JWT Bearer |

---

## Representación Textual

```
Aplicación Web SPA (React 19 + TypeScript + Vite)
│
├── router.tsx (React Router 7)
│   ├── ProtectedRoute ──> consulta ──> useAuth ──> storage.ts (localStorage JWT)
│   └── AdminRoute ─────> consulta ──> useAuth (verifica rol admin)
│
├── AppLayout
│   ├── Sidebar ──> config/routes.ts (navegación por rol)
│   └── Topbar  ──> useAuth (muestra usuario activo)
│
├── [Módulo Autenticación]
│   ├── LoginPage
│   │   └── usa ──> auth.service.ts ──> api.ts ──> POST /auth/login
│   └── ResetPasswordPage
│       ├── ForgotPasswordForm ──> emailjs.service.ts ──> [EmailJS]
│       └── usa ──> auth.service.ts ──> api.ts ──> POST /auth/reset-password
│
├── [Módulo Gestión Clínica]
│   ├── PatientsPage / PatientDetailPage / PatientFormPage
│   │   ├── PatientForm (formulario reutilizable)
│   │   └── usa ──> patient.service.ts ──> api.ts ──> /patients
│   │
│   └── OwnersPage / OwnerDetailPage / OwnerFormPage
│       ├── OwnerForm (selector ubigeo peruano embebido)
│       └── usa ──> owner.service.ts ──> api.ts ──> /owners
│
├── [Módulo Evaluación e Inferencia]  [flujo principal de la tesis]
│   ├── ClinicalEvaluationPage
│   │   ├── useEvaluationFacts ──── estado local de hechos clínicos
│   │   ├── EvaluationFactsPanel ── ingreso de síntomas y variables
│   │   ├── EvaluationResultsPanel ─ resultados: diagnóstico + riesgo + probabilidad
│   │   ├── ActivatedRulesPanel ─── justificación de reglas IF-THEN activadas
│   │   └── usa ──> evaluation.service.ts ──> api.ts
│   │                   ├── POST /evaluations
│   │                   └── POST /inference/run
│   │
│   ├── ResultsPage
│   │   └── usa ──> evaluation.service.ts ──> api.ts ──> /results/{id}
│   │
│   ├── HistoryPage / PatientHistoryPage
│   │   ├── HistoryTimeline (línea de tiempo)
│   │   └── usa ──> history.service.ts ──> api.ts ──> /history
│   │
│   └── KnowledgeBasePage
│       └── usa ──> knowledge.service.ts ──> api.ts
│
├── [Módulo Administración]
│   ├── DashboardPage
│   │   └── usa ──> dashboard.service.ts ──> api.ts (gráficos Recharts)
│   ├── RulesAdminPage  [solo AdminRoute]
│   │   └── usa ──> api.ts ──> /rules (CRUD de reglas)
│   └── SettingsPage
│       └── usa ──> user.service.ts ──> api.ts ──> /auth/change-password
│
└── api.ts (Axios — cliente HTTP base)
    ├── baseURL: VITE_API_BASE_URL (variable de entorno Vite)
    ├── interceptor request: Authorization: Bearer {jwt desde localStorage}
    ├── interceptor response 401: logout automático + redirect a /login
    └── ──────────> [API REST FastAPI en backend]
```

---

## Tipos TypeScript Principales

| Tipo | Descripción | Ubicación |
|---|---|---|
| `AuthState` | Estado de sesión: usuario, token, rol | `src/types/auth.ts` |
| `Patient` | Datos de paciente con especie y raza | `src/types/patient.ts` |
| `Owner` | Datos de propietario con campos ubigeo | `src/types/owner.ts` |
| `EvaluationFact` | Hecho clínico ingresado por el veterinario | `src/types/evaluation.ts` |
| `InferenceResultOut` | Resultado de inferencia: enfermedad + score + riesgo | `src/types/evaluation.ts` |
| `ActivatedRule` | Regla activada con justificación de condiciones | `src/types/evaluation.ts` |
| `DashboardStats` | Estadísticas agregadas para el panel | `src/types/dashboard.ts` |
| `KnowledgeSource` | Fuente académica de la base de conocimiento | `src/types/knowledge.ts` |
