let currentPage = 1;
const limit = 6; // Number of items per page
let meta={}
async function fetchBooks(page = 1,bookName="") {

    const response = await fetch(`/allBooks?page=${page}&limit=${limit}&bookName=${bookName}`);
    const result = await response.json();
    console.log(result)
    const bookList = document.getElementById('booksContainer');
    bookList.innerHTML = '';
    console.log(response)
    meta=result.meta
    result.data.forEach(book => {
            let bookimage=""
            if(book.cover_image_url.split(":")[0]=="https") {   
                bookimage=book.cover_image_url
            }
            else{
                bookimage=`/uploads/${book.cover_image_url}`
            }
        const bookItem = document.createElement('div');
        bookItem.classList.add('col-lg-4');
        bookItem.classList.add('col-sm-6');
        bookItem.classList.add('col-md-4');

        bookItem.innerHTML = `
        <div class="single-product-item text-center">
         <div class="products-images">
                    <a href="/admin/books/update/${book.book_id}" class="product-thumbnail">

                      
                        <img  src="${bookimage}" class="img-fluid bookCoverImage1" alt="Product Images" width="300px" height="300px" >
                        
                         
      
                         ${book.Inventory.quantity_available <= 0? `<span class="ribbon out-of-stock">Out Of Stock</span>`:""}

                         
                    </a>
                    
                    <div class="product-actions">
                      <a href="/admin/books/update/${book.book_id} "  data-bs-target="#prodect-modal"><i class="p-icon icon-plus"></i><span class="tool-tip">Quick View</span></a>
                      
                     
                    </div>
                </div>
                <div class="product-content">
                    <h6 class="prodect-title"><a href="/admin/books/update/${book.book_id}">${book.title}</a></h6>
                    <div class="prodect-price">
                        <span class="new-price">$ ${book.price} </span>
                    </div>
                     <div class="prodect-price">
                        <span class="new-price">Quantity available: ${book.Inventory.quantity_available} </span>
                    </div>
                     <div class="prodect-price">
                        <span class="new-price">ISBN:  ${book.ISBN} </span>
                    </div>

                      <div class="prodect-price">
                         <a href= "/admin/books/update/${book.book_id}" ><i class="fa-solid fa-pen-to-square"></i></a>
                                <a href="/admin/books/delete/${book.book_id}"><i class="fa-solid fa-trash"></i></a>
                    </div>
                   
                </div>

                </div>
        `;
        // document.querySelector(".result-count").innerHTML = `Showing  page ${result.meta.currentPage} of ${result.meta.totalPages} results.`
        bookList.appendChild(bookItem);
    });

    // Update pagination controls
    currentPage = result.meta.currentPage;
    document.getElementById('prevPage').disabled = !result.meta.prevPage;
    document.getElementById('nextPage').disabled = !result.meta.nextPage;
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        fetchBooks(currentPage - 1);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if(currentPage!=meta.totalPages){
        fetchBooks(currentPage + 1);

    }

    });


const fetchOrders= async (query="")=>{
    const response= await fetch (`/admin/GetOrders?order=${query}`)

    const result= await response.json()

    console.log(result)
    const OrdersTable= document.getElementById("OrdersTable")

    OrdersTable.innerHTML=""

    result.orders.forEach(order=>{
        const TableRow=document.createElement("tr")

        TableRow.innerHTML=`
                                             <td >${order.order_id} </td>
                                              <td>${ order.Customer.first_name ||"geust"}  ${order.Customer.last_name|| "" }</td>
                                              <td>${order.Customer.email}</td>
                                              <td>$${order.total_amount}</td>
                                              <td>${order.delivery_status}</td>
                                              <td>${order.order_date }</td>
                                              <td><a href="/admin/order/viewOrder/${order.order_id}" ><i class="fa-solid fa-pen-to-square"></i></a></td>
        
        `


        OrdersTable.appendChild(TableRow)
    })
    
}


window.addEventListener("load",async ()=>{

    fetchBooks();
    fetchOrders()
})

// Initial fetch

const searchBox= document.getElementById("searchBox")
console.log(searchBox)
searchBox.addEventListener("submit",async (e)=>{
    e.preventDefault()
    fetchBooks(1,document.getElementById("book").value)
    console.log("test")
})


const OrderSearchBox= document.getElementById("OrderSearchBox")
console.log(OrderSearchBox)
OrderSearchBox.addEventListener("submit",(e)=>{
    e.preventDefault()
    // window.location("/admin/dashboard")
    fetchOrders(document.getElementById("order").value)
})