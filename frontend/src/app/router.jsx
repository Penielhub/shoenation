import { createBrowserRouter } from "react-router-dom"
import HomePage from "../pages/HomePage"
import UnderConstruction from "../pages/UnderConstruction"

const router= createBrowserRouter([
    {path:"/", element:<HomePage/>}, {path:"/underconstruction", element:<UnderConstruction/>}
])
export default router