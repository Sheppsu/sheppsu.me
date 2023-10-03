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
        link.setAttribute("href", "https://osu.ppy.sh/users/"+player.id+"/osu");
        link.innerHTML = player.name+" (#"+player.rank+")";
        link.setAttribute("target", "_blank");
        elm.appendChild(link);
        list.appendChild(elm);
    }
    return list;
}

function createDropdown(heading) {
	const container = document.createElement("div");
    container.setAttribute("class", "content tournament-container");
    container.style.backgroundColor = "var(--line-color)";
	
	const clickContainer = document.createElement("div");
    clickContainer.setAttribute("class", "tournament-click-container");
	
    const header = document.createElement("h1");
    header.setAttribute("class", "prevent-select tournament-header");
    header.innerHTML = heading;
	
	const line = document.createElement("hr");
    line.setAttribute("hidden", "");
	
    const infoContainer = document.createElement("div");
    infoContainer.setAttribute("class", "tournament-info-container");
    infoContainer.setAttribute("hidden", "");
	
	clickContainer.appendChild(header);
	container.appendChild(clickContainer);
	container.appendChild(line);
	for (var i=1; i<arguments.length; i++) {
		if (arguments[i] != null) {
			infoContainer.appendChild(arguments[i]);
		}
	}
	container.appendChild(infoContainer);
	
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
	}
	
	return container;
}

function createDivider(heading) {
	const divider = document.createElement("div");
	const header = document.createElement("h1");
	header.innerHTML = heading;
	header.setAttribute("class", "divider-header");
	const line = document.createElement("hr");
	divider.appendChild(header);
	divider.appendChild(line);
	return divider;
}

function createBanner(src) {
	const img = document.createElement("img");
	img.src = src;
	img.setAttribute("class", "banner");
	return img;
}

function createTournamentElements(data) {
	function getTournament(id) {
		for (const tournament of data.tournaments) {
			if (tournament.id == id) {
				return tournament;
			}
		}
	}
	
	const mainContainer = document.getElementById("main-container");
	
	mainContainer.appendChild(createDivider("Played in"));
	
	for (const info of data.played) {
		const tournament = getTournament(info.tournamentId);
		
		const dropdown = createDropdown(
			tournament.acronym,
			info.banner == undefined ? null : createBanner(info.banner),
			createDescriptionObject("Tournament", tournament.name),
			createDescriptionObject("Description", tournament.description),
			createDescriptionObject("Sheet/Forum post", "<a href=\""+tournament.link+"\" target=\"_blank\">"+tournament.link+"</a>"),
			createDescriptionObject("Date (MM/DD/YY)", info.dateSpan),
			createDescriptionObject("Placement", info.placement),
			createDescriptionObject("Team name", info.team),
			createPlayerList(info.players)
		);
		
		mainContainer.appendChild(dropdown);
	}
	
	for (const item of [["Hosted", data.hosted], ["Mappooled", data.mappooled], ["Streamed", data.streamed], ["Reffed", data.reffed]]) {
		mainContainer.appendChild(createDivider(item[0]));
		for (const id of item[1]) {
			const tournament = getTournament(id);
			const dropdown = createDropdown(
				tournament.acronym,
				createDescriptionObject("Tournament", tournament.name),
				createDescriptionObject("Description", tournament.description),
				createDescriptionObject("Sheet/Forum post", "<a href=\""+tournament.link+"\" target=\"_blank\">"+tournament.link+"</a>")
			);
			mainContainer.appendChild(dropdown);
		}
	}
}

fetch("static/data/tournaments.json").then(response => {
    return response.json()
}).then(createTournamentElements);
