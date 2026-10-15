import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
function ColabSection({
  imageOrientation = "left",
  showDescription = true,
  color = "black",
  title,
  buttonContent,
  bgImage,
  buttonMarginTop=5,
  textColor= "white",
  description,
  descriptionColor= "white"
}) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: {
          xs: "column",
          md: imageOrientation === "left" ? "row" : "row-reverse",
        },
        border: "0.5px black solid",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
          backgroundSize: "cover",
          height: { xs: 200, sm: 350, md: 500 },
        }}
      ></Box>
      <Box
        sx={{
          bgcolor: color,
          width: { md: "50%" },
          display: { xs: "flex" },
          justifyContent: { xs: "center", md: "center" },
          alignItems: { xs: "center", md: "center" },
          flexDirection: { xs: "column", md: "column" },
          py: { xs: 8, md: 0 },
          borderLeft:"0.5px black solid",
          borderRight:"0.5px black solid"
        }}
      >
        <Typography
          sx={{
            fontFamily: "Brzo-Basic, sans-serif",
            fontWeight: 800,
            fontSize: { md: 64, xs: 34, sm: 44 },
            color: textColor,
            letterSpacing: 0.5,
          }}
        >
          {title}
        </Typography>
        {showDescription && (
          <Typography sx={{ fontWeight: 400, color: descriptionColor }}>
            {description}
          </Typography>
        )}
        <Button sx={{ mt: buttonMarginTop }}>{buttonContent}</Button>
      </Box>
    </Box>
  );
}
export default ColabSection;
