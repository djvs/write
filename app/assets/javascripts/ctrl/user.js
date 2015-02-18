app.controller('usersCtrl',function($scope,$http){
    $scope.users = [];
    $scope.loadingerror = false;
    $http.get("/user/all")
        .success(function(data,status){
            $scope.users = data;
        }).error(function(data,status){
            $scope.loadingerror = true;
        });
});

app.controller('userCtrl',function($scope,$http,$stateParams,tagFactory){
    $scope.user = false;
    $scope.loaded = false;
    $scope.loadingerror = false;
    $scope.editTags = tagFactory.editTags;

    $http.get("/user/id/" + $stateParams.userId )
        .success(function(data,status){
            $scope.user = data.user;
            $scope.user.loaded = true;
            $scope.subs = data.subs;
            _.each($scope.subs, function(s){
                s.user = $scope.user;
            });
        }).error(function(data,status){
            $scope.loadingerror = true;
        });
});

app.controller('profileCtrl',function($scope,$rootScope,$http){
    log("profilectrl");
    $http.get("/me")
        .success(function(data,status){
            $scope.user = data;
        }).error(function(data,status){

        });

    $scope.upcallback = function(content){
        log("???");
        log("upload completed",content);
        $rootScope.user = content;
        $scope.user = content;
    };
    log("??",$scope.upcallback);

});
