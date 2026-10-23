import Box from "@mui/material/Box";
import Navbar from "../components/Navbar/Navbar";
import heroimg from "../assets/bg11.jpeg";
import decor from "../assets/shoenation.svg";
import AnnouncementBanner from "../components/AnnouncementBanner/AnnouncementBanner";
import Footer from "../components/Footer/Footer";
import ColabSection from "../components/ColabSection/ColabSection";
import CrepsSquadSubscription from "../components/CrepsSquadSubscription/CrepsSquadSubscription";
import ProductCarousel from "../components/ProductCarousel/ProductCarousel";
import jordanspace from "../assets/jordenxspace.jpg"
import { Typography } from "@mui/material";
import offerimage from "../assets/offerimg2.jpg"
import FeaturedSection from "../components/FeaturedSection/FeaturedSection";
import canoe from "../assets/colab3.jpg"
import Button from "@mui/material/Button";


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
        {/* <AnnouncementBanner bgcolor="rgb(100, 211, 255)"></AnnouncementBanner> */}
        <AnnouncementBanner bgcolor="black"></AnnouncementBanner>
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
      <ColabSection title= "JORDANxShoenation" buttonContent="Explore collection" bgImage={jordanspace} description="Crossing fashion and function" descriptionColor="white"></ColabSection>    
      <Typography sx={{fontFamily:"Brzo-Basic, sans-serif", fontWeight:800,fontSize:{xs:50,md:70}, pt:2}}>Shop merch</Typography>
      <ProductCarousel></ProductCarousel>
      {/* <ColabSection title= "Explore the best offers" buttonContent="Explore offers" showDescription={false} color="rgb(172, 58, 58)" buttonMarginTop={2} imageOrientation="right" bgImage={offerimage}></ColabSection>  */}
      <ColabSection title= "Explore the best offers" buttonContent="Explore offers" showDescription={false} textColor="rgb(189, 18, 18)" color="white" buttonMarginTop={2} imageOrientation="right" bgImage={offerimage}></ColabSection> 
      <FeaturedSection></FeaturedSection> 
      <ColabSection title= "ShoenationxCanoe" buttonContent="shop" bgImage={canoe} color="white" description="Push the boundaries of running" descriptionColor="black" textColor="black"></ColabSection>   
      <Footer></Footer>
      
    </>
  );
}
export default HomePage;
