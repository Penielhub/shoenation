import Box from "@mui/material/Box";
import footerlogo from "../../assets/footerlogo.svg";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link"
function Footer() {
  const footerLinkStyles = {color:"white",textDecoration: "none",display:"block", my:{xs:2,md:3} };
  return (
    <Box
      sx={{
        bgcolor: "black",
        py: { md: 10, xs: 6 },
        px: { md: 1 },
      }}
    >
      <Box sx={{ px: 3, py: { xs: 7, md: 14 }, display:"flex", flexDirection:{xs:"column", md:"row"}}}>
        <Box>
          <Typography sx={{ color: "white", fontSize: 24, fontWeight: 800 }}>
            Stay lit!
          </Typography>
          <Typography
            sx={{ color: "white", mb: 3, fontSize: 16, fontWeight: 400 }}
          >
            Subscribe to get first access to our latest drops
          </Typography>
          <Box
            component="input"
            type="email"
            placeholder="Your email"
            sx={{
              border: "0.5px solid white",
              pr: { xs: 7, md: 14 },
              py: { xs: 2, md: 2.5 },
              pl: 4,
              borderRadius: 99,
              fontFamily: "Lato, sans-serif",
              outline: "none",
              bgcolor: "black",
              fontSize: 16,
              color: "white",
              fontWeight: 700,
            }}
          ></Box>
        </Box>
        <Box sx={{ml:{md:"auto"}, display:"flex", flexDirection:{xs:"column",md:"row"}, gap:{xs:2,md:15},pr:{md:15}}}>
          <Box>
            <Typography sx={{color:"white", fontSize:"24px", fontWeight:800}}>Shop</Typography>
            <Link href="/men" sx={footerLinkStyles}>Men</Link>
            <Link href="/women" sx={footerLinkStyles}>Women</Link>
            <Link href="/kids" sx={footerLinkStyles}>Kids</Link>
          </Box>
          <Box>
            <Link href="" sx={footerLinkStyles}>FAQ</Link>
            <Link href="" sx={footerLinkStyles}>Contact us</Link>
            <Link href="" sx={footerLinkStyles}>Instagram</Link>
          </Box>
        </Box>
      </Box>
      <Box
        component="img"
        src={footerlogo}
        alt="logo"
        sx={{ width: "100%" }}
      ></Box>
    </Box>
  );
}
export default Footer;
