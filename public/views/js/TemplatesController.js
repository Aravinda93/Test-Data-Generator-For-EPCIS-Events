app.directive('fileUploader', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.fileUploader);
      element.on('change', onChangeHandler);
      element.on('$destroy', function() {
        element.off();
      });

    }
  };
});


app.controller('TemplatesController',function($scope,$http){
	
	/*$scope.UploadFIle	=	function(){		
		$http({
			url		: "/UploadFIle",
			method	: "get",
		}).success(function(response) {
			$scope.xmldata 	=	response[0].XML;
		});
	}*/
	
	$scope.FileName     =   "Choose a Excel File";
	

    
    //Import an Excel File from the Local System
    $scope.uploadFilePath = function(event){
        var files 		= event.target.files;
        $scope.FileName = files[0].name;
        console.log($scope.FileName)
        
		$http({
			method	: 'POST',
			url		: '/UploadFIle',
			headers	: {'Content-Type': 'multipart/form-data'},
			data	: {upload:  files[0].name},
		})
		.success(function (data) {
			console.log("RETURN DATA");
		})
		.error(function (data, status) {
			console.log("ERROR DATA");
		});

    };

});