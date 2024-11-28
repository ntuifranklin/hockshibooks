let deleteButton;
let cartLength;

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

let detailedCartItems=[];
const fetchCartItems= async ()=> {
            // Fetches the cart items from the server and updates the UI with the detailed cart items.
    // 
    // This function fetches the cart items from the server by making a POST request to the '/cart' endpoint.
    // It sends the cart items in the request body as a JSON string.
    // The server responds with a JSON object containing the detailed cart items.
    // The function then updates the UI by calling the 'displayCartItems' function with the detailed cart items.
    // If there is an error during the fetch request, it logs the error to the console.
    // 
    // Parameters:
    // None
    // 
    // Returns:
    // None
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        await fetch('/cart', {
            method: 'POST',
            headers: {
                "X-CSRF-Token":csrfToken,
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify({ cartItems })
        })
        .then(response => response.json())
        .then(detailedCartItems => {
            detailedCartItems=detailedCartItems
            cartLength=detailedCartItems.length
            console.log(cartLength)
            if(cartLength>0){

                displayCartItems(detailedCartItems);
            }
            else{
                document.getElementById("reveal").disabled= true
            }
        })
        .catch(error => {
            console.error('Error fetching cart items:', error);
        });
}

function removeFromCart(productId) {
            // Refresh the cart display after removing the specified product from the cart.
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(item => item.id != productId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    fetchCartItems(); // Refresh the cart display after removal
}
function displayCartItems(detailedCartItems) {
            /**
 * Displays the detailed cart items in the cartItemsContainer element.
 *
 * @param {Array} detailedCartItems - An array of detailed cart items to be displayed.
 * @return {void} This function does not return anything.
 */
    const cartItemsContainer = document.querySelector('tbody');
    console.log(cartItemsContainer)
    cartItemsContainer.innerHTML = '';
    detailedCartItems.forEach(item => {
            const itemElement = document.createElement('tr');
            itemElement.classList.add('itemElement');
        

        let cart=JSON.parse(localStorage.getItem("cartItems"))||[]
        let product = cart.find(items=>items.id==item.book_id)
        

    //     itemElement.innerHTML = `
    //         <div class="card-body bod">
    //         <div class="d-flex justify-content-between align-items-center cart-item bod">
    //             <img src="${item.cover_image}" class="mr-3  space">
    //             <div class="ml-3 flex-grow-1">
    //                 <h5 class="mb-1 productName" >${item.title}</h5>
    //                 <p class="mb-1 text-muted">by ${item.author}</p>
    //                 <p class="mb-1 productPrice">$${item.price}</p>
    //                 <p class="mb-1 available_qty">${item.Inventory.quantity_available}</p>
                    
    //                 <p class="text-success">In stock</p>
    //             </div>

    //             <div class="ml-3">
    //                 <select class="productQty" data-product-id=${item.book_id} data-qty-available=${item.Inventory.quantity_available} value=${product.qty}>
    //                     <option value="1">1</option>
    //                     <option value="2">2</option>
    //                     <option value="3">3</option>
    //                     <option value="4">4</option>
    //                     <option value="5">5</option>


    //                 </select>
    //             <button class="btn btn-link text-danger ml-3 " ><i class="fa fa-times" id="delete-item" data-product-id="${item.book_id}"></i></button>
    //             </div>
    //     </div>
    //    </div> 
    //     `;
        

        itemElement.innerHTML = `
                                <td></td>
                                    <td class="product-img">
                                        <a href="#"><img src="${item.cover_image}" alt="" style="width: 80px; height:80px margin-right: 10px"></a>
                                    </td>
                                    <td class="product-name"><a href="#" class="productName">${item.title}</a></td>

                                    <td class="product-price"><span class="amount productPrice">$${item.price}</span></td>

                                    <td class="cart-quality">
                                        <div class="quickview-quality quality-height-dec2">
                                            <div class="cart-plus-minus">
                                            
                                            
                                            <select class="productQty" data-product-id=${item.book_id} data-qty-available=${item.Inventory.quantity_available} value=${product.qty}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>


                    </select>


                                                </div>
                                        </div>
                                    </td>
                                    
                                    <td class="product-remove">
                                        <a href="#"><i class="icon-cross2" id="delete-item" data-product-id="${item.book_id}"></i></a>
                                    </td>
        
        
        `
        cartItemsContainer.appendChild(itemElement);
    });

    loadValue()
    
}

const loadValue= ()=>{
            /**
 * Loads the saved quantity values for each product in the cart.
 * 
 * Iterates through all select elements, retrieves the corresponding product ID,
 * and updates the select element's selected index based on the saved quantity value.
 * 
 * @return {void}
 */
    let selectBoxes= document.querySelectorAll("select")

    selectBoxes.forEach(select=>{
    let id=select.getAttribute("data-product-id")
    const items=JSON.parse(localStorage.getItem("cartItems"))
    
        let saved=items.find(item=>item.id==id)

        if(saved){
            select.selectedIndex=saved.qty-1
            
        }
    })
}

const displayOrderSummary=async ()=>{
            /**
 * Asynchronously displays the order summary by fetching the detailed cart items and calculating the total price.
 *
 * @return {Promise<void>} A Promise that resolves when the order summary is displayed.
 */
    let detailedCartItems= await document.querySelectorAll(".itemElement")
const cartItemsContainer = document.querySelector('.col-md-4');
const cartI = document.querySelector('.cartCon');
let totalprice=0;
let productName="";
let productQty="";
let productPrice="";
cartI.innerHTML=""


    detailedCartItems.forEach(item=>{
        const itemElement = document.createElement('li');
        

        productName=item.querySelector(".productName").innerHTML
        productQty=item.querySelector(".productQty").value
        productPrice=item.querySelector(".productPrice").innerHTML
        itemElement.innerHTML=`


                <li>${productName} ${productPrice}(${productQty}) <span> $${productPrice.slice(1) * productQty}</span></li>
        
        `
        totalprice+=productPrice.slice(1) * productQty
        cartI.appendChild(itemElement)
        
    })
    
    let totalPric=document.querySelector(".totalPrice")

    totalPric.innerHTML=`
    Total <span>$${totalprice}</span>
            
    `

}

// Initialize cart count and fetch cart items on page load
document.addEventListener('DOMContentLoaded', async () => {
    // updateCartCount();
    await fetchCartItems();

    deleteButton=document.querySelectorAll("#delete-item")
    let selectBoxs=document.querySelectorAll(".productQty")
    
    deleteButton.forEach(button=>{
        button.addEventListener("click",async(e)=>{
        const productId = e.target.getAttribute('data-product-id');
        removeFromCart(productId)
        location.reload()
    //    await displayOrderSummary()
    })

});
    

const checkoutBtn=document.getElementById("checkout")
    checkoutBtn.addEventListener("submit",async (e)=>{

        e.preventDefault()
        if(cartLength===0){
        alert("you shopping cart is empty, please add some books in your cart")
    }
    else{
        
        const shippingInfo = {
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    country: document.getElementById('country').value,
    postalCode: document.getElementById('postalCode').value
};
console.log(shippingInfo)

document.querySelector(".animation").classList.remove("hidden")
        document.getElementById("body").classList.add("body_style")
    
    const stripe = Stripe('pk_test_51PBfXMI23B1KGZBvr0u1jx8rYbAi3Tl8wz2DGvGy2lWSK1Vh2YZAaFYwn41tHjwE3WbTB6Dg9ElN73VQvqnLNxaA00XmhuFpMT');

    try {
        /**
     * This function sends a POST request to the '/checkout' endpoint with the user's cart items and shipping information.
     * It then handles the response from the server accordingly.
     * If the response status is 401, it redirects the user to the login page.
     * If there are errors in the response, it displays the error messages on the page.
     * Otherwise, it redirects the user to the Stripe Checkout page.
     *
     * @return {Promise<void>} This function does not return anything.
     */
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    const response = await fetch('/checkout', {
        method: 'POST',
        headers: {
            "X-CSRF-Token":csrfToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            items: cartItems,
            shippingInfo:shippingInfo
        })
    }); 

    

    const data = await response.json();
    if (response.status === 401) {
        document.querySelector(".animation").classList.add("hidden")
        document.getElementById("body").classList.remove("body_style")
        window.location.href = data.redirectUrl;
    } 
    else if(data.errors){
        document.querySelector(".animation").classList.add("hidden")
        document.getElementById("body").classList.remove("body_style")
        data.errors.forEach(error => {
    document.getElementById(`${error.path.split(".")[1]}Error`).innerText = error.msg;
});

    }
    else {
        document.querySelector(".animation").classList.remove("hidden")
        document.getElementById("body").classList.add("body_style")

        // Redirect to the Stripe Checkout page
        const { error } = await stripe.redirectToCheckout({
            sessionId: data.id,
        });

        if (error) {
            console.error(error);
        }
    }
} catch (error) {
    console.error('Error:', error);
}
}


})

const reveal= document.getElementById("reveal")

reveal.addEventListener("click",()=>{
    
    if(cartLength===0){
        alert("you shopping cart is empty, please add some books in your cart")
    }
    else{
    const rev=document.querySelector(".hidden")
    rev.classList.remove("hidden")
    window.scrollTo(0,1311)
        }
})


await displayOrderSummary()

selectBoxs.forEach(box=>{
    // Iterate over each select box in the array
// Add an event listener for the "change" event on each select box
// Retrieve the cart items from localStorage and parse them as JSON, defaulting to an empty array if not found
// Get the product ID from the data attribute of the changed select box
// Get the available quantity of the product from the data attribute
// Find the product in the cart items array using the product ID
// If the product exists in the cart
// Check if the selected quantity exceeds the available stock
// Prevent the default change action and alert the user
// Update the quantity of the product in the cart
// Update the cart items in localStorage with the modified cart items array
// Update the order summary on the UI

        box.addEventListener("change",async(e)=>{
            let cartItems =await JSON.parse(localStorage.getItem('cartItems')) || [];
                const productId = e.target.getAttribute('data-product-id');
            const quantity_available=e.target.getAttribute("data-qty-available")
            let product = cartItems.find(item => item.id == productId);

            if (product) {
            if(parseInt(e.target.value)>quantity_available){
                e.preventDefault()
                alert("The quantity selected is more than the quantity available")
            }
            else{
            product.qty=parseInt(e.target.value)
            }
        } 
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
            displayOrderSummary()
        })
    })
})

window.addEventListener("load",()=>{
    // Add an event listener for the "load" event on the window object
// This code will execute when the page has fully loaded

// Select the element with the class "loading-container" for the loading animation
// Select the element with the class "container-container" for the products display

// Add the "move" class to the loading animation element to start or change its animation
// Remove the "hidden" class from the products element to make it visible

    const animation= document.querySelector(".loading-container")
    const products=document.querySelector(".container-container")

    animation.classList.add("move")
    products.classList.remove("hidden")
})
