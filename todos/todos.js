items = [ 'a', 'bb' ];
changed = -1;

function add() {
	var v = $('#description').val();
	items.push(v);
	refresh();
}

function remove(n) {
	return function() {
		items.splice(n,1);
		refresh();
	}
}

function rename(n) {
	return function() {
		$( "#adding" ).hide();
		$( "#rename" ).show();
		$('#description').val(items[n]);
		changed = n;
	}
}

function refresh() {
	$( "#rename" ).hide();
	$( "#adding" ).show();
	$('#description').val('');
	var t = $('#todos');
	t.empty();
	for (var i = 0; i < items.length; i++) {
		var btnDone = '<button id="btnDone' + i
				+ '" class ="btn btn-danger">DONE</button>';

		var btnEdit = '<button id="btnEdit' + i + '" class="btn btn-success">EDIT</button>';

		t.append('<tr><td id="field' + i + '">' + items[i] + '</td><td>' + btnEdit + ' ' + btnDone + '</td></tr>');

		$('#btnDone' + i).click(remove(i));
		$('#btnEdit' + i).click(rename(i));
	}
}

$('#rename').click(function() {
	var v = $('#description').val();
	items[changed] = v;
	refresh();
});

refresh();
