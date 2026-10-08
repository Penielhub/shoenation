import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { width } from "@mui/system"
function UnderConstruction(){
    return (
          <Box sx={{display:"flex", justifyContent:"center",alignItems:"center", flexDirection:"column", height:"100vh"}}>
            <Typography sx={{fontSize:"40px", fontWeight:800}}>Sorry, this page is under construction!</Typography>
            <Box component="img" src="https://fonts.gstatic.com/s/e/noto3demoji/latest/1f6a7/512.png" sx={{width:"100px",height:"100px"}}></Box>
          </Box>
    )
}
export default UnderConstruction