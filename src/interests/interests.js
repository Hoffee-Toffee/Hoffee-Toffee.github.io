window.onload = function () {
    var interests = document.getElementById("interests");
    interests.style.paddingRight = interests.offsetWidth - interests.clientWidth + "px";

    interests.onscroll = function () {
        // Creates parallax effects based on the scroll position
        // Controls opacity and the position of elements
        
        // Get the height of the 'interests' element
        var viewportHeight = this.offsetHeight;

        // Get the scroll position of the 'interests' element
        var scrollPosition = this.scrollTop;
        
        // Get all .fg-img elements as an array
        var fgImgs = Array.from(document.getElementsByClassName("fg-img"));

        // Remove all elements from the array that are not visible
        fgImgs = fgImgs.filter(function (element) {
            return element.getBoundingClientRect().top < viewportHeight;
        });

        // Style the remaining elements according to their group or id

        // Down-in: When the user transitions into this element from the element above
        // Down-out: When the user transitions from this element into the element below
        // Up-in: When the user transitions from the element below into this element
        // Up-out: When the user transitions from this element into the element above

        if (fgImgs.includes(document.getElementById("isaac-clarke"))) { // Isaac Clarke
            // Float up on down-in, and down on up-out
            // Fades out on down-out, and fades in on up-in
            var fgImg = document.getElementById("isaac-clarke");
            // Down-in & Up-out
            if (scrollPosition >= (viewportHeight / 2 - fgImg.offsetHeight / 2) && scrollPosition <= (viewportHeight / 2 + fgImg.offsetHeight / 2)) {
                var changeInPosition = scrollPosition / 2 - fgImg.offsetHeight / 2;
                fgImg.style.top = -changeInPosition + "px";
                fgImg.style.opacity = 1;
            }
            // Above
            else if (scrollPosition < (viewportHeight / 2 - fgImg.offsetHeight / 2)) {
                fgImg.style.top = "0px";
                fgImg.style.opacity = 1;
            }
            // Down-out & Up-in
            else if (scrollPosition > (viewportHeight / 2 + fgImg.offsetHeight / 2) && scrollPosition < (viewportHeight / 2 + fgImg.offsetHeight)) {
                fgImg.style.opacity = 1 - (scrollPosition - (viewportHeight / 2 + fgImg.offsetHeight / 2)) / (fgImg.offsetHeight / 2);
                fgImg.style.top = "0px";
            }
            // Below
            else if (scrollPosition > (viewportHeight / 2 + fgImg.offsetHeight)) {
                fgImg.style.opacity = "0";
            }
        }

        if (fgImgs.includes(document.getElementById("tony-stark"))) {
            // Float up on down-in, and down on up-out
            // Float up out on down-out, and down on up-in
            var fgImg = document.getElementById("tony-stark");
            // Down-in & Up-out & Down-out & Up-in
            if (scrollPosition >= (viewportHeight * 1.5 - fgImg.offsetHeight / 2) && scrollPosition <= (viewportHeight * 1.5 + fgImg.offsetHeight * 1.5)) {
                var changeInPosition = scrollPosition / 2 - fgImg.offsetHeight;
                fgImg.style.top = -changeInPosition + "px";
            }
            // Above
            else if (scrollPosition < (viewportHeight * 1.5 - fgImg.offsetHeight / 2)) {
                fgImg.style.top = "0px";
            }
        }

        if (fgImgs.includes(document.getElementById("starship"))) { // SpaceX Starship
            // Same as Stark, except that it moves at a faster rate and shrinks slightly as it moves down
            var fgImg = document.getElementById("starship");
            // Down-in & Up-out & Down-out & Up-in
            if (scrollPosition >= (viewportHeight * 2.5 - fgImg.offsetHeight / 2) && scrollPosition <= (viewportHeight * 2.5 + fgImg.offsetHeight * 1.5)) {
                var changeInPosition = scrollPosition / 2 - fgImg.offsetHeight;
                fgImg.style.top = -changeInPosition + "px";
                fgImg.style.width = 100 - (scrollPosition - (viewportHeight * 2.5 - fgImg.offsetHeight / 2)) / (fgImg.offsetHeight / 2) * 10 + "%";
            }
            // Above
            else if (scrollPosition < (viewportHeight * 2.5 - fgImg.offsetHeight / 2)) {
                fgImg.style.top = "0px";
                fgImg.style.width = "100%";
            }
        }

        // Fade out/in the header as the user scrolls from the title to the interests
        var header = document.getElementsByTagName("header")[0];
        if (scrollPosition >= 0 && scrollPosition < viewportHeight) {
            header.style.opacity = 1 - scrollPosition / viewportHeight * 5;
            header.style.display = "block";
        }
        else if (scrollPosition >= viewportHeight) {
            header.style.opacity = "0";
            header.style.display = "none";
        }

        // Fade out/in the footer as the user scrolls from the interests to the footer
        // Last page has an id of 'interests-end'
        var footer = document.getElementsByTagName("footer")[0];
        if (scrollPosition >= document.getElementById("interests-end").offsetTop - viewportHeight && scrollPosition <= document.getElementById("interests-end").offsetTop) {
            footer.style.opacity = 1 - (document.getElementById("interests-end").offsetTop - scrollPosition) / viewportHeight * 5;
            footer.style.display = "block";
        }
        else if (scrollPosition <= document.getElementById("interests-end").offsetTop) {
            footer.style.opacity = "0";
            footer.style.display = "none";
        }

        // Get all .content divs in the 'interests' element as an array
        var divs = Array.from(this.getElementsByClassName("content"));

        // Remove the first .content div (the title)
        divs.shift();

        // Loop through each .content div
        divs.forEach(function (div) {
            // Check if between the start and end of the parallax effect
            // Parallax effect starts once you reach the 'interest' element that the div is in
            // Parallax effect ends once you reach the 'interest' element that the div is in
            if (scrollPosition >= div.parentNode.offsetTop - viewportHeight / 2 && scrollPosition <= div.parentNode.offsetTop + div.parentNode.offsetHeight - viewportHeight / 2) {
                // Calculate the change in position
                var changeInPosition = scrollPosition - div.parentNode.offsetTop - viewportHeight / 2 + div.offsetHeight / 2;

                // Change the position of the div
                div.style.top = -changeInPosition + "px";
                div.style.visibility = "visible";
            }
            // Check if before the start of the parallax effect
            else if (scrollPosition < div.parentNode.offsetTop - viewportHeight / 2) {
                div.style.visibility = "hidden";
            }
            // Check if after the end of the parallax effect, don't apply to the last .content div
            else if (scrollPosition > div.parentNode.offsetTop + div.parentNode.offsetHeight - viewportHeight / 2 && div != divs[divs.length - 1]) {
                div.style.top = "0";
                div.style.visibility = "hidden";
            }
        });
    };
};