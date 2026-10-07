import Box from "@mui/material/Box";
import Navbar from "../components/Navbar/Navbar";
import heroimg from "../assets/hero.jpg";
import decor from "../assets/decor.svg";
import AnnouncementBanner from "../components/AnnouncementBanner/AnnouncementBanner";
import Footer from "../components/Footer/Footer";
function HomePage() {
  return (
    <>
      <Box
        sx={{
          position: "relative",
          backgroundImage: `url(${heroimg})`,
          minHeight: "100vh",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <AnnouncementBanner bgcolor="rgb(100, 211, 255)"></AnnouncementBanner>
        <Navbar></Navbar>
        <Box
          component="img"
          src={decor}
          sx={{
            width: "100%",
            height: "auto",
            bottom: 0,
            position: "absolute",
            left: "0%",
            p: 0,
          }}
        ></Box>
      </Box>
      <Footer></Footer>
    </>
  );
}
export default HomePage;
