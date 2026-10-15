import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import sampleImg from "../../assets/nigolo2t.png";
import Button from "@mui/material/Button";
function FeaturedSection({ title = "Nigo LO2", image = sampleImg }) {
  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          backgroundColor: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pt: { xs: 8, sm: 12, md: 22 },
          pb: { xs: 12, sm: 14, md: 16 },
        }}
      >
        <Typography
          variant="BrzoText"
          sx={{
            fontSize: { xs: "24vw", sm: "22vw", md: "20vw" },
            color: "rgb(72, 0, 116)",
          }}
        >
          {title}
        </Typography>
        <Box
          component="img"
          src={sampleImg}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            height: "auto",
            width: { xs: "75%", sm: "70%", md: "50%" },
          }}
        ></Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          pb:{xs:6,md:10},
          bgcolor:"black"
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 24, color: "white" }}>
          The New Nigo LO2
        </Typography>
        <Button>Shop</Button>
      </Box>
    </Box>
  );
}
export default FeaturedSection;
