var app = angular.module( 'pt', ['ui.router','ngUpload','ui.bootstrap', 'ngSanitize','ui.tinymce','infinite-scroll']);
app.run(function($rootScope,$http,$state,$location){
    log("pt app starting...");
    $rootScope.loggedin = false;
    $rootScope.user = null;
    $rootScope.userid = false;
    $rootScope.$state = $state;
    
    $http.get("/me",{}).success(
        function(data,status){
                if(data == false || data == "false"){
                    // $state.transitionTo("index");
                   // expel user to home page 
                } else {
                    log("logged in as ",data);
                    $rootScope.user = data;
                    $rootScope.userid = data.id;
                    $rootScope.loggedin = true;
                }
            }).error(function(data,status){
            });  

    $rootScope.stripfilename = function(string){
        if(typeof string == "undefined"){
            return "";
        } else if (string.indexOf("/") != -1 || string.indexOf('\\') != -1){
            return _.last(string.split(/[\/\\]/));
        } else {
            return string;
        }
     };

     $rootScope.tinymceOptions = {
        plugins: ["advlist autolink lists link image charmap print preview hr anchor pagebreak",
                  "searchreplace wordcount visualblocks visualchars code fullscreen",
                  "insertdatetime media nonbreaking save table contextmenu directionality",
                  "emoticons template paste textcolor"    
                ],
        toolbar1: "undo redo | styleselect | bolditalic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | preview forecolor backcolor emoticons ",
        image_advtab: true,
        width:"100%",
        height:"200px"

     };   



}).config(function($httpProvider, $sceProvider, $rootScopeProvider,$locationProvider) {
  $rootScopeProvider.digestTtl(30);
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  $sceProvider.enabled(false);
  $locationProvider.html5Mode(true);
});

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

if(typeof console == "undefined"){
    function log(args){
    };
} else {
    function log(){ console.log(arguments);}
}
axs = {};
