// views/ng-core.js
tikohud = angular.module('tikohud', ['ngRoute']); // ngroute is for dynamic content loading

var roles = [
		{name:'guest'},
		{name:'student'},
		{name:'teacher'},
		{name:'admin'},
	];

// Whitelisting
tikohud.config(function($sceDelegateProvider) {
     $sceDelegateProvider.resourceUrlWhitelist([
       // Allow same origin resource loads.
       'self',
       // Allow loading from our assets domain.  Notice the difference between * and **.
       'http://*.karelia.fi/**']);
 });

// ROUTING
tikohud.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'login.html',
		controller: 'loginController'
	})
	.when('/irc', {
		templateUrl: 'irc.html',
		controller: 'ircController'
	})
	.when('/users', {
		templateUrl: 'users.html',
		controller: 'usersController'
	})
	.when('/dashboard', {
		templateUrl: 'dashboard.html',
		controller: 'mainController'
	})
});

// Common data definitions
tikohud.controller('mainController', function($scope, $http) {
    $scope.master = {};
    $scope.irc = {log: [{}], command: ''};
	$scope.formData = {};
	$scope.userData = {};
	$scope.userData.username = "Kayttaja";

    $scope.pageClass = 'page-main';

});

tikohud.controller('usersController', function($scope, $http) {
	$scope.formData = {};

	$scope.roles = roles;
	$scope.defaultRole = roles[0]; // 'guest'

	// Get user data
	$http.get('/api/users')
		.success(function(data) {
			$scope.users = data;
			$scope.predicate = 'lastname';
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	$scope.createUser = function() {
		console.log("asdf", $scope.formData.role);
		$http.post('/api/users', 
				{ 
					firstname: $scope.formData.firstname, 
					lastname: $scope.formData.lastname, 
					email: $scope.formData.email, 
					password: $scope.formData.password,
					role: $scope.formData.role.name
				})
			.success(function(data) {
				$scope.formData = {}; // clear the form
				$scope.users = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	$scope.deleteUser = function(id) {
		$http.delete('/api/users/' + id)
			.success(function(data) {
				$scope.users = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
});

tikohud.controller('loginController', function ($scope, $http) {
	$scope.login = {};
    $scope.pageClass = 'page-login';

    console.log("loginController");

    $scope.login = function(user) {
		$scope.login = angular.copy(user);

		// See https://code.google.com/p/crypto-js/#SHA-3 for more info
		$scope.login.password = String(CryptoJS.SHA3($scope.login.password, { outputLength: 512 })); 

		$http.post('/login', 
				{ 
					email: $scope.login.email, 
					password: $scope.login.password
				})
			.success(function(data) {
				this.window.location.href = "#/dashboard";
				$scope.userData.username = data.username;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
});

tikohud.controller('ircController', function($scope, $http) {

    $scope.pageClass = 'page-irc';

    console.log("ircController");

	$http.get('/irc', 
			{ 
				username: 'jaakko'
			})
		.success(function(data) {
			console.log("success with data: ", data);
			$scope.irc.log.push({ number: $scope.irc.log.size, message: data });
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

    $scope.execute = function() {
    	console.log("ircController.command", $scope.irc.command);

    	window.socket.send($scope.irc.command);

		$scope.irc.command = ''; // clear the form

/*
		$http.post('/irc/api', 
				{ 
					command: $scope.irc.command
				})
			.success(function(data) {
				$scope.irc.command = ''; // clear the form
				$scope.irc.log.push({ number: $scope.irc.log.size, message: data });
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
*/
	};
});
