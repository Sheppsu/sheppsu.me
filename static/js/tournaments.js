var winCount = 0;
var ffWinCount = 0;
var ffLossCount = 0;
var totalMatches = 0;
var totalQualifiers = 0;
var totalDNQ = 0;
var pointsWon = 0;
var pointsLost = 0;
var firstPlaces = 0;
var secondPlaces = 0;
var thirdPlaces = 0;


function createMatchText(match) {
	const text = document.createElement("p");
		
	if (match.myScore == null) {
		text.innerHTML = `<a href="https://osu.ppy.sh/mp/${match.id}" target="_blank">${match.round}</a>`;
	} else {
		const scoreClass = match.myScore > match.oScore ? "win-text" : "loss-text";
		const score = (match.myScore == -1 || match.oScore == -1) ? "FF" : `${match.myScore}-${match.oScore}`;
		const opponent = match.id == null ? match.opponent : `<a href="https://osu.ppy.sh/mp/${match.id}" target="_blank">${match.opponent}</a>`;
		text.innerHTML = `<span class="${scoreClass}">${score}</span> <b>${match.round}</b> vs ${opponent}`;
	}
	
	if (match.notes != undefined) {
		text.innerHTML += "</br>"+match.notes;
	}
	
	if (match.myScore != undefined && match.oScore != undefined) {
		pointsWon += Math.max(0, match.myScore);
		pointsLost += Math.max(0, match.oScore);
		totalMatches += 1;
	} else {
		totalQualifiers += 1;
	}
	if (match.myScore > match.oScore) {
		
		winCount += 1;
		if (match.oScore == -1) {
			ffWinCount += 1;
		} else if (match.myScore == -1) {
			ffLossCount += 1;
		}
	}
		
	return text;
}

function createMatchesDropdown(matches) {
	const container = document.createElement("div");
	
	const matchesLabel = document.createElement("p");
	matchesLabel.innerHTML = "Matches";
	matchesLabel.setAttribute("class", "dropdown-text");
	
	const matchesContainer = document.createElement("div");
	matchesContainer.setAttribute("hidden", "");
	
	container.appendChild(matchesLabel);
	container.appendChild(matchesContainer);
	
	for (const match of matches) {
		matchesContainer.appendChild(createMatchText(match));
	}
	
	matchesLabel.onclick = function() {
		if (matchesContainer.hasAttribute("hidden")) {
			matchesContainer.removeAttribute("hidden");
		} else {
			matchesContainer.setAttribute("hidden", "");
		}
	}
	
	return container;
}

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
	
	mainContainer.appendChild(createDivider("Tournament Stats"));
	const statsContainer = document.createElement("div");
	mainContainer.appendChild(statsContainer);
	
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
			createPlayerList(info.players),
			info.matches == undefined ? null : createMatchesDropdown(info.matches)
		);
		
		mainContainer.appendChild(dropdown);
		
		if (info.placement.startsWith("1st")) {
			firstPlaces += 1;
		}
		if (info.placement.startsWith("2nd")) {
			secondPlaces += 1;
		}
		if (info.placement.startsWith("3rd")) {
			thirdPlaces += 1;
		}
		if (info.placement.includes("DNQ")) {
			totalDNQ += 1;
		}
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
	
	function addStat(text) {
		const p = document.createElement("p");
		p.innerHTML = text;
		statsContainer.appendChild(p);
	}
	
	addStat(`Matches played: ${totalMatches}`);
	addStat(`Matches won/lost: ${winCount}/${totalMatches-winCount} (${(winCount / totalMatches * 100).toPrecision(4)}% wr)`);
	addStat(`Qualifiers played: ${totalQualifiers}`);
	const totalQualify = totalQualifiers-totalDNQ;
	addStat(`Qualify rate: ${totalQualify}/${totalQualifiers} (${(totalQualify / totalQualifiers * 100).toPrecision(4)}%)`);
	addStat(`FF win/loss count: ${ffWinCount}/${ffLossCount}`);
	addStat(`Points won/lost: ${pointsWon}/${pointsLost}`);
	addStat(`#1 placements: ${firstPlaces}`);
	addStat(`#2 placements: ${secondPlaces}`);
	addStat(`#3 placements: ${thirdPlaces}`);
}

fetch("static/data/tournaments.json").then(response => {
    return response.json()
}).then(createTournamentElements);
