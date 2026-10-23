import { useState } from "react";
import { useEffect } from "react";
import { Box } from "@mui/material";
import ProductCard from "../components/ProductCard/ProductCard";
import fetchProducts from "../api/products";
import bgimage from "../assets/menshoes.jpg";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import ProductEntries from "../components/ProductEntries/ProductEntries";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
export function ProductPage() {
  const theme = useTheme();
  let tillsm = useMediaQuery(theme.breakpoints.down("sm"));
  let tillmd = useMediaQuery(theme.breakpoints.between("sm", "md"));
  let tilllg = useMediaQuery(theme.breakpoints.between("md", "lg"));
  let tillxl = useMediaQuery(theme.breakpoints.up("lg"));
  let perPage = tillsm ? 8 : tillmd ? 10 : tilllg ? 15 : tillxl ? 20 : 25;
  console.log("the value perpage is", perPage);
  const [products, setProducts] = useState({ items: [], total: 0 });
  const [batches, setBatches] = useState(1);
  const limit = perPage * batches;
  const total = products.total;
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

  useEffect(() => {
    fetchProducts(limit, offset).then(setProducts);
    console.log("a fetch has been made");
  }, [limit, offset]);

  function handlePagechange(_event, page) {
    setPage(page);
  }
  function moreProductsPerPage() {
    if (batches <= 4) {
      let newLimit = perPage*(batches+1)
      setBatches((prev) => prev + 1);
      setPage(Math.ceil((offset + 1) / newLimit));
    }
  }
  function lessProductsPerPage() {
    if (batches > 1) {
      setBatches((prev) => prev - 1);
      setPage(Math.ceil((offset + 1) / limit));
    }
  }

  return (
    <Box sx={{ position: "relative" }}>
      {/* <Navbar sx={{position:"sticky"}}></Navbar> */}
      <Box
        sx={{
          minHeight: "60vh",
          backgroundImage: `url(${bgimage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", scrollbarWidth: "none" }}>
        {products.items.map((product) => (
          <Box
            sx={{
              display: "flex",
              flex: {
                xs: "0 0 100%",
                sm: "0 0 50%",
                md: "0 0 33%",
                lg: "0 0 25%",
                xl: "0 0 20%",
              },
              border: "0.5px black solid",
            }}
            key={product.id}
          >
            <ProductCard
              productImage={product.image_url}
              productTitle={product.name}
            ></ProductCard>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          py: 5,
          px: { xs: 3, md: 4 },
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", lg: "row" },
          gap: { xs: 4, lg: 0 },
        }}
      >
        <Box>
          <Typography
            sx={{ fontSize: { md: 16, xs: 12 } }}
          >{`Showing ${offset + 1}-${offset + limit <= total ? offset + limit : total} entries of ${total} products`}</Typography>
        </Box>
        <Pagination
          variant="outlined"
          page={page}
          count={Math.ceil(total / limit)}
          size="large"
          onChange={handlePagechange}
          sx={{
            "& .MuiPaginationItem-root": {
              border: "0.3px solid black",
            },
            "& .MuiPaginationItem-root:hover": {
              bgcolor: "rgb(255, 219, 48)",
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              bgcolor: "rgb(255, 219, 48)",
            },
          }}
        ></Pagination>
        <ProductEntries
          noOfEntries={limit}
          moreProductsPerPage={moreProductsPerPage}
          lessProductsPerPage={lessProductsPerPage}
        ></ProductEntries>
      </Box>
      <Footer></Footer>
    </Box>
  );
}
