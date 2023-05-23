function addPortion() {
    const portionsContainer = document.getElementById('portions-container');

    const portionCount = portionsContainer.children.length;

    const portionDiv = document.createElement('div');
    portionDiv.setAttribute('class', 'form-group'); 

    const weightInput = document.createElement('input');
    weightInput.setAttribute('type', 'number');
    weightInput.setAttribute('name', `portions[${portionCount}][weight]`);
    weightInput.setAttribute('placeholder', 'Weight');
    weightInput.setAttribute('class', 'form-control');
    portionDiv.appendChild(weightInput);

    const packetsInput = document.createElement('input');
    packetsInput.setAttribute('type', 'number');
    packetsInput.setAttribute('name', `portions[${portionCount}][packets]`);
    packetsInput.setAttribute('placeholder', 'Packets');
    packetsInput.setAttribute('class', 'form-control');
    portionDiv.appendChild(packetsInput);

    portionsContainer.appendChild(portionDiv);
  }
  const form = document.getElementById("add-coffee-form");
const errorContainer = document.getElementById("error-container");

  form.addEventListener("submit", function(event) {
  event.preventDefault();

  const formData = new FormData(form);

  fetch(form.action, {
    method: "POST",
    body: formData
  })
  .then(response => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return response.json();
    } else {
        window.location.href =`/coffee/${window.location.href.split("/")[5]}`
    }
  })
  .then(data => {
    if (data.error) {
      showError(`${data.error}(${data.missingFields[0]})`);
    } else {
      // Handle success
      console.log(data);
    }
  })
  .catch(error => {
    // Handle error
    console.error(error);
  });
});

function showError(message) {
  const errorAlert = document.createElement("div");
  errorAlert.classList.add("alert", "alert-danger");
  errorAlert.textContent = message;

  errorContainer.innerHTML = "";
  errorContainer.appendChild(errorAlert);
}