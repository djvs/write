app.factory('poemFactory', ['$q', '$http', function($q, $http){
    return {
        poems: function(page){
            page = page || "1";
            return $http.get('/poems/'+page);
        },
        poem: function(id){
            return $http.get('/sub/' + id);  
        }
    };

}]);

