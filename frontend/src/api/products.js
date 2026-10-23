const API_URL= "https://enhancing-manchester-imperial-convergence.trycloudflare.com/products"
export default async function fetchProducts(limit=20,offset=0){
    const response= await fetch(`${API_URL}?category=3&limit=${limit}&offset=${offset}`)
    if(!response.ok){
        throw new Error("somthing wrong with fetch")
        
    }
    return response.json();
}