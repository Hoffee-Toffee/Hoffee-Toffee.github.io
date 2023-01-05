// Get all my starred repos from my GitHub account
// and add them to the 'projects' div

// Will get all the repositories by Hoffee-Toffee
// The featured projects section will contain all my repos that I have starred
// The other repos section will contain all my repos that I have not starred

// Will later check if the repo is mine and if it is, add it to the projects div (unless it's this repo)

var featured_projects = document.getElementById("featured");
var other_projects = document.getElementById("other");

var request = new XMLHttpRequest();
request.open(
    "GET",
    "https://api.github.com/users/Hoffee-Toffee/starred",
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
            collabCheck(data[i]);
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

    var starred_repos = data.map(function (repo) { return repo.full_name; });

    // Do the same thing for the other projects
    var request2 = new XMLHttpRequest();
    request2.open(
        "GET",
        "https://api.github.com/users/Hoffee-Toffee/repos",
        true
    );

    request2.onload = function () {
        if (request2.status >= 200 && request2.status < 400) {
            // Success!
            var data = JSON.parse(request2.responseText);

            // Filter out the repos that are starred
            data = data.filter(function (repo) { return !starred_repos.includes(repo.full_name); });

            // Sort the data into the order of 'updated_at'
            data.sort(function (a, b) {
                return new Date(b.updated_at) - new Date(a.updated_at);
            });

            for (var i = 0; i < data.length; i++) {
                var repo = data[i];
                // Don't show the 'Hoffee-Toffee.github.io' repository
                if (
                    repo.name == "Hoffee-Toffee.github.io"
                ) {
                    continue;
                }

                // Project Card (whole card is the link)
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

                other_projects.appendChild(project);
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
        document.getElementsByTagName("h1")[2].style.opacity = "1";

        // Remove the loading icon after the transition is done and fade in each project
        setTimeout(function () {
            document.getElementById("loading-projects").remove();
        }, 500);
    }.bind(starred_repos);

    request2.onerror = function () {
        // There was a connection error of some sort
        console.log("error");

        // Fade out the loading icon (transition is 0.5s)
        document.getElementById("loading-projects").style.opacity = "0";

        // Remove the loading icon after the transition is done
        setTimeout(function () {
            document.getElementById("loading-projects").remove();
        }, 500);
    }

    request2.send();
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

setTimeout(function () {
    request.send();
}, 500);

function collabCheck(repo) {
    // Don't show the 'Hoffee-Toffee.github.io' repository, or any repos that 'Hoffee-Toffee' isn't a contributor of
    if (repo.name == "Hoffee-Toffee.github.io") return;
    
    // Get the collaborators of the repo
    var collaborators_request = new XMLHttpRequest();
    collaborators_request.open(
        "GET",
        "https://api.github.com/repos/" + repo.full_name + "/contributors",
        true
    );
    
    collaborators_request.onload = function () {
        if (collaborators_request.status < 200 || collaborators_request.status >= 400) return;

        // Check if 'Hoffee-Toffee' is a contributor of the repo
        var collaborators = JSON.parse(collaborators_request.responseText);
        console.log(collaborators);
        var is_contributor = false;
        for (var j = 0; j < collaborators.length; j++) {
            if (collaborators[j].login == "Hoffee-Toffee") {
                is_contributor = true;
                break;
            }
        }

        if (!is_contributor) return;

        // Project Card (div)
        var project = document.createElement("div");
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
            "https://raw.githubusercontent.com/Hoffee-Toffee/" +
            repo.name +
            "/master/screenshot.png";
        project.appendChild(screenshot);

        screenshot.onerror = function () {
            console.log("error loading screenshot");
            var embed = document.createElement("iframe");
            embed.src = "../404/404.html?message=" + this.parentNode.id + " repo screenshot not found.";

            this.parentNode.appendChild(embed);
            this.remove();
        }

        // Add a link to the project repo and a link to the live project
        var links = document.createElement("div");
        links.className = "project-links";

        var repo_link = document.createElement("a");
        repo_link.href = repo.html_url;
        repo_link.target = "_blank";
        repo_link.innerHTML = "View Repo";

        var live_link = document.createElement("a");
        live_link.href = "/" + repo.name + "/index.html";
        live_link.target = "_blank";
        live_link.innerHTML = "Run Repo";

        links.appendChild(repo_link);
        links.appendChild(live_link);
        project.appendChild(links);

        featured_projects.appendChild(project);
    }

    collaborators_request.send();
}