// Run when the page has loaded
window.onload = function() {
    // Don't add the common header and footer if the page is being loaded as an iframe

    if (window.self == window.top) {
        // Add font awesome
        document.querySelector('head').insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
        // Add header
        fetch("../header.html")
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                document.querySelector("body").insertAdjacentHTML("afterbegin", data);
            });
        // Add footer
        fetch("../footer.html")
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                document.querySelector("body").insertAdjacentHTML("beforeend", data);
            });
    }
}
