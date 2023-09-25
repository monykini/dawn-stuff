

document.addEventListener('DOMContentLoaded', function() {
    const scriptTag = document.querySelector('#emptyProductJson');
    const productData = JSON.parse(scriptTag.textContent);
    console.log("🚀 ~ file: ab-empty-cart-products.js:4 ~ document.addEventListener ~ productData:", productData)

    function connectVaraintsJS(){
        const variantSelect = document.querySelector('.cart-drawer__best-sellers .product-variant');
        if(!variantSelect){
            return;
        }
        const addToCartButton = document.querySelector('.cart-drawer__best-sellers .add-to-cart');
        const quantityInput = document.querySelector('.cart-drawer__best-sellers .quantity__input');

        variantSelect.addEventListener('change', function() {
            const selectedVariantId = variantSelect.value;
            addToCartButton.setAttribute('data-variant-id', selectedVariantId);
            const selectedVariant = productData.variants.find(variant => variant.id.toString() === selectedVariantId);
            if (selectedVariant) {
                const selectedVariantNameElement = document.querySelector('.cart-drawer__best-sellers .seleced-varaint-name');
                const productPriceElement = document.querySelector('.cart-drawer__best-sellers .product-price');
                selectedVariantNameElement.textContent = selectedVariant.title;
                productPriceElement.textContent = Shopify.currency.active + " " + (selectedVariant.price / 100).toFixed(2);
            }
        });

        addToCartButton.addEventListener('click', function() {
        const variantId = addToCartButton.getAttribute('data-variant-id');
        const quantity = quantityInput.value;
        addItemToCart(variantId, quantity , this);
        });
    }
    

    function addItemToCart(variantId, quantity , button) {
        const cartDrawer = document.querySelector("body > cart-drawer")
        button.classList.add('loading')
        fetch('/cart/add.js?sections: cart-drawer,cart-icon-bubble', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            items: [{
              id: variantId,
              quantity: parseInt(quantity)
            }],
            sections: 'cart-drawer,cart-icon-bubble'
          })
        })
        .then(response => response.json())
        .then(cart => {
          cartDrawer.renderContents(cart);
          cartDrawer.classList.remove('is-empty');
        })
        .finally(() => {
            button.classList.remove('loading')
        });
    }

    subscribe(PUB_SUB_EVENTS.cartUpdate, function(eventData) {
        // eventData will contain the data published with the event.
        connectVaraintsJS();
    });

    connectVaraintsJS();
    // const quantityInput = document.querySelector('.quantity__input');
    // const plusButton = document.querySelector('[name="plus"]');
    // const minusButton = document.querySelector('[name="minus"]');

    // plusButton.addEventListener('click', function() {
    //   let currentQuantity = parseInt(quantityInput.value, 10);
    //   quantityInput.value = currentQuantity + 1;
    // });

    // minusButton.addEventListener('click', function() {
    //   let currentQuantity = parseInt(quantityInput.value, 10);
    //   if (currentQuantity > 1) {
    //     quantityInput.value = currentQuantity - 1;
    //   }
    // });
});