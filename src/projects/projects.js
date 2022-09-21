// Get all my starred repos from my GitHub account
// and add them to the 'projects' div

// Use https://api.github.com/users/Transit-Lumber/starred to get all the repositories starred by Transit-Lumber
// Will later check if the repo is mine and if it is, add it to the projects div (unless it's this repo)

var projects = document.getElementById("projects");

var request = new XMLHttpRequest();
request.open(
    "GET",
    "https://api.github.com/users/Transit-Lumber/starred",
    true
);

request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);

        // Sort the data into the order of 'updated_at'
        data.sort(function (a, b) {
            return new Date(b.updated_at) - new Date(a.updated_at);
        });

        for (var i = 0; i < data.length; i++) {
            var repo = data[i];
            // Don't show the 'transit-lumber.github.io' repository, or any repos that 'Transit-Lumber' doesn't own
            if (
                repo.name == "Transit-Lumber.github.io" ||
                repo.owner.login != "Transit-Lumber"
            ) {
                continue;
            }

            // Project Link (whole card is the link)
            var project = document.createElement("a");
            project.id = repo.name;
            project.className = "project";
            project.href = repo.html_url;
            project.target = "_blank";

            // Project Title (H3)
            var title = document.createElement("h3");
            title.innerHTML = repo.name;
            project.appendChild(title);

            // Project Description
            var description = document.createElement("p");
            description.innerHTML = repo.description;
            project.appendChild(description);

            // Display a screenshot of the project if it has one, otherwise display a placeholder embed
            var screenshot = document.createElement("img");
            screenshot.src =
                "https://raw.githubusercontent.com/Transit-Lumber/" +
                repo.name +
                "/master/screenshot.png";
            project.appendChild(screenshot);

            screenshot.onerror = function () {
                console.log("error loading screenshot");
                var embed = document.createElement("iframe");
                embed.src = "../404-page/404-page.html?message=" + this.parentNode.id + " repo screenshot not found.";

                this.parentNode.appendChild(embed);
                this.remove();
            }

            projects.appendChild(project);
        }
    } else {
        // We reached our target server, but it returned an error
        console.log("error");
        // Fade out the loading icon (transition is 0.5s)
        document.getElementById("loading-projects").style.opacity = "0";

        // Remove the loading icon after the transition is done
        setTimeout(function () {
            document.getElementById("loading-projects").remove();
        }, 500);
    }

    // Fade out the loading icon (transition is 0.5s)
    document.getElementById("loading-projects").style.opacity = "0";

    // Remove the loading icon after the transition is done and fade in each project
    setTimeout(function () {
        document.getElementById("loading-projects").remove();
    }, 500);
};
request.onerror = function () {
    // There was a connection error of some sort
    console.log("connection error");
    // Fade out the loading icon (transition is 0.5s)
    document.getElementById("loading-projects").style.opacity = "0";

    // Remove the loading icon after the transition is done
    setTimeout(function () {
        document.getElementById("loading-projects").remove();
    }, 500);

    // Redirect to the 404 page

    window.location.href = "../404-page/404-page.html?message=Error loading projects.";
};
request.send();
