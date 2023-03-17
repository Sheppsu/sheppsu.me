function createDescriptionObject(label, value) {
    const paragraph = document.createElement("p");
    paragraph.innerHTML = "<b>"+label+":</b> "+value;
    return paragraph;
}

function createPlayerList(players) {
    const list = document.createElement("ul");
    list.style.paddingLeft = 0;
    for (const player of players) {
        const elm = document.createElement("li");
        elm.style.listStyleType = "none";
        const link = document.createElement("a");
        link.setAttribute("href", "https://osu.ppy.sh/u/"+player.id);
        link.innerHTML = player.name+" (#"+player.rank+")";
        link.setAttribute("target", "_blank");
        elm.appendChild(link);
        list.appendChild(elm);
    }
    return list;
}

function createTournamentElements(data) {
    const mainContainer = document.getElementById("main-container");
    mainContainer.innerHTML = "";
    for (const tournament of data) {
        const container = document.createElement("div");
        container.setAttribute("class", "content tournament-container");
        container.style.backgroundColor = "var(--line-color)";
        const clickContainer = document.createElement("div");
        clickContainer.setAttribute("class", "tournament-click-container");
        const header = document.createElement("h1");
        header.setAttribute("class", "tournament-header");
        header.innerHTML = tournament.name;

        const line = document.createElement("hr");
        line.setAttribute("hidden", "");
        const infoContainer = document.createElement("div");
        infoContainer.setAttribute("class", "tournament-info-container");
        infoContainer.setAttribute("hidden", "");

        const description = createDescriptionObject("Description", tournament.description);
        const link = createDescriptionObject("Sheet/Forum post", "<a href=\""+tournament.link+"\" target=\"_blank\">"+tournament.link+"</a>");
		const dateSpan = createDescriptionObject("Date", tournament.dateSpan);
        const placement = createDescriptionObject("Placement", tournament.placement);
        const team = createDescriptionObject("Team name", tournament.team);
        const playerList = createPlayerList(tournament.players)

        infoContainer.appendChild(description);
        infoContainer.appendChild(link);
		infoContainer.appendChild(dateSpan);
        infoContainer.appendChild(placement);
        infoContainer.appendChild(team);
        infoContainer.appendChild(playerList);
        clickContainer.appendChild(header);
        container.appendChild(clickContainer);
        container.appendChild(line);
        container.appendChild(infoContainer);
        mainContainer.appendChild(container);

        clickContainer.style.cursor = "pointer";
        clickContainer.onclick = function() {
            if (line.hasAttribute("hidden")) {
                line.removeAttribute("hidden");
                infoContainer.removeAttribute("hidden");
                container.style.backgroundColor = "";
            } else {
                line.setAttribute("hidden", "");
                infoContainer.setAttribute("hidden", "");
                container.style.backgroundColor = "var(--line-color)";
            }
        };
    }
}

fetch("data/tournaments.json").then(response => {
    return response.json()
}).then(createTournamentElements);
