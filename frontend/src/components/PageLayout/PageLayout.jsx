import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AnnouncementBanner from "../AnnouncementBanner/AnnouncementBanner";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

// banner + navbar + page content + footer, so every new page looks like the rest of the site
function PageLayout({ title, bannerColor = "rgb(255,219,48)", children }) {
  return (
    <>
      <AnnouncementBanner bgcolor={bannerColor}></AnnouncementBanner>
      <Navbar onLight></Navbar>
      <Box component="main" sx={{ px: 3, py: { xs: 4, md: 6 }, maxWidth: 1200, mx: "auto", minHeight: "60vh" }}>
        {title && (
          <Typography
            component="h1"
            sx={{ fontFamily: "Brzo-Basic, sans-serif", fontWeight: 800, fontSize: { xs: 34, md: 48 }, mb: 4 }}
          >
            {title}
          </Typography>
        )}
        {children}
      </Box>
      <Footer></Footer>
    </>
  );
}
export default PageLayout;
