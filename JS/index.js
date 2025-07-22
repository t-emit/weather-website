// ====== WEATHER APP LOGIC ======

const apiKey = "413ec72913b67a354c344c78da5f25be"; // Your OpenWeatherMap API key

async function getWeather() {
  const cityInput = document.getElementById("cityInput");
  const city = cityInput.value.trim();

  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const weatherBox = document.getElementById("weatherBox");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City not found. Please check spelling.");
    }

    const data = await response.json();
    
    // Update the weather box content
    weatherBox.querySelector("#city").textContent = data.name;
    weatherBox.querySelector("#description").textContent = data.weather[0].description;
    weatherBox.querySelector("#temperature").textContent = `${Math.round(data.main.temp)} °C`;
    weatherBox.querySelector("#icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    // Display the weather box
    weatherBox.style.display = 'inline-block';

  } catch (error) {
    alert(error.message);
    weatherBox.style.display = 'none';
  } finally {
    cityInput.value = "";
  }
}


// ====== FEEDBACK FORM LOGIC ======

const form = document.getElementById('feedback-form');
const formStatus = document.getElementById('form-status');

form.addEventListener('submit', function(e) {
  e.preventDefault(); // Stop the default form submission

  const formData = new FormData(form);
   const submitButton = form.querySelector('button'); // Get the button

  // --- NEW: Disable the button ---
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  
  // The 'formStatus' element is no longer needed for the "Sending..." message
  // formStatus.textContent = 'Sending...';

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      formStatus.textContent = 'Thanks for your feedback!';
      formStatus.style.color = 'green';
      form.reset(); // Clear the form fields
    } else {
      formStatus.textContent = 'Oops! Something went wrong.';
      formStatus.style.color = 'red';
      console.error(data.message);
    }
  })
  .catch(error => {
    formStatus.textContent = 'Oops! An error occurred.';
    formStatus.style.color = 'red';
    console.error(error);
  }) .finally(() => {
    // --- NEW: Re-enable the button in all cases (success or error) ---
    submitButton.disabled = false;
    submitButton.textContent = 'Submit Feedback';
  });
});
// Select all buttons on the page
const buttons = document.querySelectorAll('button');

// Loop through each button
buttons.forEach(button => {
  // Add a 'click' event listener to each one
  button.addEventListener('click', function (e) {
    
    // Get the position of the click relative to the viewport
    const x = e.clientX;
    const y = e.clientY;

    // Get the position of the button itself on the page
    const buttonRect = e.target.getBoundingClientRect();
    
    // Calculate the position of the click *inside* the button
    const xInside = x - buttonRect.left;
    const yInside = y - buttonRect.top;

    // Create a <span> element for the ripple
    const ripple = document.createElement('span');
    ripple.classList.add('ripple'); // Add the .ripple class for styling
    
    // Position the ripple at the click location
    ripple.style.top = yInside + 'px';
    ripple.style.left = xInside + 'px';

    // Append the ripple to the button
    this.appendChild(ripple);

    // Remove the ripple element after the animation is done (600ms)
    // to prevent the HTML from filling up with old ripples
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});
// Add this to your JS file
document.getElementById('cityInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});