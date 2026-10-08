import Box from "@mui/material/Box";
import footerlogo from "../../assets/footerlogo.svg";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import {Link as RouterLink} from "react-router-dom"
function Footer() {
  const footerLinkStyles = {
    color: "white",
    textDecoration: "none",
    display: "block",
    my: { xs: 2, md: 3 },
  };
  return (
    <Box
      sx={{
        bgcolor: "black",
        py: { md: 10, xs: 6 },
        px: { md: 1 },
      }}
    >
      <Box
        sx={{
          px: 3,
          py: { xs: 7, md: 14 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
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
        <Box
          sx={{
            ml: { md: "auto" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, md: 15 },
            pr: { md: 15 },
          }}
        >
          <Box>
            <Typography
              sx={{ color: "white", fontSize: "24px", fontWeight: 800 }}
            >
              Shop
            </Typography>
            <Link to="/underconstruction" sx={footerLinkStyles} component={RouterLink}>
              Men
            </Link>
            <Link to="/underconstruction" sx={footerLinkStyles} component={RouterLink}>
              Women
            </Link>
            <Link to="/underconstruction" sx={footerLinkStyles} component={RouterLink}>
              Kids
            </Link>
          </Box>
          <Box>
            <Link to="/underconstruction" sx={footerLinkStyles} component={RouterLink}>
              FAQ
            </Link>
            <Link to="/underconstruction" sx={footerLinkStyles} component={RouterLink}>
              Contact us
            </Link>
            <Link href="https://www.instagram.com" sx={footerLinkStyles}>
              Instagram
            </Link>
          </Box>
        </Box>
      </Box>
      <Box
        component="img"
        src={footerlogo}
        alt="logo"
        sx={{ width: "100%" }}
      ></Box>
      {/* <Box>
        <Box
          component="svg"
          viewbox="0 0 200 100"
          sx={{ width: 100, height: "auto" }}
        >
            <path d="M3 0.5H35C36.3348 0.5 37.5 1.58692 37.5 3V21C37.5 22.4239 36.4239 23.5 35 23.5H3C1.66524 23.5 0.5 22.4131 0.5 21V3C0.5 1.57614 1.57614 0.5 3 0.5Z" stroke="black"></path>
            <path d="M25.8662 6.33203V3H31L31.8662 5.5332L32.7334 3H37V14.2002H36.7998L34.8672 16.2656L36.7998 18.3594H37V21.2666H33.5996L31.9336 19.3994L30.2002 21.2666H19.4668V12.666H16L20.2666 3H24.4004L25.8662 6.33203ZM20.5996 20.2656H27V18.5322H22.666V17.3994H26.8662V15.666H22.666V14.5322H27V12.7988H20.5996V20.2656ZM30.5332 16.5322L27 20.2656H29.5996L31.8662 17.8662L34.0664 20.2656H36.7324L33.1992 16.4658L36.7324 12.7988H34.1328L31.8662 15.1992L29.7324 12.7988H27L30.5332 16.5322ZM17.666 11.7324H19.9326L20.5332 10.1992H23.999L24.666 11.7324H26.999L23.666 4.19922H20.999L17.666 11.7324ZM33.5996 4.19922L31.9326 8.86621L30.1992 4.19922H27V11.666H29.0664V6.39941L31 11.666H32.7998L34.7324 6.39941V11.666H36.7324V4.13281L33.5996 4.19922ZM23.2656 8.46582H21.2656L22.2656 5.99902L23.2656 8.46582Z"></path>
        </Box>
      </Box> */}
    </Box>
  );
}
export default Footer;
