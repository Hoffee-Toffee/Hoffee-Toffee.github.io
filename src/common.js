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
                window.scrollTo(0, 1);
                window.scrollTo(0, 0);
            });
    }

    window.onscroll = function() {
        var scroll = window.scrollY;

        // Make the header fade out as the user scrolls down the page
        var header = document.querySelector("header");
        var header_height = header.clientHeight;
        var opacity = 1 - scroll / header_height;
        header.style.opacity = opacity;

        // If it's less than half transparent, make the header not clickable
        if (opacity < 0.5) {
            header.style.pointerEvents = "none";
        }
        else {
            header.style.pointerEvents = "auto";
        }

        // Make the footer fade in as the user nears the bottom of the page
        var footer = document.querySelector("footer");
        var footer_height = footer.clientHeight;
        var offset = document.getElementsByTagName("body")[0].clientHeight;
        var opacity = -3 - (offset - scroll - window.innerHeight - footer_height) / footer_height;
        footer.style.opacity = opacity;

        // If it's less than half transparent, make the footer not clickable
        if (opacity < 0.5) {
            footer.style.pointerEvents = "none";
        }
        else {
            footer.style.pointerEvents = "auto";
        }
    }

    // Run the same function when the window is resized
    window.onresize = function() {
        window.onscroll();
    }
}