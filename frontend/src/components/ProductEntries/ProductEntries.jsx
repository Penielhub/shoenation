import { Box } from "@mui/material"
import Button from "@mui/material/Button"
import rightBtnImg from "../../assets/right.svg"
import Typography from "@mui/material/Typography"
import {useTheme, useMediaQuery} from "@mui/material"
function ProductEntries({noOfEntries=12, moreProductsPerPage, lessProductsPerPage,}){
    const iconSize= {xs:14,md:18}
    const btnPadding= {px:{xs:0.5,md:1},py:{xs:0.5,md:1}}
    return (
    <Box>
        <Box sx={{display:"inline-flex", justifyContent:"center",alignItems:"center",gap:1,p:1,bgcolor:"black",borderRadius:99}}>
            <Button sx={{minWidth:0, ...btnPadding}} onClick={lessProductsPerPage}>
                <Box component="img" src={rightBtnImg} alt="" sx={{width:iconSize,height:iconSize,transform:"scaleX(-1)"}}></Box>
            </Button>
            <Typography sx={{color:"white",fontSize:{xs:12,md:14}}}>{noOfEntries}</Typography>
            <Button sx={{minWidth:0, ...btnPadding}} onClick={moreProductsPerPage}>
                <Box component="img" src={rightBtnImg} alt="" sx={{width:iconSize,height:iconSize,}}></Box>
            </Button>
        </Box>
        <Typography sx={{fontSize:{xs:8,md:12}}}>No of products in a page</Typography>
        {/* <Button onClick={()=>{
            
            console.log(theme.breakpoints.down("xl"))
      }} sx={{'&:active':{transform:"translateY(5px)"}}}>click me</Button> */}
    </Box>)
}
export default ProductEntries