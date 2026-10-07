import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  typography: {
    fontFamily: "Lato, sans-serif",
  },
  h1: {
    fontFamily: "Lato, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize:"12px",
          fontFamily: "Lato, sans-serif",
          fontWeight: 400,
          textTransform: "none",
          padding: "8px 32px",
          backgroundColor: "white",
          borderRadius: "999px",
          color: "black",
          "&:hover": {
            backgroundColor: "rgb(255, 219, 48)",
          },
          border: "0.5px black solid",
        },
      },
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});
export default theme;
