(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
})()
  
document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitch = document.getElementById("theme-toggle");
  const body = document.body;

  // Apply stored preference
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    toggleSwitch.checked = true;
  }

  // Listen for toggle
  toggleSwitch.addEventListener("change", () => {
    if (toggleSwitch.checked) {
      body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });
});

// Toggle filters on button click
  document
    .getElementById("showFiltersBtn")
    .addEventListener("click", function () {
      const filters = document.getElementById("filters");
      filters.classList.toggle("show-all");

      // Change button text dynamically
      if (filters.classList.contains("show-all")) {
        this.textContent = "Hide Filters";
      } else {
        this.textContent = "Show All Filters";
      }
    });

