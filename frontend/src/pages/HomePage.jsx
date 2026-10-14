import Box from "@mui/material/Box";
import Navbar from "../components/Navbar/Navbar";
import heroimg from "../assets/bg3.jpg";
import decor from "../assets/decor.svg";
import AnnouncementBanner from "../components/AnnouncementBanner/AnnouncementBanner";
import Footer from "../components/Footer/Footer";
import ColabSection from "../components/ColabSection/ColabSection";
import CrepsSquadSubscription from "../components/CrepsSquadSubscription/CrepsSquadSubscription";
import ProductCarousel from "../components/ProductCarousel/ProductCarousel";
import { Typography } from "@mui/material";
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
      <CrepsSquadSubscription></CrepsSquadSubscription>
      <ColabSection></ColabSection>    
      <Typography sx={{fontFamily:"Brzo-Basic, sans-serif", fontWeight:800,fontSize:70, pt:2}}>Shop merch</Typography>
      <ProductCarousel></ProductCarousel>
      <Footer></Footer>
    </>
  );
}
export default HomePage;
