// import { fetchBooks } from "../customerJS/customerBooks"




async function fetchBooks(page = 1, bookName = "") {
    // Check if books data exists in localStorage
    let result;
    if (window.location.pathname === '/books' && localStorage.getItem('Books')) {
        result = JSON.parse(localStorage.getItem('Books'));
        console.log(result)
        renderBooks(result)
        localStorage.removeItem('Books'); // Remove after retrieving
    } else {
        const response = await fetch(`/allBooks?page=${page}&limit=${limit}&bookName=${bookName}`);
        result = await response.json();
        localStorage.setItem('Books', JSON.stringify(result)); // Store the data
        if (window.location.pathname !== '/books') {
            window.location.href = '/books'; // Redirect to /books page
            return ; // Ensure no further execution until redirect is complete
        }
    }
    // Display books in the UI
    
    // Update pagination controls, if needed
    meta = result.meta;
    // Example of showing pagination information
    // document.querySelector(".result-count").innerHTML = `Showing page ${meta.currentPage} of ${meta.totalPages} results.`;
}



const searchBox= document.getElementById("searchBox")
console.log(searchBox)
searchBox.addEventListener("submit",async (e)=>{
    e.preventDefault()
   await fetchBooks(1,document.getElementById("book").value)
})

