app.controller('poemCtrl',function($scope,$http,poemFactory){
    $scope.loading = true;
    $scope.showcomments = false;
    $scope.page = 1;
    $scope.poems = [];

    $scope.pagepoems = function(page){
        poemFactory.poems(page).success(function(data,status){
            $scope.loading = false;
            log('loading poems ',data);
            $scope.poems = _.union($scope.poems, data);
        }).error(function(data,status){
            $scope.loaderror = true;
        });
    };
    $scope.pagepoems($scope.page);

    $scope.newPage = function(){
        log("scroll?");
        $scope.page++;
        $scope.pagepoems($scope.page);
    };
});

app.controller('poemShowCtrl', function($scope,$http,poemFactory,$stateParams){
    $scope.loading = true;
    $scope.showcomments = true;
    log("loading poem...");

    poemFactory.poem($stateParams.id).success(function(data,status){
        $scope.loading = false;
        log("sub data",data);
        $scope.sub = data;
    }).error(function(data,status){
        $scope.loading = false;
        $scope.loaderror = true;
    });
});


app.controller('editPoemCtrl',function($scope,$http,$stateParams,$state,$timeout){
    $scope.showck = false;
    if($stateParams.hasOwnProperty("id")){
        $http.get("/sub/" + $stateParams.id)
            .success(function(data,status){
                log("got sub ",data);
                $scope.sub = data;
                $scope.formaction = "/poem/" + data.id + "/edit";
                $scope.showck = true;
            }).error(function(data,status){

            });
    } else {
        $scope.sub = {name: "", body: "", id: undefined}; 

    }
    $scope.upcallback = function(){


    };
    $scope.submitSub = function(){
        $http.post("/sub/edit", {id: $scope.sub.id, 'name': $scope.sub.name, 'body': $scope.sub.body, 'authenticity_token': $("input#authenticity_token").val()})
        .success(function(data,status){
            $scope.sub.id = data;
            $state.transitionTo('poem', {id: data});
            log("$scope.sub",$scope.sub);
            $scope.success = true;
            $timeout(function(){
                $scope.success = false
            }, 4000);
        }).error(function(data,status){

        });

    };

});







