app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
app.filter('escape', function(){
    return window.escape;
})
