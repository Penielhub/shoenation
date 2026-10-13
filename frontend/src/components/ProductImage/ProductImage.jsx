import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// products without a working image_url get a plain tile with the brand name instead of a broken image
function ProductImage({ product, height = 240 }) {
  const [failedUrl, setFailedUrl] = useState(null);

  if (product.image_url && product.image_url !== failedUrl) {
    return (
      <Box
        component="img"
        src={product.image_url}
        alt={product.name}
        onError={() => setFailedUrl(product.image_url)}
        sx={{ width: "100%", height, objectFit: "cover", borderRadius: 3, bgcolor: "rgb(240,240,240)" }}
      ></Box>
    );
  }
  return (
    <Box
      sx={{
        width: "100%",
        height,
        borderRadius: 3,
        bgcolor: "rgb(240,240,240)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        px: 1,
      }}
    >
      <Typography sx={{ fontFamily: "Brzo-Basic, sans-serif", fontWeight: 800, fontSize: 28, color: "rgb(160,160,160)", textAlign: "center" }}>
        {product.brand}
      </Typography>
    </Box>
  );
}
export default ProductImage;
