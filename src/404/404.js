// Show custom error message if applicable

var loadFunc = function () {
  // Get the 'message' parameter from the URL
  var urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams);

  var message = urlParams.get("message");

  console.log(message);

  // If there is a message, display it in the 'error-message' paragraph element

  if (message) {
    document.getElementById("error-message").innerHTML = message;
  }
};

// Run the function when the page loads, but after the default onload function has run

var oldFunc = window.onload;

window.onload = function () {
    if (typeof oldFunc === 'function') {
        oldFunc();
    }
    loadFunc();
}