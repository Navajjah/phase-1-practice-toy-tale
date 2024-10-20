let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// Fetch Toys Function
function fetchToys() {
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      const toyCollectionDiv = document.getElementById('toy-collection');
      toys.forEach(toy => {
        const cardDiv = createToyCard(toy);
        toyCollectionDiv.appendChild(cardDiv);
      });
    })
    .catch(error => console.error('Error fetching toys:', error));
}

// Create Toy Card Function
function createToyCard(toy) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'card';

  const h2 = document.createElement('h2');
  h2.innerText = toy.name;

  const img = document.createElement('img');
  img.src = toy.image;
  img.className = 'toy-avatar';

  const p = document.createElement('p');
  p.innerText = `${toy.likes} Likes`;

  const button = document.createElement('button');
  button.className = 'like-btn';
  button.id = toy.id;
  button.innerText = 'Like ❤️';
  button.addEventListener('click', () => increaseLikes(toy));

  cardDiv.append(h2, img, p, button);
  return cardDiv;
}

// Add New Toy Function (You can insert the relevant event listener here)
const toyForm = document.querySelector('form'); // Adjust this selector based on your HTML structure
toyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = event.target.name.value; // Assuming there's an input named 'name'
  const image = event.target.image.value; // Assuming there's an input named 'image'

  addNewToy(name, image);
});

// Add New Toy Function
function addNewToy(name, image) {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name: name,
      image: image,
      likes: 0
    })
  })
  .then(response => response.json())
  .then(toy => {
    const toyCollectionDiv = document.getElementById('toy-collection');
    const cardDiv = createToyCard(toy);
    toyCollectionDiv.appendChild(cardDiv);
    toyForm.reset(); // Reset form fields
  })
  .catch(error => console.error('Error adding toy:', error));
}

// Increase Toy's Likes Function
function increaseLikes(toy) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: newLikes
    })
  })
  .then(response => response.json())
  .then(updatedToy => {
    const toyCard = document.getElementById(toy.id).parentElement; // Get the card element
    toyCard.querySelector('p').innerText = `${updatedToy.likes} Likes`; // Update the likes count
  })
  .catch(error => console.error('Error updating likes:', error));
}
