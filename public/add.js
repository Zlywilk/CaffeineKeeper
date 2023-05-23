document.addEventListener("DOMContentLoaded", function() {
  const addPortionButton = document.getElementById("add-portion-button");
  const portionsContainer = document.getElementById("portions-container");
  let portionsCount = 0;

  addPortionButton.addEventListener("click", function() {
    const portionDiv = document.createElement("div");
    portionDiv.classList.add("form-group", "portion-item");

    const weightInputGroup = document.createElement("div");
    weightInputGroup.classList.add("input-group", "mb-3");

    const weightInput = document.createElement("input");
    weightInput.type = "number";
    weightInput.name = `portions[${portionsCount}][weight]`;
    weightInput.placeholder = "Weight";
    weightInput.classList.add("form-control");

    const weightInputAppend = document.createElement("div");
    weightInputAppend.classList.add("input-group-append");

    const weightInputAppendText = document.createElement("span");
    weightInputAppendText.classList.add("input-group-text");
    weightInputAppendText.textContent = "g";

    weightInputAppend.appendChild(weightInputAppendText);
    weightInputGroup.appendChild(weightInput);
    weightInputGroup.appendChild(weightInputAppend);

    const packetsInputGroup = document.createElement("div");
    packetsInputGroup.classList.add("input-group", "mb-3");

    const packetsInput = document.createElement("input");
    packetsInput.type = "number";
    packetsInput.name = `portions[${portionsCount}][packets]`;
    packetsInput.placeholder = "Packets";
    packetsInput.classList.add("form-control");

    const packetsInputAppend = document.createElement("div");
    packetsInputAppend.classList.add("input-group-append");

    const packetsInputAppendText = document.createElement("span");
    packetsInputAppendText.classList.add("input-group-text");
    packetsInputAppendText.textContent = "Bags";

    packetsInputAppend.appendChild(packetsInputAppendText);
    packetsInputGroup.appendChild(packetsInput);
    packetsInputGroup.appendChild(packetsInputAppend);

    portionDiv.appendChild(weightInputGroup);
    portionDiv.appendChild(packetsInputGroup);

    portionsContainer.appendChild(portionDiv);

    portionsCount++;
  });
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
        window.location.href ="/"
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
});
