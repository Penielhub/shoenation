import { createBrowserRouter } from "react-router-dom"
import HomePage from "../pages/HomePage"
import UnderConstruction from "../pages/UnderConstruction"

const router= createBrowserRouter([
    {path:"/shoenation", element:<HomePage/>}, {path:"/shoenation/underconstruction", element:<UnderConstruction/>}
])
export default router