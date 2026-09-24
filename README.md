# Habit Tracker

Aplicación full-stack para el seguimiento de hábitos diarios, semanales y personalizados. Proyecto individual del curso de Experiencia de Usuario.

## Tecnologías

**Frontend**
- Next.js 16 (App Router)
- Material UI (MUI) v9
- Zod (validación de formularios)
- Recharts (gráficas)
- TypeScript

**Backend**
- NestJS 12
- MongoDB Atlas + Mongoose
- JWT (`@nestjs/jwt`, `@nestjs/passport`) + bcrypt
- class-validator / class-transformer
- Swagger (`@nestjs/swagger`)

**Gestor de paquetes:** pnpm (ambos proyectos)

## Estructura del repositorio

```
Habit-tracker/
├── backend/          # API REST con NestJS
│   └── src/
│       ├── auth/         # Registro, login, JWT, guards
│       ├── users/        # CRUD de usuarios
│       ├── habits/       # CRUD de hábitos
│       ├── records/      # Registros de cumplimiento diario
│       ├── statistics/   # Resumen, rachas, progreso mensual
│       └── schemas/      # Schemas de Mongoose (User, Habit, HabitRecord)
└── frontend/         # Interfaz web con Next.js
    ├── app/
    │   ├── login/ registro/       # Autenticación
    │   ├── dashboard/             # Vista principal
    │   ├── habitos/               # Lista, crear, editar hábitos
    │   ├── estadisticas/          # Calendario y gráficas
    │   └── perfil/                # Datos del usuario
    ├── components/                # Sidebar, BottomNav, ConfirmDialog, etc.
    ├── lib/                       # Cliente HTTP (api.ts) y schemas de Zod
    └── theme.ts                   # Tema de Material UI
```

## Requisitos previos

- [Node.js](https://nodejs.org/) v20 o superior
- [pnpm](https://pnpm.io/installation)
- Una base de datos en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (capa gratuita M0 es suficiente)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/sdvh05/22341344_Habit-Tracker.git
cd Habit-tracker
```

### 2. Backend

```bash
cd backend
pnpm install
```

Crea un archivo `.env` en la raíz de `backend/` con:

```env
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/habit-tracker?retryWrites=true&w=majority
JWT_SECRET=una_frase_larga_y_dificil_de_adivinar
```

Levanta el servidor:

```bash
pnpm run start:dev
```

El backend queda disponible en `http://localhost:3000`, con documentación interactiva de la API en `http://localhost:3000/api` (Swagger).

### 3. Frontend

En otra terminal:

```bash
cd frontend
pnpm install
pnpm dev
```

El frontend queda disponible en `http://localhost:3001`.

> **Importante:** backend y frontend deben correr **al mismo tiempo**, en terminales separadas, para que la aplicación funcione.

## Funcionalidades principales

- **Autenticación:** registro e inicio de sesión con JWT, contraseñas cifradas con bcrypt, validación de complejidad de contraseña.
- **Gestión de hábitos:** crear, editar, activar/desactivar y eliminar hábitos, con nombre, descripción, categoría, frecuencia, prioridad y fechas de inicio/fin.
- **Seguimiento diario:** marcar hábitos como completados desde el Dashboard, con actualización en tiempo real de racha y porcentaje de cumplimiento.
- **Estadísticas:** calendario mensual navegable (con selector rápido de año/mes), gráfica de barras por día, y detalle de hábitos completados al hacer clic en un día.
- **Perfil:** edición de nombre y correo, cierre de sesión.
- **Diseño responsive:** barra lateral de navegación en escritorio, menú inferior de navegación en móvil.

## Modelo de datos (MongoDB)

| Colección | Campos principales |
|---|---|
| `users` | nombre, correo, contraseña (hash), fechaRegistro |
| `habits` | nombre, descripción, categoría, frecuencia, prioridad, fechaInicio, fechaFin, activo, usuario |
| `habitrecords` | habito, usuario, fecha, completado |

## Autor

Steve — GitHub: [@sdvh05](https://github.com/sdvh05)
