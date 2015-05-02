var lSub = localStorage.lastSubmit;
model = lSub ? JSON.parse(lSub) : {
	users : [ {
		firstName : 'Marina',
		lastName : 'Mihajlovska',
		date : '15.07.86',
		tel : '908',
		rentedMovies : []
	} ],
	movies : [ {
		title : 'Rambo',
		year : '1900',
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
	$("#heading").slideDown('slow');
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
	var k = $('#movieRows');
	k.empty();
	var f = $('#userRows');
	f.empty();
}

function refresh(m) {
	emptyTable();
	var html = '';
	for (var i = 0; i < m.length; i++) {
		var k = m[i];
		html += constructionTable(i, k);
		if (activeUsers) {
			elem('userRows').innerHTML = html;
			hide("#formUser", "#movie", "#user");
		} else {
			elem('movieRows').innerHTML = html;
			hide("#formMovie", "#user", "#movie");
		}
	}
}

function td(s) {
	return '<td>' + s + '</td>';
}

function inputVal(firstName, lastName, date, tel, year) {
	if (activeUsers) {
		$('#firstName').val(firstName);
		$('#lastName').val(lastName);
		$('#dateOfBirth').val(date);
		$('#tel').val(tel);
	} else {
		$('#title').val(firstName);
		$('#year').val(year);
	}
}

function renameUser(i) {
	var m = model.users;
	hide('#user', '#submitUser', '#formUser');
	$('#renameUser').show();
	inputVal(m[i].firstName, m[i].lastName, m[i].date, m[i].tel, '');
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
	inputVal(m[i].title, '', '', '', m[i].year);
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
		model.movies[i].user = model.users[u].firstName;
		model.users[u].rentedMovies.push({
			name : model.movies[i].title,
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
			if (model.users[j].rentedMovies[k].name == model.movies[i].title) {
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
		return '<tr>' + td(pr.firstName) + td(pr.lastName) + td(pr.date)
				+ td(pr.tel)
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
		return '<tr>' + td(pr.title) + td(pr.year) + td(pr.user)
				+ td(rentMovie + ' ' + returnM + ' ' + edit + ' ' + d)
				+ '</tr>';
	}
}

function dataUser() {
	var firstName = document.getElementById('firstName').value;
	var lastName = document.getElementById('lastName').value;
	var dateOfBirth = document.getElementById('dateOfBirth').value;
	var tel = document.getElementById('tel').value;
	var user = {
		firstName : firstName || '',
		lastName : lastName || '',
		date : dateOfBirth || '',
		tel : tel || '',
		rentedMovies : []
	};
	return user;
}

function dataMovie() {
	var title = document.getElementById('title').value;
	var year = document.getElementById('year').value;
	var movie = {
		title : title || '',
		year : year || '',
		user : ''
	};
	return movie;
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
	$("#heading").slideUp('slow');
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
	$("#heading").slideUp('slow');
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
	elem('userRows').innerHTML = '';
	var filter = val('searchU');
	for (var j = 0; j < model.users.length; j++) {
		var k = model.users[j];
		var a = k.firstName.substring(0, filter.length);
		var b = k.lastName.substring(0, filter.length);
		var c = k.tel.substring(0, filter.length);
		if (a == filter || b == filter) {
			elem('userRows').innerHTML += constructionTable(j, k);
		}
		elem('searchU').value = '';
	}
}

function searchMovie() {
	elem('movieRows').innerHTML = '';
	var filter = val('searchM');
	for (var j = 0; j < model.movies.length; j++) {
		var f = model.movies[j];
		var a = f.title.substring(0, filter.length);
		if (a == filter) {
			elem('movieRows').innerHTML += constructionTable(j, f);
		}
		elem('searchM').value = '';
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
