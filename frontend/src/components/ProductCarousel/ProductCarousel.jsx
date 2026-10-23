import { Box } from "@mui/material"
import ProductCard from "../ProductCard/ProductCard"
import totebag from "../../assets/totebag.jpg"
import hoodie from "../../assets/hoodie.jpg"
import nikecap1 from "../../assets/cap.jpg"
import nikecap2 from "../../assets/cap2.jpg"
import nikebag1 from "../../assets/nikebag2.jpg"
import blacktee from "../../assets/blacktee.jpg"

function ProductCarousel(props){
    const products= [{
        id:"totebag",
        price:"Rs. 1,646",
        title:"ShoeNation club cross body bag",
        image: totebag
    },
    {
        id:"hoodie",
        price:"Rs. 978",
        title:"ShoeNation water bottle",
        image: hoodie
    },
    {
        id:"nikecap1",
        price:"Rs. 1,900",
        title:"ShoeNation club cap",
        image: nikecap1
    },
    {
        id:"nikecap2",
        price:"Rs. 1,570",
        title:"ShoeNation club cap",
        image: nikecap2
    },
    {
        id:"nikebag1",
        price:"Rs. 3,570",
        title:"ShoeNation club bag",
        image: nikebag1
    },
    {
        id:"niketee",
        price:"Rs. 570",
        title:"ShoeNation club tee",
        image: blacktee
    },
    
    
    ]
    return (    
        <Box sx={{display:"flex", overflowX:"auto", scrollbarWidth:"none"}}>
            {
                products.map(product=>(
                    <Box sx={{display:"flex", flex:{xs:"0 0 82%",sm:"0 0 45%",md:"0 0 29%"}, border:"0.5px black solid"}} key={product.id}>
                        <ProductCard productImage={product.image} productTitle={product.title}></ProductCard>
                    </Box>
                ))
            }
        </Box>
    )
}
export default ProductCarousel