import Box from "@mui/material/Box"
function AnnouncementBanner(props){
    return (
        <Box sx={{
            width:"100%",
            // bgcolor:"rgb(255,219,48)",
            // bgcolor:"rgb(48, 200, 255)",
            // bgcolor:"rgb(100, 211, 255)",
            bgcolor:props.bgcolor,
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            py:2,
            fontSize: "11px",
            fontWeight: 400,
            color:"white",
            borderBottom:"0.3px solid white"
        }}>
            {/* New shoes - who dis?! */}
            NEW SHOES - WHO DIS?!
        </Box>
    )
}
export default AnnouncementBanner