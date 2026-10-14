import Box from "@mui/material/Box"
import bgimage from "../../assets/jordenxspace.jpg"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
function ColabSection({imageOrientation="left"}){
    return (<Box sx={{display:"flex", width:"100%", flexDirection:{xs:"column", md:imageOrientation === "left"?"row":"row-reverse"},border:"0.5px black solid"}}>
        <Box sx={{width:{xs:"100%",md:"50%"},backgroundImage:`url(${bgimage})`,backgroundRepeat:"no-repeat", backgroundPosition:"bottom", backgroundSize:"cover", height:{xs:200,sm:350,md:500}}}>
        </Box>
        <Box sx={{bgcolor:"black", width:{md:"50%"},display:{xs:"flex"},justifyContent:{xs:"center",md:"center"},alignItems:{xs:"center",md:"center"},flexDirection:{xs:"column",md:"column"},py:{xs:8,md:0}}}>
            <Typography sx={{fontFamily:"Brzo-Basic, sans-serif", fontWeight:800, fontSize:{md:64,xs:34,sm:44}, color:"white",letterSpacing:0.5}}>
                JORDANxShoenation
            </Typography>
            <Typography sx={{fontWeight:400, color:"white"}}>
                Crossing fashion and function
            </Typography>
            <Button sx={{mt:5}}>Explore collection</Button>
        </Box>
    </Box>)
}
export default ColabSection