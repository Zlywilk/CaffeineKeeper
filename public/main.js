window.onload = function () {
  fetch('/coffee')
    .then(response => response.json())
    .then(data => {
      const table = document.getElementById('coffee-table');
      data.forEach(coffee => {
        const row = table.insertRow();
        const nameCell = row.insertCell();
        const nameLink = document.createElement('a');
        nameLink.href = '/coffee/' + coffee._id;
        nameLink.innerText = coffee.name;
        nameCell.appendChild(nameLink);
        row.insertCell().innerText = new Date(coffee.roastDate).toLocaleDateString();
        row.insertCell().innerText = new Date(coffee.storageDate).toLocaleDateString();
        let cell = row.insertCell();
        let link = document.createElement('a');
        link.href = coffee.roasteryLink;
        link.innerText = coffee.roasteryLink;
        cell.appendChild(link);
        row.insertCell().innerText = coffee.roastLevel;
        row.insertCell().innerText = coffee.roastType;
        row.insertCell().innerText = coffee.tastingNotes.map(note => note.name).join(', ');
        row.insertCell().innerText = `${calculateRemainingWeight(coffee.portions)} g`;

        let portionsString = '';
        for (const portion of coffee.portions) {
          portionsString += `Weight: ${portion.weight} g,\n Packets: ${portion.packets} Bags\n`;
        }
        row.insertCell().innerText = portionsString;
        const qrCell = row.insertCell();
        const qrImg = document.createElement('img');
        qrImg.src = '/qr/' + coffee._id;
        qrCell.appendChild(qrImg);
      });
    });
}
function calculateRemainingWeight(portions) {
  let remainingWeight = 0;
  for (const portion of portions) {
    remainingWeight += portion.weight * portion.packets;
  }
  return remainingWeight;
}