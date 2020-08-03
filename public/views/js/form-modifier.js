app.controller('AppController2', function($scope,$http,$location,$anchorScroll,$copyToClipboard,$window){
	
	//On enter of the Qunatity UOM show the suggestions
	/*$scope.QuantityUOMAutoComplete	=	function(enteredData){
		$scope.hidethis = false;  
		var OutPut 	=	[];
		angular.forEach($scope.UOMs, function(uom){
			if(uom.text.toLowerCase().indexOf(enteredData.toLowerCase()) >= 0)
			{
				OutPut.push(uom);
			}
		});
		
		$scope.QuantityUOMsList = OutPut;  
	}
	
	$scope.fillQUantityUOMTextbox = function(UOMText){  
           $scope.CommonFormQuantity.ObjectEventQuantityQuantityUOM = UOMText;  
           $scope.hidethis = true;  
      } */
	  
	//Reset all the fields onclick of Reset Button
	$scope.ReloadTable	=	function(){
		//console.log("JRJRJ");
		$window.location.reload();
		//$route.reload();
	}	
	 
	
	//Copy to Clipboard the XML and JSON data
	$scope.copytoclipboard = function(toCopy){
		if(toCopy == 'XML')
		{
			$copyToClipboard.copy($scope.xmldata).then(function(){
				alertify.alert(" Test Data Generator ",toCopy + ' content copied to clipboard');
			});
		}
		else if(toCopy == 'JSON')
		{
			$copyToClipboard.copy($scope.jsondata).then(function(){
				alertify.alert(" Test Data Generator ",toCopy + ' content copied to clipboard');
			});
		}
	}
	
});
