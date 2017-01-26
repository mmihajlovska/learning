var app = angular.module('myApp', [ "ngRoute" ]);

app.controller('MainCtrl', function($scope) {

	$scope.tasks = [];

});

app.controller('TasksCtrl', function($scope, $routeParams) {
	$scope.tasksId = $routeParams.ID;

	$scope.add = function() {
		$scope.tasks.push({
			title : $scope.task,
			completed : false,
			dueDate : null,
			comments : [],
			priority : "Medium",
			createdOn: new Date().toLocaleDateString() + '(' + new Date().toLocaleTimeString() + ')'
		});
		$scope.task = '';
	}

	$scope.remainingTasks = function() {
		var remaining = 0;

		for (var i = 0; i < $scope.tasks.length; i++) {
			if (!$scope.tasks[i].completed) {
				remaining++;
			}
		}

		return remaining;
	}

	$scope.remove = function(index) {
		$scope.tasks.splice(index, 1);
	}

});

app.config(function($routeProvider) {
	$routeProvider.when("/", {
		templateUrl : "tasks.html",
		controller : "TasksCtrl"
	}).when("/edit/:ID", {
		templateUrl : "edit.html",
		controller : "EditCtrl"
	}).when("/info", {
		templateUrl : "info.html",
		controller : "TasksCtrl"
	}).when("/:ID", {
		templateUrl : "tasks.html",
		controller : "TasksCtrl"
	});
});

app.controller("EditCtrl", function($scope, $routeParams) {
	$scope.index = $routeParams.ID;
	$scope.title = $scope.tasks[$scope.index].title;
	$scope.dueDate = $scope.tasks[$scope.index].dueDate;

	$scope.update = function() {
		$scope.tasks[$scope.index].title = $scope.title;

		$scope.tasks[$scope.index].dueDate = $scope.dueDate;
		
		if ($scope.comment != undefined && $scope.comment != '') {
			$scope.tasks[$scope.index].comments.push({comment:$scope.comment, date:new Date().toLocaleTimeString() + ', ' +
new Date().toLocaleDateString()});
		}
		$scope.comment = '';
		
		$scope.tasks[$scope.index].lastChangedOn = new Date().toLocaleDateString() + '(' + new Date().toLocaleTimeString() + ')'; 
	}
});
