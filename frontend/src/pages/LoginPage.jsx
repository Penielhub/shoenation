import Navbar from "../components/Navbar/Navbar"
import AnnouncementBanner from "../components/AnnouncementBanner/AnnouncementBanner"
import Footer from "../components/Footer/Footer"

function LoginPage(){
    return(
        <>
            <AnnouncementBanner bgcolor= "rgb(255,219,48)"></AnnouncementBanner>
            <Navbar></Navbar>
            <Footer></Footer>
        </>
    )
}
export default LoginPage