const app = angular.module("app", [])

.component('outerComp',{
	bindings	:	{
		username : `@`
	},
	controller	:	[function(){
		var $ctrl		=	this;
		$ctrl.$onInit	=	function()
		{
			$ctrl.username	=	$ctrl.username || "Aravinda Baliga";
		}
	}],
	template	:	`
						<h2> Hello from Outer Component.</h2>
						<p>Username is : {{ $ctrl.username }}</p>
						<inner-comp></inner-comp>
					`
})

.component('innerComp',{
	bindings	:	{
		addName	:	'&'
	},
	controller	:	[function(){
		var $ctrl		=	this;
		$ctrl.addAName	=	function(){
			$ctrl.newName	=	'';
		}	
		
	}],
	template	:	`
						<h3> Hello from Innter Component.</h3>
						<p> New name: <input ng-model="$ctrl.newName"/></p>
						<p><button ng-click="$ctrl.addAName()">Add name</button></p>					
					`
});
  
app.controller('AppController', function($scope){
	$scope.checkValues	=	function()
	{
		console.log($scope);
	}
});