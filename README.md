# 📊 L2H Dashboard - Análisis Financiero Avanzado

Un dashboard financiero moderno e interactivo para el análisis de ingresos y gastos, con visualizaciones avanzadas y funcionalidades de filtrado en tiempo real.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-2.0.0-orange)

## 🚀 Características Principales

### 📈 Visualizaciones Interactivas
- **Gráfico de Barras Mensual**: Comparación de ingresos vs gastos por mes
- **Gráfico de Distribución**: Dona interactiva para gastos por categoría
- **Top 5 Gastos**: Gráfico horizontal de las categorías con mayor gasto
- **Gráfico de Tendencia**: Línea temporal de ingresos y gastos
- **Filtrado por Clic**: Haz clic en cualquier elemento de los gráficos para filtrar

### 🎛️ Sistema de Filtros Avanzado
- **Filtro por Mes**: Selecciona un mes específico o todos
- **Filtro por Categoría**: Filtra por categoría de gasto/ingreso
- **Búsqueda en Tiempo Real**: Busca en descripciones, categorías y montos
- **Filtrado Interactivo**: Clic en gráficos para filtrar automáticamente
- **Botón Limpiar Filtros**: Resetea todos los filtros con un clic

### 🎨 Interfaz Moderna
- **Tema Claro/Oscuro**: Cambio automático con persistencia
- **Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- **Animaciones Suaves**: Transiciones y efectos visuales
- **Iconografía Font Awesome**: Iconos profesionales
- **Tipografía Inter**: Fuente moderna y legible

### 📊 Funcionalidades Avanzadas
- **Tarjetas de Resumen**: Totales de ingresos, gastos y balance neto
- **Tabla de Transacciones**: Vista detallada con paginación
- **Exportación de Datos**: PDF, Excel y CSV
- **Carga Dinámica**: Indicadores de carga y manejo de errores
- **Notificaciones**: Feedback visual para acciones del usuario

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Framework CSS**: Tailwind CSS
- **Gráficos**: Chart.js
- **Iconos**: Font Awesome 6.4.0
- **Fuente**: Inter (Google Fonts)
- **Servidor Local**: Python HTTP Server

## 📦 Instalación y Configuración

### Prerrequisitos
- Python 3.x
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para cargar CDNs)

### Pasos de Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/vitalizzy/L2H-Dashboard.git
   cd L2H-Dashboard
   ```

2. **Inicia el servidor local**
   ```bash
   python3 -m http.server 8000
   ```

3. **Abre el dashboard**
   ```
   http://localhost:8000
   ```

### Configuración de Datos

El dashboard se conecta a Google Sheets a través de Google Apps Script. Para configurar tu propia fuente de datos:

1. **Estructura de Datos Requerida**:
   ```csv
   Fecha,Mes Ano,Categoria,Descripcion,Ingresos,Gastos
   2024-01-15,Enero 2024,Salario,Salario mensual,5000,0
   2024-01-20,Enero 2024,Comida,Supermercado,0,150
   ```

2. **Actualiza la URL de la API** en `js/config.js`:
   ```javascript
   export const GOOGLE_SHEET_API_URL = 'TU_URL_DE_GOOGLE_APPS_SCRIPT';
   ```

## 🎯 Guía de Uso

### Navegación Principal
- **Tarjetas de Resumen**: Vista rápida de totales financieros
- **Gráficos Interactivos**: Haz clic para filtrar datos
- **Filtros Superiores**: Control preciso de los datos mostrados
- **Tabla de Transacciones**: Vista detallada de todas las transacciones

### Filtrado Interactivo
1. **Clic en Gráficos**:
   - Gráfico mensual: Filtra por mes específico
   - Gráfico de distribución: Filtra por categoría
   - Top 5 gastos: Filtra por categoría
   - Gráfico de tendencia: Filtra por mes

2. **Filtros Tradicionales**:
   - Dropdown de mes: Selecciona período específico
   - Dropdown de categoría: Filtra por tipo de transacción
   - Campo de búsqueda: Busca en descripciones y montos

3. **Limpiar Filtros**:
   - Botón "Limpiar Filtros": Resetea todas las selecciones

### Exportación de Datos
1. **Clic en "Exportar"** en la barra de navegación
2. **Selecciona formato**:
   - **PDF**: Reporte formateado para impresión
   - **Excel**: Datos en formato de hoja de cálculo
   - **CSV**: Archivo de texto separado por comas

### Cambio de Tema
- **Botón de tema** en la barra de navegación
- **Persistencia automática** de preferencia
- **Detección automática** del tema del sistema

## 📁 Estructura del Proyecto

```
L2H Dashboard/
├── index.html              # Página principal
├── css/
│   └── style.css          # Estilos personalizados
├── js/
│   ├── main.js            # Lógica principal
│   ├── api.js             # Manejo de API
│   ├── charts.js          # Configuración de gráficos
│   ├── ui.js              # Funciones de interfaz
│   ├── theme.js           # Sistema de temas
│   ├── export.js          # Funcionalidad de exportación
│   └── config.js          # Configuración global
└── README.md              # Este archivo
```

## 🔧 Personalización

### Colores y Temas
Los colores se definen en `js/charts.js` y `css/style.css`:
```javascript
const colors = {
    income: '#10b981',      // Verde para ingresos
    expense: '#ef4444',     // Rojo para gastos
    // ... más colores
};
```

### Moneda
Cambia la moneda en `js/ui.js`:
```javascript
return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'  // Cambia a tu moneda
});
```

### Gráficos
Modifica los gráficos en `js/charts.js`:
- Tipos de gráficos disponibles
- Opciones de interactividad
- Configuración de colores

## 🐛 Solución de Problemas

### Error de CORS
**Problema**: "Access to script blocked by CORS policy"
**Solución**: Usa el servidor local en lugar de abrir el archivo directamente

### Datos no se cargan
**Problema**: "No se pudieron cargar los datos"
**Solución**: Verifica la URL de la API en `js/config.js`

### Gráficos no se muestran
**Problema**: Gráficos vacíos o errores en consola
**Solución**: Verifica que Chart.js esté cargado correctamente

### Filtros no funcionan
**Problema**: Los filtros no actualizan los datos
**Solución**: Verifica la estructura de datos en Google Sheets

## 📈 Roadmap

### Versión 2.1
- [ ] Filtros de fecha personalizados
- [ ] Comparación año anterior vs actual
- [ ] Metas financieras y progreso
- [ ] Notificaciones push

### Versión 2.2
- [ ] Múltiples cuentas bancarias
- [ ] Categorización automática
- [ ] Alertas de gastos excesivos
- [ ] Integración con APIs bancarias

### Versión 2.3
- [ ] Dashboard móvil nativo
- [ ] Sincronización en la nube
- [ ] Reportes automáticos por email
- [ ] Análisis predictivo

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Jesús Vita Martínez**
- GitHub: [@vitalizzy](https://github.com/vitalizzy)
- Proyecto: [L2H Dashboard](https://github.com/vitalizzy/L2H-Dashboard)

## 🙏 Agradecimientos

- **Chart.js** por las increíbles visualizaciones
- **Tailwind CSS** por el framework de estilos
- **Font Awesome** por los iconos profesionales
- **Google Apps Script** por la integración con Sheets

---

⭐ **Si te gusta este proyecto, ¡dale una estrella en GitHub!** 