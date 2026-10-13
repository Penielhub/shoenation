import basketball from "../../assets/basket-ball-micro.svg"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography  from "@mui/material/Typography"
function CrepsSquadSubscription(){
    return (
        <Box sx={{display:"flex", flexDirection:{xs:"column",md:"row"},px:3,py:4,justifyContent:{xs:"center",md:"space-between"}, gap:{xs:1,md:0},alignItems:"center"}}>
            <Box sx={{display:"flex",flexDirection:"row",gap:1}}>
                <Typography sx={{fontWeight:800, fontSize:24}}>#CrepsSquad subscription</Typography>
                <Box component="img" src={basketball} alt="" sx={{width:34}}></Box>
            </Box>
            <Typography sx={{maxWidth:400,lineHeight:1.4, textAlign:"center"}}>
                Get news on the latest drops, plus special discount codes for new launches.
            </Typography>
            <Button sx={{mt:{xs:5,md:0}}}>Subscribe</Button>
        </Box>
    )   
}
export default CrepsSquadSubscription