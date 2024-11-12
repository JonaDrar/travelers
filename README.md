# Calculadora de Gastos de Viaje

Esta es una aplicación web desarrollada en React y TypeScript que permite gestionar y registrar gastos asociados a diferentes viajeros en tiempo real. La aplicación utiliza Firebase Firestore como base de datos para almacenar y actualizar los datos de forma dinámica, y Tailwind CSS para el diseño de la interfaz.

## Características

- **Gestión de Viajeros**: Permite agregar y eliminar viajeros.
- **Registro de Gastos**: Posibilidad de registrar distintos tipos de gastos para cada viajero.
- **Actualización en Tiempo Real**: Los datos se actualizan automáticamente en la interfaz gracias a la integración con Firebase Firestore.
- **Dashboard de Gastos**: Muestra un resumen detallado de los gastos realizados, con el tipo de gasto, monto y fecha.
- **Notificaciones de Error y Éxito**: Implementación de notificaciones visuales utilizando `React Toastify`.

## Tecnologías Utilizadas

- **React**: Biblioteca de JavaScript para construir interfaces de usuario.
- **TypeScript**: Lenguaje de programación con tipado estático que mejora la calidad del código.
- **Firebase Firestore**: Base de datos NoSQL en tiempo real para almacenar los datos.
- **Tailwind CSS**: Framework de CSS para el diseño de la interfaz.
- **React Toastify**: Biblioteca para mostrar notificaciones en la aplicación.

## Requisitos Previos

Para ejecutar este proyecto, necesitas tener instalados:

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

## Instalación

1. **Clona el repositorio**:

   ```bash
   git clone https://github.com/tu-usuario/calculadora-de-gastos-viaje.git
   cd calculadora-de-gastos-viaje
    ```

2. **Instala las dependencias**:

   ```bash
   npm install
   # o si usas yarn
   yarn install
    ```

3. **Configura Firebase**:

Crea un archivo .env en la raíz del proyecto con tus credenciales de Firebase. Asegúrate de incluir las variables de entorno de Firebase:

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

4. **Ejecuta la aplicación**:

   ```bash
   npm start
   # o si usas yarn
   yarn start
    ```

La aplicación se abrirá automáticamente en tu navegador en [http://localhost:5173](http://localhost:5173).

## Estructura del Proyecto

El código de la aplicación está organizado en los siguientes directorios:

- **src/components**: Contiene los componentes modulares de la aplicación, como `AddExpenseForm`, `ExpenseDashboard`, y `TravelerList`.
- **src/firebase**: Configuración de Firebase.
- **src/hooks**: Contiene hooks personalizados, como `useTravelersAndExpenses`, que maneja la lógica de la carga y actualización de datos en tiempo real desde Firebase.
- **src/types**: Define los tipos TypeScript utilizados en la aplicación, como `Expense` y `Traveler`.

## Uso

### Agregar un Viajero

1. En la sección de "Viajeros", introduce el nombre del viajero en el campo correspondiente y haz clic en "Añadir".
2. El viajero aparecerá en la lista y estará disponible para asignarle gastos.

### Registrar un Gasto

1. En la sección de "Agregar Gasto", selecciona el tipo de gasto y el monto.
2. Selecciona el viajero para el cual deseas registrar el gasto.
3. Haz clic en el botón con el nombre del viajero para agregar el gasto a su historial.

### Ver el Dashboard de Gastos

- La sección "Dashboard de Gastos" muestra todos los gastos registrados, detallando el tipo de gasto, el monto, el viajero y la fecha.

## Contribución

Si deseas contribuir a este proyecto, por favor realiza un fork del repositorio, crea una nueva rama con tus cambios y envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo [LICENSE](LICENSE).