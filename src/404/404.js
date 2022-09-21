// Show custom error message if applicable

window.onload = function () {
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