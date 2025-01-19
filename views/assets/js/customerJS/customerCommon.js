
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');


async function addToCart (productId,quantity=1) {
  await fetch(`/add-to-cart/${productId}`,{
    method:"POST",
    headers: {
      "X-CSRF-Token":csrfToken,
      'Content-Type': 'application/json',
      
  },
  body:JSON.stringify({quantity:quantity})
  }).then(res=>res.data)
  .then(data=>console.log(data))

  await changeCartValue()

  // let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];


  // let product = cartItems.find(item => item.id == productId);

  //     if (product) {
  //     alert("product already exists in your shopping cart")

  //     } else {
  //         let maxVal = 1
  //         let quantity=maxVal
  //         if(document.querySelector('.cart-plus-minus-box')){
  //          maxVal = document.querySelector('.cart-plus-minus-box')

  //           quantity=maxVal.value>0?maxVal.value:1
  //         }
  //           cartItems.push({id: productId, qty:quantity});
  //         alert("Product successfully added to your cart")
  //         localStorage.setItem('cartItems', JSON.stringify(cartItems));
      

  //     }


}



// Event listener for the add to cart button



// function addToCart(productId) {
  //     // Adds a product to the user's shopping cart.
  // // 
  // // Parameters:
  // // - productId (number): The ID of the product to be added.
  // //
  // // Returns: None
  // let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
  
  // let product = cartItems.find(item => item.id == productId);
  
  //    if (product) {
    //       alert("product already exists in your shopping cart")
    
    //   } else { 
      
//       cartItems.push({ id: productId, qty: 1 });
//       const cartCountElement = document.querySelector('#cart-count');
//       const cartCount = localStorage.getItem('cartItems') || 0;
//       const items=JSON.parse(cartCount)
//        cartCountElement.textContent = items.length;
//        alert("Product successfully added to your cart")
//   }

// localStorage.setItem('cartItems', JSON.stringify(cartItems));

// }

// Event listener for the add to cart button

  // Attaches an event listener to all HTML elements with the class 'add-to-cart'.
  // When any of these elements are clicked, the event listener is triggered.
  // 
  // The event listener retrieves the 'data-product-id' attribute from the clicked element,
  // and then calls the addToCart function with this ID as an argument.
  //
  // Returns: None
  window.addEventListener('DOMContentLoaded', () => {
             
    // Select the element with the ID "cart-count"
   changeCartValue()
  });

window.addEventListener('load', () => {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
        const productId = event.target.getAttribute('data-product-id');
        // updateCartCount();
        addToCart(productId);
    });
  }); 
})
  const changeCartValue=async()=>{
    console.log("executed")
   const request= await fetch("/cartLength",{
      method:"POST",
      headers: {
        "X-CSRF-Token":csrfToken,
        'Content-Type': 'application/json',
        
    }
  })
  const response=await request.json()
  
    const cartCountElement = document.querySelector('#cart-count');

                  const cartCount = response.cartLength;
                    if(cartCount >0){   

                      cartCountElement.style.display = "block"

                     cartCountElement.textContent = cartCount
                    }
                    else{
                      cartCountElement.style.display = "none"
                    }

}