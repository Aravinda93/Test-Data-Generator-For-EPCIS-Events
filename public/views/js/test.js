var app	 	= 	angular.module('myApp', ['ngRoute'], function() {});

app.controller('AppController', [ '$scope', '$http', function($scope, $http) {

	$scope.companies	=	[];
	
	//Get the data from the Database on click of the button
	$scope.getData	=	function()
	{		
		$scope.companies	=	[];
	}
	
	//On load of the page call the get function to obtain the data
	$scope.init		=	function(){
		console.log("Program Started");
		$scope.getData();
	}
	
	//Display Modal for adding the new Data
	$scope.AddNew		=	function(){
		console.log("INSIDE")
		angular.element('#AddExtensionModal').modal('show');
	}
}]);