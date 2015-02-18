app.controller('tvCtrl',function($scope, $timeout, $http){
    $scope.vid = {};
    $scope.vidurl = "";
    $scope.submittingtv = false;
    $scope.submittingtv_success = false;
    $scope.submittingtv_error = false;
    $http.get("/tv")
        .success(function(data,status){
            $scope.videos = _.shuffle(data);
        }).error(function(data,status){

        });
    $scope.newtv = function(){
        $scope.submittingtv_error = false;
        $scope.submittingtv = true;
        $http.post("/tv/new", { video: $scope.vid.url,
				authenticity_token: $("#authenticity_token").val()
	 })
            .success(function(data,status){
                $scope.submittingtv = false;
		$scope.videos = [];
		$scope.videos = _.shuffle(data);
                $timeout(function(){ 
                    $scope.submittingtv_success = false;
                }, 2000);
            }).error(function(data,status){
                $scope.submittingtv_error = true;
            });

    };
    $scope.changeVid = function(vid){
        $scope.vidurl = vid.site_id;
    };

});
