import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import heart from "../../assets/heart.svg"
function ProductCard(props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, m: 3, position:"relative"}}>
        
      <Box
        component="img"
        src={props.productImage}
        alt=""
        sx={{
          width: "100%",
          aspectRatio: "5/5",
          objectFit: "cover",
          display: "block",
          
        }}
      >
        
      </Box>
      <Button sx={{borderRadius:99, position:"absolute",top:"3%",right:"3%",px:1, py:2, minWidth: 36,height: 36,}}>
            <Box component="img" src={heart} alt="" sx={{width:18, height:18}}></Box>
        </Button>
      <Typography sx={{ fontWeight: 800, fontSize: 18, mt: 2 }}>
        {props.productTitle}
      </Typography>
      <Button sx={{ mt: 3 }}>Add to cart</Button>
    </Box>
  );
}
export default ProductCard;
