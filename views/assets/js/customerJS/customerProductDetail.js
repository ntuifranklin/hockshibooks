document.addEventListener('DOMContentLoaded', function () {
    let input;

    let maxVal = parseInt(document.querySelector('.cart-plus-minus-box').getAttribute('max')) || 5; // Set a default max value if not specified
    
    document.querySelector('.inc').addEventListener('click', function () {
         input = this.previousElementSibling; // Select the input field
        console.log(input)
        let val = parseInt(input.value);
        if (val < maxVal) {
            input.value = val + 1;
        }
        else{
            input.value = maxVal
        }
    });

    document.querySelector('.dec').addEventListener('click', function () {
         input = this.nextElementSibling; // Select the input field
        console.log(input)

        let val = parseInt(input.value);
        if (val > 1) {
            input.value = val - 1;
        }
    });

    // Prevent manual input of values greater than the max
    document.querySelector('.cart-plus-minus-box').addEventListener('input', function () {
        let val = parseInt(this.value);
        if (val > maxVal) {
            this.value = maxVal;
        }
    });

})




window.addEventListener("load",()=>{
    const animation= document.querySelector(".loading")
    const products=document.querySelector(".container")

    animation.classList.add("move")
    products.classList.remove("hidden")
})


