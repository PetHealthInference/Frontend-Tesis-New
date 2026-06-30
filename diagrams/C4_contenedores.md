# Diagrama C4 — Nivel 2: Contenedores

## Descripción

Muestra los contenedores de software que componen el sistema y cómo se comunican entre sí. El sistema se despliega mediante Docker Compose con tres servicios principales: la API FastAPI, PostgreSQL y pgAdmin. El frontend se sirve de forma estática (producción) o mediante el servidor de desarrollo Vite.

---

## Contenedores

| Contenedor | Tecnología | Responsabilidad |
|---|---|---|
| Aplicación Web (SPA) | React 19 + TypeScript + Vite + Tailwind CSS | Interfaz de usuario: formularios clínicos, flujo de evaluación, visualización de resultados de inferencia y gestión de propietarios/pacientes |
| API REST | FastAPI + Python 3.12 + Uvicorn | Exposición de 50+ endpoints REST en `/api/v1`, lógica de negocio, autenticación JWT, autorización RBAC |
| Motor de Inferencia | Módulo Python embebido en la API REST | Evaluación híbrida: reglas IF-THEN con operadores lógicos + cálculo Bayesiano; estratificación de riesgo; trazabilidad de reglas activadas |
| Base de Datos | PostgreSQL 16 | Persistencia de 22 tablas: pacientes, propietarios, evaluaciones, reglas, resultados de inferencia, historial clínico, base de conocimiento |
| pgAdmin | pgAdmin 4 (servicio Docker) | Administración visual de la base de datos PostgreSQL (herramienta operacional, no expuesta en producción) |

---

## Relaciones

| Origen | Destino | Relación | Protocolo / Tecnología |
|---|---|---|---|
| Administrador / Veterinario / Evaluador | Aplicación Web (SPA) | Interactúa con la interfaz | HTTPS / Navegador web |
| Aplicación Web (SPA) | API REST | Consume endpoints REST con autenticación JWT Bearer | REST / HTTPS / JSON |
| Aplicación Web (SPA) | EmailJS | Envía correo de recuperación de contraseña (modo EmailJS) | HTTPS / SDK EmailJS en navegador |
| API REST | Motor de Inferencia | Invoca evaluación al recibir `POST /inference/run` | Llamada interna Python (in-process, mismo proceso) |
| API REST | Base de Datos | Lee y escribe datos clínicos, reglas y resultados | SQLAlchemy 2.0 ORM / SQL / TCP |
| Motor de Inferencia | Base de Datos | Consulta reglas activas y probabilidades clínicas via repositorios | SQLAlchemy 2.0 ORM / SQL |
| API REST | Servidor SMTP | Envía correo de recuperación de contraseña (modo SMTP) | SMTP / TLS puerto 587 |
| pgAdmin | Base de Datos | Administración visual de tablas y datos | PostgreSQL Wire Protocol / TCP |

---

## Representación Textual

```
[Administrador]          [Veterinario]           [Evaluador]
      │                       │                       │
      └───────────────────────┴───────────────────────┘
                              │ HTTPS / Navegador
                              ▼
          ┌───────────────────────────────────────────┐
          │          Aplicación Web (SPA)             │
          │  React 19 + TypeScript + Vite             │
          │  Tailwind CSS + React Router 7 + Axios    │
          │  Páginas: pacientes, propietarios,        │
          │  evaluaciones, resultados, historial,     │
          │  knowledge base, reglas (admin)           │
          └───────────────────────────────────────────┘
                 │ REST / HTTPS / JWT Bearer        │ HTTPS / SDK
                 │                                  ▼
                 │                            [EmailJS]
                 │                         (SaaS externo)
                 ▼
          ┌───────────────────────────────────────────┐
          │              API REST                     │
          │   FastAPI + Python 3.12 + Uvicorn         │
          │   JWT (HS256) + RBAC (3 roles)            │
          │   50+ endpoints en /api/v1                │
          │                                           │
          │   ┌───────────────────────────────────┐   │
          │   │      Motor de Inferencia          │   │
          │   │  Reglas IF-THEN + Bayesiano       │   │
          │   │  Estratificación de riesgo        │   │
          │   │  Trazabilidad de reglas activadas │   │
          │   └───────────────────────────────────┘   │
          └───────────────────────────────────────────┘
                 │ SQLAlchemy ORM / SQL / TCP       │ SMTP / TLS
                 │                                  ▼
                 ▼                          [Servidor SMTP]
          ┌───────────────────────────────────────────┐
          │            Base de Datos                  │
          │           PostgreSQL 16                   │
          │  22 tablas: pacientes, propietarios,      │
          │  evaluaciones, reglas, resultados,        │
          │  historial clínico, conocimiento          │
          └───────────────────────────────────────────┘
                              ▲
                              │ Wire Protocol / TCP
          ┌───────────────────────────────────────────┐
          │              pgAdmin 4                    │
          │       (Administración / Docker)           │
          └───────────────────────────────────────────┘
```

---

## Configuración de Despliegue (Docker Compose)

| Servicio Docker | Imagen | Puerto expuesto | Notas |
|---|---|---|---|
| `api` | Python 3.12-slim (Dockerfile propio) | `API_PORT` (8000) | FastAPI + Uvicorn |
| `postgres` | postgres:16-alpine | `POSTGRES_HOST_PORT` (5433) | Volumen persistente `postgres_data` |
| `pgadmin` | pgAdmin 4 | `PGADMIN_HOST_PORT` (5050) | Solo administración |

### Variables de entorno clave

**Backend** (`Backend-Tesis/.env`):

| Variable | Propósito |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL (`postgresql+psycopg://...`) |
| `JWT_SECRET` | Clave de firma JWT |
| `PASSWORD_RESET_DELIVERY` | `smtp` o `emailjs` (selecciona modo de email) |
| `CORS_ORIGINS` | Orígenes permitidos para el frontend |
| `INFERENCE_HIGH_SCORE_THRESHOLD` | Umbral numérico para riesgo alto (7.0) |
| `INFERENCE_MODERATE_SCORE_THRESHOLD` | Umbral numérico para riesgo moderado (4.0) |

**Frontend** (`Frontend-Tesis-New/.env`):

| Variable | Propósito |
|---|---|
| `VITE_API_BASE_URL` | URL base de la API REST |
| `VITE_EMAILJS_SERVICE_ID` | ID de servicio EmailJS |
| `VITE_EMAILJS_TEMPLATE_ID` | ID de plantilla EmailJS |
| `VITE_EMAILJS_PUBLIC_KEY` | Clave pública EmailJS |

---

## Nota sobre el Motor de Inferencia

El Motor de Inferencia **no es un contenedor separado**: vive dentro del mismo proceso de la API REST como módulo Python (`app/inference/`). Esto simplifica el despliegue y elimina latencia de red entre la API y el motor, pero implica que los recursos de cómputo de inferencia compiten con los de la API. Esta decisión es adecuada para el alcance académico del sistema.
