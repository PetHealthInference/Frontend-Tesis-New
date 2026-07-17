# Arquitectura C4 — Motor de Inferencia Veterinario

## Diagnóstico de Arquitectura del Sistema

**Nombre del sistema**: Motor de Inferencia Veterinario
**Propósito**: Plataforma clínica web que registra pacientes (animales), propietarios y evaluaciones clínicas, y ejecuta un motor de inferencia híbrido (reglas IF-THEN + Bayesiano) para diagnosticar enfermedades y estratificar riesgo.
**Contexto académico**: Tesis de ingeniería de software — sistema web completo desplegable con Docker Compose.

### Stack Tecnológico Principal

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | React + TypeScript + Vite | 19.2.6 / 6.0.2 / 8.0.12 |
| Estilos | Tailwind CSS | 4.3.1 |
| HTTP Client | Axios | 1.18.0 |
| Backend | FastAPI + Python | 0.115.6 / 3.12+ |
| ORM | SQLAlchemy + Alembic | 2.0.36 / 1.14.0 |
| Base de datos | PostgreSQL (prod) / SQLite (dev) | 16 |
| Autenticación | JWT HS256 autocontenido | python-jose 3.3.0 |
| Autorización | RBAC 3 roles (propio) | — |
| Email | SMTP o EmailJS (configurable) | — |
| Despliegue | Docker Compose | — |

---

## Actores Identificados

| Actor | Rol | Permisos |
|---|---|---|
| Administrador | Gestiona usuarios, reglas de inferencia y catálogos | Todos los módulos |
| Veterinario | Registra propietarios, pacientes, realiza evaluaciones clínicas | Lectura + escritura clínica |
| Evaluador | Ejecuta evaluaciones y consulta resultados de inferencia | Solo evaluaciones y resultados |

---

## Sistemas Externos Identificados

| Sistema Externo | Tipo | Propósito | Protocolo |
|---|---|---|---|
| Servidor SMTP | Servicio de correo externo | Envío de tokens de recuperación de contraseña (modo backend) | SMTP / TLS puerto 587 |
| EmailJS | Servicio SaaS de email | Envío de correo de recuperación desde el frontend (modo alternativo) | HTTPS / SDK JS |

> Los datos geográficos peruanos (UBIGEO: departamentos, provincias, distritos) están embebidos en el frontend (`peruUbigeo.ts`). No existe integración con mapas, pagos, IA externa ni almacenamiento en nube.

---

## Contenedores Identificados

| Contenedor | Tecnología | Responsabilidad |
|---|---|---|
| Aplicación Web (SPA) | React 19 + TypeScript + Vite + Tailwind CSS | Interfaz de usuario completa |
| API REST | FastAPI + Python 3.12 + Uvicorn | Lógica de negocio, endpoints REST, motor de inferencia |
| Motor de Inferencia | Módulo Python embebido en API REST | Evaluación híbrida (reglas + Bayes), estratificación de riesgo |
| Base de Datos | PostgreSQL 16 | Persistencia de 22 entidades clínicas, reglas y resultados |
| pgAdmin | pgAdmin 4 (Docker) | Administración visual de PostgreSQL |

---

## Componentes Principales Identificados

**Backend**: 14 routers, 14 servicios, 10 repositorios, módulo de inferencia con 5 clases, 22 modelos ORM, 13 esquemas Pydantic, sistema RBAC propio.

**Frontend**: 16 páginas, 10 servicios API (clientes Axios), 2 hooks personalizados, guardias de ruta por rol, 14 componentes reutilizables.

---

## Índice de Diagramas

| Archivo | Contenido |
|---|---|
| [C4_contexto.md](C4_contexto.md) | Nivel 1 — Diagrama de Contexto |
| [C4_contenedores.md](C4_contenedores.md) | Nivel 2 — Diagrama de Contenedores |
| [C4_componentes_backend.md](C4_componentes_backend.md) | Nivel 3 — Componentes del Backend |
| [C4_componentes_frontend.md](C4_componentes_frontend.md) | Nivel 3 — Componentes del Frontend |
