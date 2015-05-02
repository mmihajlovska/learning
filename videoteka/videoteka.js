var lSub = localStorage.lastSubmit;
model = lSub ? JSON.parse(lSub) : {
	users : [ {
		ime : 'Marina',
		prezime : 'Mihajlovska',
		data : '15.07.86',
		tel : '908',
		rentedMovies : []
	} ],
	movies : [ {
		ime : 'Rambo',
		god : '1900',
		user : ''
	} ]
};
changed = 0;
var activeUsers = false;
var activeMovies = false;
var checkbox = false;

function hideStart() {
	$(".searchFormUser").hide();
	$(".searchFormMovie").hide();
	$("#rMov").hide();
	$("#back").hide();
	$("#formMovie").hide();
	$("#formUser").hide();
	$("#user").hide();
	$("#movie").hide();
	$("#sliderFrame").slideDown('slow');
	$("#title").slideDown('slow');
}

function hide(id1, id2, id3) {
	$(id1).hide();
	$(id2).hide();
	$(id3).slideDown('fast');
}

function checkModel() {
	if (activeUsers) {
		var m = model.users;
	} else if (activeMovies) {
		var m = model.movies;
	}
	return m;
}

function add() {
	var m = checkModel();
	if (activeUsers) {
		m.push(dataUser());
	} else {
		m.push(dataMovie());
	}
	submit();
	refresh(m);
}

function emptyTable() {
	var k = $('#rediciteF');
	k.empty();
	var f = $('#rediciteK');
	f.empty();
}

function refresh(m) {
	emptyTable();
	var html = '';
	for (var i = 0; i < m.length; i++) {
		var k = m[i];
		html += constructionTable(i, k);
		if (activeUsers) {
			elem('rediciteK').innerHTML = html;
			hide("#formUser", "#movie", "#user");
		} else {
			elem('rediciteF').innerHTML = html;
			hide("#formMovie", "#user", "#movie");
		}
	}
}

function td(s) {
	return '<td>' + s + '</td>';
}

function inputVal(ime, prezime, data, tel, god) {
	if (activeUsers) {
		$('#imeKorisnici').val(ime);
		$('#prezimeKorisnici').val(prezime);
		$('#dataNaRaganje').val(data);
		$('#tel').val(tel);
	} else {
		$('#imeFilmovi').val(ime);
		$('#god').val(god);
	}
}

function renameUser(i) {
	var m = model.users;
	hide('#user', '#submitUser', '#formUser');
	$('#renameUser').show();
	inputVal(m[i].ime, m[i].prezime, m[i].data, m[i].tel, '');
	submit();
	changed = i;
	$('#renameUser').click(function() {
		m[changed] = dataUser();
		hide('#renameUser', '#formUser', '#user');
		refresh(m);
	});
}

function renameMovie(i) {
	var m = model.movies;
	hide('#movie', '#submitMovie', '#formMovie');
	$('#renameMovie').show();
	inputVal(m[i].ime, '', '', '', m[i].god);
	submit();
	changed = i;
	$('#renameMovie').click(function() {
		m[changed] = dataMovie();
		hide('#renameMovie', '#formMovie', '#movie');
		refresh(m);
	});
}

function rename(i) {
	if (activeUsers) {
		renameUser(i);
	} else {
		renameMovie(i);
	}
}

var u;

function checkboxClick(i) {
	checkbox = false;
	if (checkbox) {
		checkbox = false;
	} else {
		checkbox = true;
		u = i;
	}
}

function rentMovie(i) {
	if (model.movies[i].user == '') {
		model.movies[i].user = model.users[u].ime;
		model.users[u].rentedMovies.push({
			name : model.movies[i].ime,
			dateRent : Date(),
			dateReturn : ''
		});
	}
	submit();
	refresh(checkModel());

}

function showRentedMovies(i) {
	var rM = $('#rentedMovies');
	rM.empty();
	var html = '';
	hide("#user", "#movie", "#rMov");
	for (var j = 0; j < model.users[i].rentedMovies.length; j++) {
		html += '<tr><td>' + model.users[i].rentedMovies[j].name + '</td><td>'
				+ model.users[i].rentedMovies[j].dateRent + '</td><td>'
				+ model.users[i].rentedMovies[j].dateReturn + '</td></tr>';
		elem('rentedMovies').innerHTML = html;
	}
	$('#back').show();
	$('#back').click(function() {
		hide("#back", "#rMov", "#user");
	});
}

function returnMovies(i) {
	for (var j = 0; j < model.users.length; j++) {
		for (var k = 0; k < model.users[j].rentedMovies.length; k++) {
			if (model.users[j].rentedMovies[k].name == model.movies[i].ime) {
				model.users[j].rentedMovies[k].dateReturn = Date();
			}
		}
	}
	model.movies[i].user = '';
	submit();
	refresh(checkModel());
}

function constructionTable(i, pr) {
	if (activeUsers) {
		var edit = '<button class="btn btn-success" onclick="rename(' + i
				+ ');">Edit</button>';
		var rentedM = '<button class="btn btn-info" onclick="showRentedMovies('
				+ i + ');">Rented movies</button>';
		var checkbox = '<input type="checkbox" onclick="checkboxClick(' + i
				+ ');">';
		var d = '<button class="btn btn-danger" onclick="del(' + i
				+ ');">Delete</button>';
		return '<tr>' + td(pr.ime) + td(pr.prezime) + td(pr.data) + td(pr.tel)
				+ td(checkbox + ' ' + rentedM + ' ' + edit + ' ' + d) + '</tr>';
	} else {
		var edit = '<button class="btn btn-success" onclick="rename(' + i
				+ ');">Edit</button>';
		var rentMovie = '<button class="btn btn-info" onclick="rentMovie(' + i
				+ ');">Rent Movie</button>';
		var d = '<button class="btn btn-danger" onclick="del(' + i
				+ ');">Delete</button>';
		var returnM = '<button class="btn btn-warning" onclick="returnMovies('
				+ i + ');">Return Movie</button>';
		return '<tr>' + td(pr.ime) + td(pr.god) + td(pr.user)
				+ td(rentMovie + ' ' + returnM + ' ' + edit + ' ' + d)
				+ '</tr>';
	}
}

function dataUser() {
	var ime = document.getElementById('imeKorisnici').value;
	var prezime = document.getElementById('prezimeKorisnici').value;
	var dataNaRaganje = document.getElementById('dataNaRaganje').value;
	var tel = document.getElementById('tel').value;
	var korisnik = {
		ime : ime || '',
		prezime : prezime || '',
		data : dataNaRaganje || '',
		tel : tel || '',
		rentedMovies : []
	};
	return korisnik;
}

function dataMovie() {
	var ime = document.getElementById('imeFilmovi').value;
	var god = document.getElementById('god').value;
	var film = {
		ime : ime || '',
		god : god || '',
		user : ''
	};
	return film;
}

function submit() {
	localStorage.lastSubmit = JSON.stringify(model);
}

function newUser() {
	hide("#user", "#formMovie", "#formUser");
	$("#movie").hide();
	$('#submitUser').show();
	inputVal('', '', '', '', '');
}

function newMovie() {
	hide("#movie", "#formUser", "#formMovie");
	$("#user").hide();
	$('#submitMovie').show();
	inputVal('', '', '', '', '');
}

function user() {
	activeUsers = true;
	activeMovies = false;
	hide("#movie", "#renameUser", "#user");
	$('#formMovie').slideUp('slow');
	$("#rMov").slideUp('slow');
	$("#back").slideUp('slow');
	$("#sliderFrame").slideUp('slow');
	$("#title").slideUp('slow');
	refresh(checkModel());
	$(".searchFormMovie").hide();
	$(".searchFormUser").show();
}

function movie() {
	activeUsers = false;
	activeMovies = true;
	hide("#user", "#renameMovie", "#movie");
	$('#formUser').slideUp('slow');
	$("#rMov").slideUp('slow');
	$("#back").slideUp('slow');
	$("#sliderFrame").slideUp('slow');
	$("#title").slideUp('slow');
	refresh(checkModel());
	$(".searchFormUser").hide();
	$(".searchFormMovie").show();
}

function elem(id) {
	return document.getElementById(id);
}

function val(id) {
	return elem(id).value;
}

function searchUser() {
	elem('rediciteK').innerHTML = '';
	var filter = val('prebaruvajKorisnik');
	for (var j = 0; j < model.users.length; j++) {
		var k = model.users[j];
		var a = k.ime.substring(0, filter.length);
		var b = k.prezime.substring(0, filter.length);
		var c = k.tel.substring(0, filter.length);
		if (a == filter || b == filter) {
			elem('rediciteK').innerHTML += constructionTable(j, k);
		}
		elem('prebaruvajKorisnik').value = '';
	}
}

function searchMovie() {
	elem('rediciteF').innerHTML = '';
	var filter = val('prebaruvajFilm');
	for (var j = 0; j < model.movies.length; j++) {
		var f = model.movies[j];
		var a = f.ime.substring(0, filter.length);
		if (a == filter) {
			elem('rediciteF').innerHTML += constructionTable(j, f);
		}
		elem('prebaruvajFilm').value = '';
	}
}

function del(n) {
	var m = checkModel();
	m.splice(n, 1);
	submit();
	refresh(m);
}

hideStart();

$(function() {
	$('.click-nav > ul').toggleClass('no-js js');
	$('.click-nav .js ul').hide();
	$('.click-nav .js').click(function(e) {
		$('.click-nav .js ul').slideToggle(200);
		$('.clicker').toggleClass('active');
		e.stopPropagation();
	});
	$(document).click(function() {
		if ($('.click-nav .js ul').is(':visible')) {
			$('.click-nav .js ul', this).slideUp();
			$('.clicker').removeClass('active');
		}
	});
});
