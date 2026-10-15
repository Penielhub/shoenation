import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif",
    BrzoText:{
      fontFamily: "Brzo-Air",
      fontWeight: 800,
    }
  },
  h1: {
    fontFamily: "Inter, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize:"14px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          textTransform: "none",
          padding: "6px 36px",
          backgroundColor: "white",
          borderRadius: "999px",
          color: "black",
          "&:hover": {
            backgroundColor: "rgb(255, 219, 48)",
          },
          border: "0.8px black solid",
        },
      },
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});
export default theme;
