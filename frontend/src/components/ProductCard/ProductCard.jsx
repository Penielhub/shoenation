import { Box } from "@mui/material"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
function ProductCard(props){
    return (<Box sx={{display:"flex", flexDirection:"column", gap:1, p:3}}>
        <Box component="img" src={props.productImage} alt="" sx={{width:"100%", aspectRatio:"5/5", objectFit:"cover", display:"block"}} >
        </Box>
        <Typography sx={{fontWeight:800, fontSize:18, mt:2}}>{props.productTitle}</Typography>
        <Button sx={{mt:3}}>Shop</Button>
    </Box>)
}
export default ProductCard
