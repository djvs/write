
app.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/");
    $stateProvider
      .state('/',{
            url: '/',
            controller: 'poemCtrl',
            templateUrl: '/template/index.html'

        }).state('profile', {
            url: '/me',
            templateUrl: '/partial/profile'
        
        }).state('poem', {
            url: '/p/{id}',
            controller: 'poemShowCtrl',
            templateUrl: '/template/subs/show.html'
        
        }).state('newpoem', {
            url: '/p/new',
            controller: 'editPoemCtrl',
            templateUrl: '/template/subs/form.html',

        }).state('editpoem', {
            url: '/p/{id}/edit',
            controller: 'editPoemCtrl',
            templateUrl: '/partial/poemform',

        }).state('users',{
            url: '/us',
            controller: 'usersCtrl',
            templateUrl: '/template/user/index.html'

        }).state('user',{
            url: '/u/{userId}',
            controller: 'userCtrl',
            templateUrl: '/template/user/show.html'

        }).state('signup',{
            url: '/signup',
            controller: 'signupCtrl',
            templateUrl: '/template/signup.html'

        }).state('lostpw',{
            url: '/lostpw',
            controller: 'lostpwCtrl',
            templateUrl: '/template/lostpw.html'

        }).state('usersubs',{
            url: '/u/{userId}/subs',
            controller: 'userSubsCtrl',
            templateUrl: '/template/user/subs.html'

        }).state('tags',{
            url: '/ts',
            templateUrl: '/template/tags/index.html',
            controller: 'tagsIndexCtrl'

        }).state('tag',{
            url: '/t/{tag}',
            templateUrl: '/template/tags/show.html',
            controller: 'tagCtrl'

        }).state('chat',{
            url: '/chat',
            templateUrl: '/template/chat/index.html'

        }).state('chat.room',{
            url: '/{room}'

        }).state('about',{
            url: '/about',
            templateUrl: '/template/about.html'

        }).state('tv',{
            url: '/tv',
            controller: 'tvCtrl',
            templateUrl: '/template/tv.html'

        }).state('links',{
            url: '/l',
            templateUrl: '/template/links.html'

        }).state('toc',{
            url: '/terms',
            templateUrl: '/template/toc.html'
        });
});

