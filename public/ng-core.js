// views/ng-core.js
var tikohud = angular.module('tikohud', []);

function mainController($scope, $http) {
	$scope.formData = {};

	// Define user roles
	$scope.roles = [
		{name:'guest'},
		{name:'student'},
		{name:'teacher'},
		{name:'admin'},
	];
	$scope.defaultRole = $scope.roles[0]; // 'guest'

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
}

function loginController ($scope, $http) {
    $scope.master = {};

    $scope.login = function(user) {
		$scope.master = angular.copy(user);

		// See https://code.google.com/p/crypto-js/#SHA-3 for more info
		$scope.master.password = String(CryptoJS.SHA3($scope.master.password, { outputLength: 512 })); 

		$http.post('/api/login', 
				{ 
					email: $scope.master.email, 
					password: $scope.master.password
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
}