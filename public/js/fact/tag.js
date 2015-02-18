app.factory('tagFactory', ['$q', '$http', '$modal', function($q, $http, $modal){
    return {
        editTags: function(item,type){
            var modalInst = $modal.open({
                templateUrl: '/template/tags/edit.html',
                controller: 'tagEditCtrl',
                windowClass: 'tagEditModal',
                resolve: {
                    mydata: function(){
                        return {
                            item: item,
                            itemtype: type
                        };
                    }
                }
            });
            modalInst.result.then(
                function(mydata){
                    log("1",mydata);
                    item.tags = mydata;
                }, function(mydata){
                }
            );
        }   
    };

}]);

