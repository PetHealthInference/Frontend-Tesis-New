# Diagrama C4 — Nivel 3: Componentes del Backend

## Descripción

Detalla los componentes internos del backend (API REST + Motor de Inferencia). La arquitectura sigue un patrón en capas: **Routers → Services → Repositories → Base de Datos**, con un módulo de inferencia especializado que combina reglas IF-THEN y cálculo Bayesiano.

---

## Componentes — Capa Core

| Componente | Tipo | Responsabilidad | Ubicación |
|---|---|---|---|
| Config | Módulo configuración | Carga de variables de entorno vía Pydantic BaseSettings; expone ajustes de JWT, BD, email, inferencia | `app/core/config.py` |
| Database | Módulo BD | Gestión de sesión SQLAlchemy, engine de conexión y ciclo de vida de la aplicación | `app/core/database.py` |
| Security | Módulo seguridad | Generación y verificación de tokens JWT (HS256), hashing de contraseñas (bcrypt via passlib) | `app/core/security.py` |
| Permissions | Módulo RBAC | Decoradores `require_policy(roles)` para restricción de acceso por rol en cada endpoint | `app/core/permissions.py` |
| Exceptions | Manejadores de error | Respuestas HTTP estandarizadas (JSON) para errores de dominio (404, 403, 422, 409) | `app/core/exceptions.py` |

---

## Componentes — Capa de Routers (Controladores)

| Componente | Tipo | Endpoints principales | Ubicación |
|---|---|---|---|
| AuthRouter | Router FastAPI | `POST /auth/login`, `POST /auth/refresh`, `GET /auth/me`, `PATCH /auth/change-password`, `POST /auth/forgot-password`, `POST /auth/reset-password` | `app/api/v1/routers/auth.py` |
| UsersRouter | Router FastAPI | `GET /users`, `POST /users`, `GET /users/{id}`, `PUT /users/{id}` | `app/api/v1/routers/users.py` |
| OwnersRouter | Router FastAPI | `POST /owners`, `GET /owners`, `GET /owners/{id}`, `PUT /owners/{id}`, `DELETE /owners/{id}` | `app/api/v1/routers/owners.py` |
| PatientsRouter | Router FastAPI | `GET /patients`, `POST /patients`, `GET /patients/{id}`, `PUT /patients/{id}`, `GET /patients/{id}/history` | `app/api/v1/routers/patients.py` |
| EvaluationsRouter | Router FastAPI | `POST /evaluations`, `GET /evaluations`, `GET /evaluation-facts?species_id`, `GET /evaluation-symptoms?species_id`, `GET /evaluation-clinical-variables?species_id` | `app/api/v1/routers/evaluations.py` |
| InferenceRouter | Router FastAPI | `POST /inference/run`, `POST /inference/evaluations/{id}/run` | `app/api/v1/routers/inference.py` |
| ResultsRouter | Router FastAPI | `GET /results/{id}`, `GET /results/{id}/activated-rules` | `app/api/v1/routers/results.py` |
| RulesRouter | Router FastAPI | `GET /rules`, `POST /rules`, `GET /rules/{id}`, `PUT /rules/{id}` | `app/api/v1/routers/rules.py` |
| HistoryRouter | Router FastAPI | `GET /history` | `app/api/v1/routers/history.py` |
| CatalogRouters | Routers FastAPI (agrupados) | `GET /species`, `GET /breeds`, `GET /diseases`, `GET /symptoms`, `GET /clinical-variables`, `GET /risk-levels` | `app/api/v1/routers/` |

---

## Componentes — Capa de Servicios (Lógica de Negocio)

| Componente | Tipo | Responsabilidad | Ubicación |
|---|---|---|---|
| AuthService | Servicio | Autenticación JWT, generación y validación de tokens de reset de un uso, delegación de envío de email | `app/services/auth_service.py` |
| UserService | Servicio | CRUD de usuarios, cambio de contraseña con verificación | `app/services/user_service.py` |
| OwnerService | Servicio | CRUD de propietarios con campos ubigeo peruano (departamento, provincia, distrito) | `app/services/owner_service.py` |
| PatientService | Servicio | CRUD de pacientes, validación de consistencia especie/raza | `app/services/patient_service.py` |
| EvaluationService | Servicio | Creación de evaluaciones clínicas, registro de hechos (facts) por evaluación | `app/services/evaluation_service.py` |
| InferenceService | Servicio orquestador | Carga reglas activas por especie, invoca InferenceEngine y BayesService, persiste resultados e reglas activadas | `app/services/inference_service.py` |
| BayesService | Servicio | Cálculo de probabilidades Bayesianas sobre enfermedades usando priors clínicos almacenados | `app/services/bayes_service.py` |
| RuleService | Servicio | CRUD de reglas de inferencia y sus condiciones asociadas | `app/services/rule_service.py` |
| EmailService | Servicio | Envío de correo de recuperación de contraseña vía SMTP (modo backend) | `app/services/email_service.py` |
| HistoryService | Servicio | Consulta del historial clínico de pacientes con paginación | `app/services/history_service.py` |
| CatalogService | Servicio | Consulta de catálogos de solo lectura: enfermedades, síntomas, variables, niveles de riesgo | `app/services/catalog_service.py` |
| BootstrapService | Servicio startup | Carga de datos semilla desde `clinical_reference_data.json` al iniciar la aplicación | `app/services/bootstrap_service.py` |

---

## Componentes — Capa de Repositorios (Acceso a Datos)

| Componente | Tipo | Tablas accedidas | Ubicación |
|---|---|---|---|
| BaseRepository | Repositorio base | Operaciones CRUD genéricas sobre SQLAlchemy Session | `app/repositories/base.py` |
| UserRepository | Repositorio | `users` | `app/repositories/user_repository.py` |
| OwnerRepository | Repositorio | `owners` | `app/repositories/owner_repository.py` |
| PatientRepository | Repositorio | `patients` | `app/repositories/patient_repository.py` |
| EvaluationRepository | Repositorio | `evaluations`, `evaluation_facts` | `app/repositories/evaluation_repository.py` |
| RuleRepository | Repositorio | `inference_rules`, `rule_conditions` | `app/repositories/rule_repository.py` |
| ResultRepository | Repositorio | `inference_results`, `activated_rules` | `app/repositories/result_repository.py` |
| ClinicalProbabilityRepository | Repositorio | `clinical_probabilities` (priors Bayesianos) | `app/repositories/clinical_probability_repository.py` |
| HistoryRepository | Repositorio | `clinical_history` | `app/repositories/history_repository.py` |
| CatalogRepository | Repositorio | `species`, `breeds`, `diseases`, `symptoms`, `clinical_variables`, `risk_levels` | `app/repositories/catalog_repository.py` |
| PasswordResetTokenRepository | Repositorio | `password_reset_tokens` | `app/repositories/password_reset_token_repository.py` |

---

## Componentes — Módulo de Inferencia

| Componente | Tipo | Responsabilidad | Ubicación |
|---|---|---|---|
| InferenceEngine | Motor principal | Orquesta la evaluación: normaliza hechos, evalúa reglas activas, agrupa resultados por enfermedad, calcula score ponderado y nivel de riesgo | `app/inference/engine.py` |
| ConditionEvaluator | Evaluador de condiciones | Evalúa cada condición de una regla contra los hechos registrados; soporta operadores: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `between`, `contains`, `in` | `app/inference/evaluator.py` |
| FactNormalizer | Normalizador de hechos | Transforma los hechos crudos de la evaluación clínica al formato canónico que consume el motor | `app/inference/facts.py` |
| RiskMapper | Mapeador de riesgo | Convierte el score numérico acumulado en nivel de riesgo (`bajo`, `moderado`, `alto`) según umbrales configurables via variables de entorno | `app/inference/risk.py` |
| ConditionTrace | Trazador de condiciones | Genera justificación detallada de cada condición evaluada (disparada / no disparada) para auditoría y explicabilidad | `app/inference/trace.py` |

---

## Relaciones entre Componentes

### Flujo de Autenticación

| Origen | Destino | Relación |
|---|---|---|
| AuthRouter | AuthService | Invoca lógica de login, refresh y recuperación de contraseña |
| AuthService | Security | Genera y verifica JWT; hashea y compara contraseñas |
| AuthService | EmailService | Solicita envío de correo (modo SMTP) |
| AuthService | PasswordResetTokenRepository | Persiste y valida tokens de reset de un solo uso |
| EmailService | Servidor SMTP | Envía correo de recuperación vía SMTP/TLS |
| Permissions | Security | Verifica y decodifica JWT de cada solicitud entrante |
| Todos los Routers | Permissions | Validan rol del usuario antes de ejecutar el handler |

### Flujo de Inferencia Clínica

| Origen | Destino | Relación |
|---|---|---|
| InferenceRouter | InferenceService | Invoca la orquestación del motor de inferencia |
| InferenceService | RuleRepository | Carga reglas activas filtradas por especie del paciente |
| InferenceService | BayesService | Solicita cálculo de probabilidades Bayesianas |
| BayesService | ClinicalProbabilityRepository | Consulta probabilidades clínicas previas (priors) por especie y enfermedad |
| InferenceService | InferenceEngine | Delega la evaluación con hechos normalizados y reglas cargadas |
| InferenceEngine | FactNormalizer | Normaliza hechos de entrada antes de la evaluación |
| InferenceEngine | ConditionEvaluator | Evalúa cada condición de cada regla activa |
| InferenceEngine | RiskMapper | Mapea score acumulado a nivel de riesgo |
| InferenceEngine | ConditionTrace | Genera traza de justificación para reglas activadas |
| InferenceService | ResultRepository | Persiste resultados de inferencia y reglas activadas |

### Flujo CRUD Clínico

| Origen | Destino | Relación |
|---|---|---|
| OwnersRouter | OwnerService | Invoca CRUD de propietarios |
| OwnerService | OwnerRepository | Accede a tabla `owners` |
| PatientsRouter | PatientService | Invoca CRUD de pacientes |
| PatientService | PatientRepository | Accede a tabla `patients` |
| EvaluationsRouter | EvaluationService | Crea evaluaciones y registra hechos clínicos |
| EvaluationService | EvaluationRepository | Persiste evaluaciones y facts |
| RulesRouter | RuleService | CRUD de reglas de inferencia |
| RuleService | RuleRepository | Accede a tablas `inference_rules` y `rule_conditions` |
| HistoryRouter | HistoryService | Consulta historial clínico |
| HistoryService | HistoryRepository | Accede a tabla `clinical_history` |
| Todos los Repositorios | Database | Obtienen sesión SQLAlchemy activa |
| Database | PostgreSQL 16 | Ejecuta queries SQL |

---

## Representación Textual

```
API REST (FastAPI + Python 3.12 + Uvicorn)
│
├── [Core]
│   ├── Config ──────── carga .env vía Pydantic BaseSettings
│   ├── Database ─────── gestiona sesión SQLAlchemy ──> PostgreSQL 16
│   ├── Security ─────── JWT (HS256) + bcrypt
│   ├── Permissions ──── require_policy(roles) ──> Security
│   └── Exceptions ───── handlers HTTP estandarizados
│
├── [Routers /api/v1/]
│   │
│   ├── AuthRouter
│   │   └── invoca ──> AuthService
│   │                   ├── usa ──> Security
│   │                   ├── modo SMTP: usa ──> EmailService ──> [Servidor SMTP]
│   │                   └── usa ──> PasswordResetTokenRepository ──> PostgreSQL
│   │
│   ├── InferenceRouter  [flujo principal de la tesis]
│   │   └── invoca ──> InferenceService
│   │                   ├── carga ──> RuleRepository ──> PostgreSQL
│   │                   ├── invoca ──> BayesService
│   │                   │             └── consulta ──> ClinicalProbabilityRepository ──> PostgreSQL
│   │                   ├── invoca ──> InferenceEngine
│   │                   │             ├── usa ──> FactNormalizer
│   │                   │             ├── usa ──> ConditionEvaluator (10 operadores)
│   │                   │             ├── usa ──> RiskMapper (umbrales: 7.0 alto / 4.0 moderado)
│   │                   │             └── usa ──> ConditionTrace (justificación)
│   │                   └── persiste ──> ResultRepository ──> PostgreSQL
│   │
│   ├── EvaluationsRouter
│   │   └── invoca ──> EvaluationService ──> EvaluationRepository ──> PostgreSQL
│   │
│   ├── OwnersRouter
│   │   └── invoca ──> OwnerService ──> OwnerRepository ──> PostgreSQL
│   │
│   ├── PatientsRouter
│   │   └── invoca ──> PatientService ──> PatientRepository ──> PostgreSQL
│   │
│   ├── UsersRouter
│   │   └── invoca ──> UserService ──> UserRepository ──> PostgreSQL
│   │
│   ├── RulesRouter  (solo roles: admin, veterinario)
│   │   └── invoca ──> RuleService ──> RuleRepository ──> PostgreSQL
│   │
│   ├── ResultsRouter
│   │   └── consulta ──> ResultRepository ──> PostgreSQL
│   │
│   ├── HistoryRouter
│   │   └── invoca ──> HistoryService ──> HistoryRepository ──> PostgreSQL
│   │
│   └── CatalogRouters  (solo lectura)
│       └── consultan ──> CatalogRepository ──> PostgreSQL
│           (species, breeds, diseases, symptoms, clinical_variables, risk_levels)
│
└── BootstrapService  (startup lifespan)
    └── carga ──> clinical_reference_data.json ──> PostgreSQL
```

---

## Modelos ORM (22 tablas)

| Tabla | Entidad | Relaciones clave |
|---|---|---|
| `users` | User | → roles |
| `owners` | Owner | → patients (1:M) |
| `patients` | Patient | → owners, species, breeds, users (creador), evaluations |
| `species` | Species | → diseases, breeds, patients |
| `breeds` | Breed | → species |
| `diseases` | Disease | → inference_rules, inference_results |
| `symptoms` | Symptom | — |
| `clinical_variables` | ClinicalVariable | → fact_definitions |
| `clinical_probabilities` | ClinicalProbability | → species, diseases (priors Bayesianos) |
| `risk_levels` | RiskLevel | — |
| `inference_rules` | InferenceRule | → rule_conditions, diseases, activated_rules |
| `rule_conditions` | RuleCondition | → inference_rules |
| `evaluations` | EvaluationClinical | → patients, evaluation_facts, inference_results |
| `evaluation_facts` | EvaluationClinicalFact | → evaluations |
| `inference_results` | InferenceResult | → evaluations, diseases, activated_rules |
| `activated_rules` | ActivatedRule | → inference_results, inference_rules |
| `clinical_history` | ClinicalHistory | → patients (línea de tiempo) |
| `password_reset_tokens` | PasswordResetToken | → users (tokens de un uso, hasheados) |
| `fact_definitions` | FactDefinition | → species (metadatos de hechos) |
| `knowledge_sources` | KnowledgeSource | referencias académicas |
| `rule_references` | RuleReference | → inference_rules, knowledge_sources (trazabilidad) |
