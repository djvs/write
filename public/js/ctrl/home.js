app.controller('homeCtrl',function($scope,$http,$rootScope,$state){
    $scope.login = {"email": "", "password":""};
    $scope.loginuser = function(){
        $scope.wrongpassword = false;
        $http.post("/login", { email: $scope.login.email,
                               password: $scope.login.password,
                               authenticity_token: $("input#authenticity_token").val() })
            .success(function(data,status){
                $rootScope.user = data;
                $rootScope.userid = data.id;
                log("user",$rootScope.user);
            }).error(function(data,status){
                $scope.wrongpassword = true;
            });
    };
    $scope.logoutuser = function(){
        $http.get("/logout")
            .success(function(data,status){
                $rootScope.user = null;
                $rootScope.userid = false;
                $state.transitionTo("/");
            }).error(function(data,status){

            });

    };
});
