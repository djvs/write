app.controller('tagsCtrl',function($scope){
    if(typeof $scope.tags == "object"){
        $scope.tags = 
              _.sortBy(
                  _.groupBy(
                    $scope.tags, 
                    function(n){ return n.tag; }
                  ),
                  function(k,v){ return v.count; }
              );
    }
});
app.controller('tagCtrl',function($scope,$http,$stateParams){
    $scope.tag = $stateParams.tag;
    log("hmm?");
    $scope.subs = [];
    $scope.users = [];
    $http.get("/tag/" + $stateParams.tag)
        .success(function(data,status){
            log("success",data);
            $scope.subs = data.subs;
            $scope.users = data.users;
        }).error(function(data,status){
            $scope.loaderror = true;
        });

});
app.controller('tagsIndexCtrl',function($scope,$http){
    log("hmmt?");
    $scope.cloud = [];
    $scope.users = [];
    $scope.Math = Math;
    $http.get("/tag/index")
        .success(function(data,status){
            log("success",data);
            $scope.cloud = data;
        }).error(function(data,status){
            $scope.loaderror = true;
        });

});


