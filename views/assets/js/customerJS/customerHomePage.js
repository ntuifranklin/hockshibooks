window.addEventListener("load",()=>{
    // Attaches an event listener to the window object that triggers when the page has finished loading.
    // 
    // When the page finishes loading, the event listener function is executed.
    // 
    // The function selects the element with the class 'timeline-wrapper' and assigns it to the variable 'animation'.
    // It also selects the element with the class 'product-list' and assigns it to the variable 'products'.
    // 
    // The function then adds the class 'move' to the 'animation' element and removes the class 'hidden' from the 'products' element.
    //
    // Returns: None

    document.querySelectorAll('.add-to-cart').forEach(button => {
button.addEventListener('click', (event) => {
const productId = event.target.getAttribute('data-product-id');
// updateCartCount();
addToCart(productId);
});
});
const animation= document.querySelector(".timeline-wrapper")
const products=document.querySelector(".product-list")

animation.classList.add("move")
products.classList.remove("hidden")

})

// Initialize cart count on page load

