function randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
    // ex: var rString = randomString(32);
}



app.directive('vresizable', function () {
  return {
    restrict: 'A',
    link: function(scope,elem,attr){
        log(elem.resizable({'handles': 'n,s'}),"resized");
    }
  };
});
app.directive('tags', function () {
  return {
    restrict: 'A',
    scope: { 'tags': '=tags' },
    transclude: true,
    templateUrl: "/template/tags/tags.html",
    controller: 'tagsCtrl',
    link: function(scope,elem,attr){
    }
  };
});

app.directive('sub', function () {
  return {
    restrict: 'A',
    scope: { 'sub': '=sub' },
    controller: 'subBoxCtrl',
    templateUrl: "/template/subs/box.html"
  };
});

app.directive('comments', function () {
  return {
    restrict: 'A',
    scope: { 'subject': '=', 'type': '=type' },
    controller: 'wrapCommentCtrl',
    templateUrl: "/template/comment/box.html"
  };
});

app.directive('commentform', function () {
  return {
    restrict: 'A',
    scope: { 'subject': '=', 'type': '=' },
    templateUrl: "/template/comment/form.html",
    controller: 'postCommentCtrl',
    link: function(scope,elem,attr){
        scope.$watch('subject', function(value){
            if(typeof value == 'object'){
                scope.randomstr = scope.type + randomString(20);
                if(scope.type == 'comment'){
                    scope.prettytype = 'comment';
                } else if (scope.type == 'user'){
                    scope.prettytype = 'comment';
                } else if (scope.type == 'sub'){
                    scope.prettytype = 'poem';
                }
            }
        });
    }
  };
});

app.directive('ckEditor', function($parse, $interval, $timeout) {
  return {
    require: '?ngModel',
    scope: {
        'ckval': '='
    },
    link: function(scope, elm, attr, ngModel) {
        var init = false;
        CKEDITOR.plugins.registered['save'] = {
             init : function( editor ){
                var command = editor.addCommand( 'save', {
                      modes : { wysiwyg:1, source:1 },
                      exec : function( editor ) {
                          scope.$apply(function() {
                              scope.ckval = editor.getData();
                          });
                      }
                   }
                );
             }
        }
        var ck = CKEDITOR.replace(elm[0]);

        scope.$watch('ckval', function(value) {
            if(typeof value == "string" && init == false){
                init = true;
                ck.setData(scope.ckval);


                $interval(function(){
                    if(scope.ckval != ck.getData()){
                      $timeout(function(){
                          scope.$apply(function() {
                              scope.ckval = ck.getData();
                          });
                      });
                    }
                },60);

                scope.$on('$destroy',function(){
                  log('destroy ck');
                  ck.destroy(true);
                });
            } else {
                if (value != ck.getData()){
                    ck.setData(value);
                }
            }
        });
    }
  };
});

app.directive('multicarousel', function () {
 
    var carouselInner, items, prev, next,
        direction, first, last,
        widthToMove, slider, clone,
        event;
 
    function carousel (scope, element) {
 
        carouselInner = element.find('.carousel-inner');
        items = carouselInner.find('.item');
        prev = element.find('.carousel-control.left');
        next = element.find('.carousel-control.right');
 
        assignControlClicks();
    }
 
    function assignControlClicks () {
 
        prev.on('click', function (e) {
            e.preventDefault();
            event = e;
            slide('right');
        });
        next.on('click', function (e) {
            e.preventDefault();
            event = e;
            slide('left');
        });
    }
 
    function slide (dir, event) {
 
        updateItems();
 
        direction = dir;
        first = $(items[0]);
        last = $(items[items.length - 1]);
 
        widthToMove = -first.width();
        clone = getClone();
 
        /*
         * If left, animate, remove first, append clone
         * If right, .before clone, animate, remove last
         */
        if (direction === 'left') {
            slideLeft();
        } else if (direction === 'right') {
            slideRight();
        }
    }
 
    function updateItems () {
 
        carouselInner = $(event.target).closest('.carousel').find('.carousel-inner');
 
        items = carouselInner.find('.item');
    }
 
    function getClone () {
 
        return (direction === 'left' ? first : last).closest('div.item').clone();
    }
 
    function slideLeft () {
        
        slider = first;
        animateSlide(widthToMove, finishLeftSlide);
    }
 
    function finishLeftSlide () {
 
        first.remove();
        carouselInner.append(clone);
    }
 
    function slideRight () {
        
        slider = clone;
        clone.css('margin-left', widthToMove + 'px');
        first.before(clone);
        animateSlide(0, finishRightSlide);
    }
 
    function finishRightSlide () {
        last.remove();
    }
 
    function animateSlide (slideTo, afterSlide) {
        slider.animate( { marginLeft: slideTo + 'px' }, 70, 'swing', afterSlide);
    }
 
    return {
        restrict: 'A',
        link: carousel
    };
 
});


app.directive('addMasonry', function ($interval) {
    return {
        restrict: "A",
        link: function (scope, elem, attrs) {  
            var myint = $interval(function(val){ 
                elem.imagesLoaded(function() {
                    elem.freetile();
                });
            },400);
            scope.$on('$destroy',function(){
                $interval.cancel(myint);
            });
        }
    };        
});


app.directive('isotope', function ($interval) {
    return {
        restrict: "A",
        link: function (scope, elem, attrs) {  
            isotopeconfig = {
                itemSelector: 'div.brick',
                layoutMode: 'fitRows',
                transformsEnabled: false,
                transitionDuration: 0
            };
            elem.isotope(isotopeconfig);
            var myint = $interval(function(val){ 
                    elem.isotope('reloadItems').isotope();
            },200);

            scope.$on('$destroy',function(){
                $interval.cancel(myint);
                elem.isotope('destroy');
                elem.remove();
            });
        }
    };        
});



