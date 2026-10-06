(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()

const filterBtn = document.querySelector("#filterBtn");
const filterBox = document.querySelector("#filterBox");

const minPrice = document.querySelector("#minPrice");
const maxPrice = document.querySelector("#maxPrice");

const applyFilter = document.querySelector("#applyFilter");
const clearFilter = document.querySelector("#clearFilter");


// FILTER BOX OPEN / CLOSE

filterBtn.addEventListener("click", () => {

    if (filterBox.style.display === "block") {
        filterBox.style.display = "none";
    } else {
        filterBox.style.display = "block";
    }

});


// APPLY FILTER

applyFilter.addEventListener("click", () => {

    const min = Number(minPrice.value) || 0;
    const max = Number(maxPrice.value) || Infinity;

    const listings = document.querySelectorAll(".list-links");

    listings.forEach((listing) => {

        const price = Number(listing.dataset.price);

        if (price >= min && price <= max) {

            listing.style.display = "";

        } else {

            listing.style.display = "none";

        }

    });

    filterBox.style.display = "none";

});


// CLEAR FILTER

clearFilter.addEventListener("click", () => {

    minPrice.value = "";
    maxPrice.value = "";

    const listings = document.querySelectorAll(".list-links");

    listings.forEach((listing) => {

        listing.style.display = "";

    });

    filterBox.style.display = "none";

});