
async function addToCart (productId) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];


  let product = cartItems.find(item => item.id == productId);

      if (product) {
      alert("product already exists in your shopping cart")

      } else {
          let maxVal = 1
          let quantity=maxVal
          if(document.querySelector('.cart-plus-minus-box')){
           maxVal = document.querySelector('.cart-plus-minus-box')

            quantity=maxVal.value>0?maxVal.value:1
          }
            cartItems.push({id: productId, qty:quantity});
          alert("Product successfully added to your cart")
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
           changeCartValue()
      

      }


}

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
const changeCartValue=()=>{
  const cartCountElement = document.querySelector('#cart-count');

                const cartCount = localStorage.getItem('cartItems');
                  if(cartCount && JSON.parse(cartCount).length>0){   

                    cartCountElement.style.display = "block"
                    const items=JSON.parse(cartCount)

                    cartCountElement.textContent = items.length;
                  }
                  else{
                    cartCountElement.style.display = "none"
                  }

}