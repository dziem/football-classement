const base_url = "https://api.football-data.org/v2/";
const ids = [2002,2003,2021,2014,2015]; //league tertentu saja, biar tidak banyak

let favId = [] //favourite teams id list
getAllFav().then(function(teams) {
	teams.forEach(function(team) {
		favId.push(team.id)
	});
});

function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("timeout"))
    }, ms)
    promise.then(resolve, reject)
  })
}

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log("Error : " + error);
}

function displayLoading(aidi, home){
	let loadingHTML = "";
	if (home === true){
		loadingHTML += `<div class="full-wrapper home">`;
	}else{
		loadingHTML += `<div class="full-wrapper">`;
	}
	loadingHTML += `
		<div class="mid-content-wrapper">
		  <div class="preloader-wrapper active">
			<div class="spinner-layer spinner-red-only">
			  <div class="circle-clipper left">
				<div class="circle"></div>
			  </div><div class="gap-patch">
				<div class="circle"></div>
			  </div><div class="circle-clipper right">
				<div class="circle"></div>
			  </div>
			</div>
		  </div>
		</div>
	</div>`;
	document.getElementById(aidi).innerHTML = loadingHTML;
}

function displayLeague(data){
	document.getElementById("all").innerHTML = "";
	let leaguesHTML = "";
	data.competitions.forEach(function(league) {
		if (ids.includes(league.id)){
			leaguesHTML += `
			<div class="row flex vert league">
				<a href="./standing.html?id=${league.id}"></a>
				<div class="col s3">
					<img class="responsive-img flag" src="${league.area.ensignUrl}">        
				</div>
				<div class="col s9">
					<h4>${league.name}</h4>
					<h5>${league.area.name}</h5>
				</div>
			</div>
			<div class="divider"></div>
			`;
		}
	});
	if (leaguesHTML === ""){
		leaguesHTML += `<div class="full-wrapper home">
			<div class="mid-content-wrapper">
			<h4>No data to display</h4>
			</div>
		</div>`;
	}
	document.getElementById("all").innerHTML = leaguesHTML;
}

function noData(aidi, home){
	let noDataHTML = '';
	if (home == true){
		noDataHTML += `<div class="full-wrapper home">`;
	} else {
		noDataHTML += `<div class="full-wrapper">`;
	}
	noDataHTML += `<div class="mid-content-wrapper">
		<h4>No data to display</h4>
		</div>
	</div>`;
	document.getElementById(aidi).innerHTML = noDataHTML;
}

function getLeagues() {
	displayLoading('all', true);
	if ("caches" in window) {
		caches.match(base_url + "competitions").then(function(response) {
			if (response) {
				response.json().then(function(data) {
					displayLeague(data);
				});
			}
		});
	}

	timeout(30000, fetch(base_url + "competitions",{headers: {'X-Auth-Token': '501f768e841c4471bb160f8dbdf0d87b',}}))
		.then(status)
		.then(json)
		.then(function(data) {
			displayLeague(data);
		})
		.catch(function(error) {
			noData('all', true);
			console.log(error)
		});
}

function displayStanding(data){
	document.getElementById("body-content").innerHTML = "";
	let standingHTML = ``;
	standingHTML += `<h3 class="center-align">${data.competition.name} Standing</h3>
	<table class="striped highlight responsive-table">
		<thead>
			<tr>
				<th>No.</th>
				<th>Team</th>
				<th>GP</th>
				<th>W</th>
				<th>D</th>
				<th>L</th>
				<th>GF</th>
				<th>GA</th>
				<th>GD</th>
				<th>PTS</th>
				<th>Fav.</th>
			</tr>
		</thead>
		<tbody>
	`;
	data.standings[0].table.forEach(function(row) {
		standingHTML += `<tr>
			<td>${row.position}</td>
			<td>${row.team.name}</td>
			<td>${row.playedGames}</td>
			<td>${row.won}</td>
			<td>${row.draw}</td>
			<td>${row.lost}</td>
			<td>${row.goalsFor}</td>
			<td>${row.goalsAgainst}</td>
			<td>${row.goalDifference}</td>
			<td>${row.points}</td>
			`;
		if (favId.includes(row.team.id)){
			standingHTML += `<td><i title="remove from favourite team" class="yellow-text material-icons fav-btn" onclick="addToFavPrep(this,${row.team.id})">star</i></td></tr>`;
		}else{
			standingHTML += `<td><i title="add to favourite team" class="yellow-text material-icons fav-btn" onclick="addToFavPrep(this,${row.team.id})">star_border</i></td></tr>`;
		}
	});
	standingHTML += `</tbody>
	</table>
	`;
	if (standingHTML === ""){
		standingHTML += `<div class="full-wrapper">
			<div class="mid-content-wrapper">
			<h4>No data to display</h4>
			</div>
		</div>`;
	}
	document.getElementById("body-content").innerHTML += standingHTML;
}

function getStanding() {
	displayLoading('body-content', false);
	let urlParams = new URLSearchParams(window.location.search);
	let idParam = urlParams.get("id");
	if ("caches" in window) {
		caches.match(base_url + "competitions/" + idParam + "/standings").then(function(response) {
			if (response) {
				response.json().then(function(data) {
					displayStanding(data);
					//resolve(data);
				});
			}
		});
	}

	timeout(30000,fetch(base_url + "competitions/" + idParam + "/standings",{headers: {'X-Auth-Token': '501f768e841c4471bb160f8dbdf0d87b',}}))
    .then(status)
    .then(json)
    .then(function(data) {
		displayStanding(data);
		//resolve(data);
    })
	.catch(function(error) {
		noData('body-content', false);
		console.log(error)
	});
}

function addToFavPrep(e,id){
	if (e.innerHTML === 'star_border'){
		e.title = "remove from favourite team";
		e.innerHTML = 'star';
		fetch(base_url + "teams/" + id,{headers: {'X-Auth-Token': '501f768e841c4471bb160f8dbdf0d87b',}})
		.then(status)
		.then(json)
		.then(function(data) {
			addToFav(data)
		});
	} else {
		e.title = "add to favourite team";
		e.innerHTML = 'star_border';
		removeFromFav(id)
	}
}

function removeFavPrep(e,id){
	e.parentNode.parentNode.nextElementSibling.remove();
	e.parentNode.parentNode.remove();
	let cont = document.getElementById("my").childElementCount;
	removeFromFav(id)
	if (cont == 0){
		let noData = `<div class="full-wrapper">
			<div class="mid-content-wrapper">
			<h4>No data to display, add a favourite team first</h4>
			</div>
		</div>`;
		document.getElementById("my").innerHTML = noData;
	}
}

function getRecap(team){
	team.activeCompetitions.forEach(function(comp) {
		if (ids.includes(comp.id)){
			let recap = '';
			fetch(base_url + "competitions/" + comp.id + "/standings",{headers: {'X-Auth-Token': '501f768e841c4471bb160f8dbdf0d87b',}})
			.then(status)
			.then(json)
			.then(function(data) {
				let found = false;
				for (i = 0; i < data.standings[0].table.length; i++) { 
					let row = data.standings[0].table[i];
					if (team.id == row.team.id) {
						found = true;
						recap += `#${row.position} in ${data.competition.name}.`;
					}
					if (found == true){
						if (i > 0){
							let rowPrev = data.standings[0].table[i - 1];
							let diffPrev = rowPrev.points - row.points;
							recap += ` ${diffPrev} points to #${row.position - 1}.`;
						}
						if (i < (data.standings[0].table.length - 1)){
							let rowNext = data.standings[0].table[i + 1];
							let diffNext = row.points - rowNext.points;
							recap += ` ${diffNext} points from #${row.position + 1}.`;
						}
						break;
					}
				}
				if (found == true){
					document.getElementById(`recap-${team.id}`).innerHTML += `${recap}<br>`;
				}
			});
		}
	});
}

function displayTeams(teams){
	document.getElementById("my").innerHTML = "";
	let teamsHTML = "";
	teams.forEach(function(team) {
		teamsHTML += `
		<div class="row flex vert league">
			<a href="./team-detail.html?id=${team.id}"></a>
			<div class="col s3">
				<img class="responsive-img flag" src="${team.crestUrl}">        
			</div>
			<div class="col s8">
				<h4>${team.name}</h4>
				<h5 id="recap-${team.id}"></h5>
		</div>
			<div class="col s1">
				<i title="remove from favourite team" class="red-text material-icons fav-btn rem-fav" onclick="removeFavPrep(this,${team.id})">delete</i>
			</div>
		</div>
		<div class="divider"></div>
		`;
		getRecap(team);
	});
	if (teamsHTML === ""){
		teamsHTML += `<div class="full-wrapper home">
			<div class="mid-content-wrapper">
			<h4>No data to display, add a favourite team first</h4>
			</div>
		</div>`;
	}
	document.getElementById("my").innerHTML = teamsHTML;
}

function getSavedTeams() {
	displayLoading('my', true);
	getAllFav().then(function(teams) {
		displayTeams(teams)
	});
}

function getRecapTable(team){
	team.activeCompetitions.forEach(function(comp) {
		if (ids.includes(comp.id)){
			let recap = '';
			recap += `<h5 class="center-align">${comp.name} Standing</h5>
			<table class="striped highlight responsive-table">
				<thead>
					<tr>
						<th>No.</th>
						<th>Team</th>
						<th>GP</th>
						<th>W</th>
						<th>D</th>
						<th>L</th>
						<th>GF</th>
						<th>GA</th>
						<th>GD</th>
						<th>PTS</th>
					</tr>
				</thead>
				<tbody>
			`;
			fetch(base_url + "competitions/" + comp.id + "/standings",{headers: {'X-Auth-Token': '501f768e841c4471bb160f8dbdf0d87b',}})
			.then(status)
			.then(json)
			.then(function(data) {
				let found = false;
				for (i = 0; i < data.standings[0].table.length; i++) { 
					let row = data.standings[0].table[i];
					if (team.id == row.team.id) {
						found = true;
					}
					if (found == true){
						if (i > 0){
							let rowPrev = data.standings[0].table[i - 1];
							recap += `<tr>
							<td>${rowPrev.position}</td>
							<td>${rowPrev.team.name}</td>
							<td>${rowPrev.playedGames}</td>
							<td>${rowPrev.won}</td>
							<td>${rowPrev.draw}</td>
							<td>${rowPrev.lost}</td>
							<td>${rowPrev.goalsFor}</td>
							<td>${rowPrev.goalsAgainst}</td>
							<td>${rowPrev.goalDifference}</td>
							<td>${rowPrev.points}</td>
							`;
						}
						if (team.id == row.team.id) {
							recap += `<tr class="bold-text">
							<td>${row.position}</td>
							<td>${row.team.name}</td>
							<td>${row.playedGames}</td>
							<td>${row.won}</td>
							<td>${row.draw}</td>
							<td>${row.lost}</td>
							<td>${row.goalsFor}</td>
							<td>${row.goalsAgainst}</td>
							<td>${row.goalDifference}</td>
							<td>${row.points}</td>
							`;
						}
						if (i < (data.standings[0].table.length - 1)){
							let rowNext = data.standings[0].table[i + 1];
							recap += `<tr>
							<td>${rowNext.position}</td>
							<td>${rowNext.team.name}</td>
							<td>${rowNext.playedGames}</td>
							<td>${rowNext.won}</td>
							<td>${rowNext.draw}</td>
							<td>${rowNext.lost}</td>
							<td>${rowNext.goalsFor}</td>
							<td>${rowNext.goalsAgainst}</td>
							<td>${rowNext.goalDifference}</td>
							<td>${rowNext.points}</td>
							`;
						}
						recap += `</tbody>
						</table>`;
						break;
					}
				}
				if (found == true){
					document.getElementById(`comp-recap-${team.id}`).innerHTML += recap;
				}
			});
			if (recap == ''){
				document.getElementById(`comp-recap-${team.id}`).innerHTML += '<h5>No data to display</h5>';
			}
		}
	});
}

function displayTeamDetail(team){
	document.getElementById("body-content").innerHTML = "";
	let teamHTML = '';
	teamHTML += `<div class="row flex vert center-align team-detail">
		<div class="col s12"><img class="responsive-img team" src="${team.crestUrl}"></div>
		<div class="col s12"><h4>${team.name}</h4></div>
	</div>
	<div class="divider"></div>
	<h4 class="center-align">Competition</h4>
	<div id="comp-recap-${team.id}"></div>
	`;
	document.getElementById("body-content").innerHTML += teamHTML;
	getRecapTable(team);
}

function getTeamDetail() {
	displayLoading('body-content', false);
	let urlParams = new URLSearchParams(window.location.search);
	let idParam = urlParams.get("id");
	getById(idParam).then(function(team) {
		displayTeamDetail(team)
	})
	.catch(function(error){
		console.log(error)
	});
}