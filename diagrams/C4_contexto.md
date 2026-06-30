# Diagrama C4 — Nivel 1: Contexto

## Descripción

Representa el sistema desde la perspectiva externa: quién lo usa, qué problema resuelve y con qué sistemas externos se comunica. El **Motor de Inferencia Veterinario** es un sistema web autocontenido; su única dependencia externa es el servicio de correo electrónico para recuperación de contraseña, configurable en dos modos mutuamente excluyentes (SMTP o EmailJS).

---

## Elementos

| Elemento | Tipo | Descripción |
|---|---|---|
| Administrador | Actor humano | Gestiona usuarios, reglas de inferencia y catálogos del sistema mediante la interfaz web |
| Veterinario | Actor humano | Registra propietarios, pacientes y ejecuta evaluaciones clínicas con diagnóstico asistido |
| Evaluador | Actor humano | Ejecuta evaluaciones clínicas y consulta los resultados de inferencia |
| Motor de Inferencia Veterinario | Sistema principal | Plataforma web para evaluación clínica de pacientes animales con motor de inferencia híbrido (reglas IF-THEN + Bayesiano) y gestión de historial clínico |
| Servidor SMTP | Sistema externo | Servidor de correo electrónico para envío de tokens de recuperación de contraseña (modo backend activo) |
| EmailJS | Sistema externo SaaS | Servicio de envío de correo electrónico desde el navegador, usado en modo alternativo de recuperación de contraseña |

---

## Relaciones

| Origen | Destino | Relación | Tecnología / Medio |
|---|---|---|---|
| Administrador | Motor de Inferencia Veterinario | Administra usuarios, reglas y catálogos del sistema | Navegador web / HTTPS |
| Veterinario | Motor de Inferencia Veterinario | Registra pacientes, propietarios y ejecuta evaluaciones clínicas | Navegador web / HTTPS |
| Evaluador | Motor de Inferencia Veterinario | Ejecuta evaluaciones clínicas y consulta resultados de inferencia | Navegador web / HTTPS |
| Motor de Inferencia Veterinario | Servidor SMTP | Envía correo con token de recuperación de contraseña (modo SMTP) | SMTP / TLS puerto 587 |
| Motor de Inferencia Veterinario | EmailJS | Delega envío de correo de recuperación al frontend (modo EmailJS) | HTTPS / SDK de navegador |

---

## Representación Textual

```
[Administrador] ──── gestiona vía HTTPS ────────────────────────┐
[Veterinario]   ──── registra y evalúa vía HTTPS ───────────────┤
[Evaluador]     ──── evalúa y consulta vía HTTPS ───────────────┤
                                                                 ▼
                     ┌─────────────────────────────────────────────────────┐
                     │         Motor de Inferencia Veterinario             │
                     │                                                     │
                     │  Plataforma web clínica veterinaria con motor de   │
                     │  inferencia híbrido (reglas IF-THEN + Bayesiano).  │
                     │  Gestiona propietarios, pacientes, evaluaciones     │
                     │  clínicas, historial y base de conocimiento.        │
                     └─────────────────────────────────────────────────────┘
                               │                          │
             envía token       │                          │  delega envío
             de reset vía      ▼                          ▼  (modo alternativo)
             SMTP/TLS   [Servidor SMTP]              [EmailJS]
                        (correo externo)             (SaaS correo)
```

---

## Preguntas Respondidas por Este Diagrama

**¿Quién usa el sistema?**
Tres roles humanos diferenciados: Administrador, Veterinario y Evaluador, con permisos graduales (RBAC).

**¿Qué problema resuelve?**
Asiste al veterinario en el diagnóstico clínico de enfermedades en animales mediante inferencia automatizada basada en síntomas y variables clínicas registradas, con trazabilidad de reglas activadas.

**¿Con qué sistemas externos se comunica?**
Únicamente con servicios de correo electrónico (SMTP o EmailJS) para el flujo de recuperación de contraseña. El sistema no depende de APIs externas para su funcionalidad clínica principal.

**¿Qué datos fluyen entre ellos?**
- Usuarios → Sistema: credenciales, datos de pacientes/propietarios, hechos clínicos (síntomas, variables).
- Sistema → Usuarios: resultados de inferencia, diagnósticos, nivel de riesgo, reglas activadas, historial.
- Sistema → SMTP/EmailJS: token de recuperación de contraseña + URL de restablecimiento.
