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

// function renderBooks(result) {
//     const bookList = document.getElementById('booksContainer');
//     bookList.innerHTML = ''; // Clear previous content

//     result.data.forEach(book => {
//         let bookimage = book.cover_image_url.startsWith("https") 
//             ? book.cover_image_url 
//             : `/uploads/${book.cover_image_url}`;

//         const bookItem = document.createElement('div');
//         bookItem.classList.add('col-lg-4', 'col-sm-6', 'col-md-4');

//         bookItem.innerHTML = `
//             <div class="single-product-item text-center">
//                 <div class="products-images">
//                     <a href="/admin/books/update/${book.book_id}" class="product-thumbnail">
//                         <img src="${bookimage}" class="img-fluid bookCoverImage1" alt="Product Images" width="300px" height="300px">
//                         ${book.Inventory.quantity_available <= 0 ? `<span class="ribbon out-of-stock">Out Of Stock</span>` : ""}
//                     </a>
//                     <div class="product-actions">
//                         <a href="/admin/books/update/${book.book_id}" data-bs-target="#prodect-modal"><i class="p-icon icon-plus"></i><span class="tool-tip">Quick View</span></a>
//                     </div>
//                 </div>
//                 <div class="product-content">
//                     <h6 class="prodect-title"><a href="/admin/books/update/${book.book_id}">${book.title}</a></h6>
//                     <div class="prodect-price">
//                         <span class="new-price">$${book.price}</span>
//                     </div>
//                     <div class="prodect-price">
//                         <span class="new-price">Quantity available: ${book.Inventory.quantity_available}</span>
//                     </div>
//                     <div class="prodect-price">
//                         <span class="new-price">ISBN: ${book.ISBN}</span>
//                     </div>
//                     <div class="prodect-price">
//                         <a href="/admin/books/update/${book.book_id}"><i class="fa-solid fa-pen-to-square"></i></a>
//                         <a href="/admin/books/delete/${book.book_id}"><i class="fa-solid fa-trash"></i></a>
//                     </div>
//                 </div>
//             </div>
//         `;
//         bookList.appendChild(bookItem);
//     });

//     // Update pagination or other UI elements if needed
//     const meta = result.meta;
//     // document.querySelector(".result-count").innerHTML = `Showing page ${meta.currentPage} of ${meta.totalPages} results.`;
// }




const searchBox= document.getElementById("searchBox")
console.log(searchBox)
searchBox.addEventListener("submit",async (e)=>{
    e.preventDefault()
   await fetchBooks(1,document.getElementById("book").value)
})

