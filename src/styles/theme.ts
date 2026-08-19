import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  // ---- PALETA DE COLORES ----
  palette: {
    mode: "dark", // Empezamos con modo oscuro como base
    primary: {
      main: "#4dabf7", // Un azul claro y profesional
    },
    secondary: {
      main: "#f78c4d", // Un naranja como color de acento
    },
    background: {
      default: "#121212", // Un negro no tan puro para el fondo
      paper: "#1e1e1e", // El color para superficies como tarjetas y menús
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#b3b3b3",
    },
  },

  // ---- TIPOGRAFÍA ----
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 700 },
    // Puedes seguir definiendo h3, h4, body1, etc.
  },

  // ---- FORMA DE COMPONENTES ----
  shape: {
    borderRadius: 8, // Bordes ligeramente redondeados para un look moderno
  },

  // ---- SOBRESCRIBIR ESTILOS DE COMPONENTES ----
  // Aquí es donde personalizamos el aspecto por defecto de los componentes de MUI.
  components: {
    // Nombre del componente que quieres modificar
    MuiButton: {
      styleOverrides: {
        // La "regla" de estilo que quieres cambiar (ej. el botón con la variante "contained")
        root: {
          textTransform: "none", // Evita que los botones estén en MAYÚSCULAS
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          // Usa el color del 'paper' para la barra de navegación en lugar de un color sólido
          backgroundColor: "#1e1e1e",
          backgroundImage: "none", // Quita cualquier gradiente o imagen por defecto
        },
      },
    },
  },
});

export default theme;
