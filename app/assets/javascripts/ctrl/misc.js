app.controller("linksCtrl",function($scope,$http){
    $http.get("/links").success(function(data,status){
        $scope.links = data;
    }).error(function(data,status){
        $scope.links_error = true;
    });
});

app.controller("chatCtrl",function($scope,$http,$state,$stateParams,$interval,$timeout){
    $scope.showpostbox = true;
    $scope.showchat = false;
    $scope.chatroom = {};
    $scope.chat = {'message': ' '};
    $scope.init = false;

    $scope.getChatrooms = function(){
        return $http.get("/chat");
    }
    $scope.setRefreshInterval = function(){
        $interval(function(){
            if(typeof $scope.chatrooms != "undefined" && typeof $scope.chatroom != 'undefined' && $stateParams.room != $scope.chatroom.name){
                log("cc",$stateParams.room);
                $scope.changeChat($stateParams.room);
            } 
            if(!$scope.init){
                $timeout(function(){
                    $scope.init = true;
                    log('now scroll');
                    $(".chat_allmessages").scrollTop(235252);
                },0);
            }
        },50);
    };

    $scope.initChat = function(){
        $scope.getChatrooms().success(function(data,status){
            $scope.chatrooms = data;
            $state.transitionTo('chat.room',{room: data[0].name});
            log("initting with ",$scope.chatroom,$scope.chatrooms);
            $scope.setRefreshInterval();
        }).error(function(data,status){
        });
    };

    $scope.refreshChats = function(samplearg){
        $scope.getChatrooms().success(function(data,status){
            $scope.chatrooms = data;
            $scope.chatroom = _.filter($scope.chatrooms,function(cr){
                return cr.name == $stateParams.room;
            })[0];
            $scope.scrollIfStickied();
            if(samplearg == "jam"){
                $timeout(function(){
                    $(".chat_allmessages").scrollTop(999999);
                },100);
            }
        }).error(function(data,status){
        });
    };

    $interval(function(){
        $scope.refreshChats();
        log("$scope.chatroom",$scope.chatroom);
    },8000);

    if(typeof $stateParams.room == 'undefined'){
        $scope.initChat();
    } else {
        $scope.getChatrooms().success(function(data,status){
            $scope.chatrooms = data;
            $scope.chatroom = _.filter($scope.chatrooms,function(c){
                return c.name == $stateParams.room;
            })[0]; 
            $scope.setRefreshInterval();
        }).error(function(data,status){
        });
    }

    $scope.changeChat = function(name){
        $scope.chatroom = _.filter($scope.chatrooms, function(cr){
            return cr.name == name;
        })[0];
    }; 

    $scope.getChatsForRoom = function(name){
        $scope.showchat = true;
        $http.get("/chatr/" + name).success(function(data,status){
            $scope.currentchats = data;
            
        }).error(function(data,status){
        });
    };

    $scope.scrollIfStickied = function(){
            // cause a bottom stick - oh no, jquery has to be used
            var chatmsgelem = $(".chat_allmessages");
            var chatmsgheightdiff = chatmsgelem[0].scrollHeight - (chatmsgelem.scrollTop() + chatmsgelem.height());
            if(chatmsgheightdiff < 40 && chatmsgheightdiff > -40){
                chatmsgelem.scrollTop(999999);
            }            
    }

    $scope.postToChat = function(){
        $http.post("/chatr/" + $scope.chatroom.name + "/post",
            { 'body': $scope.chat.message,
              'authenticity_token': $("#authenticity_token").val()
            }
        ).success(function(data,status){
            $scope.refreshChats("jam");
            log("refreshing data as ",data);
            $scope.chat.message = " ";
        }).error(function(data,status){
        });
    };

    $scope.createNewRoom = function(){
        $http.post("/chatr/newroom/",
            { 'name': $scope.roomname,
              'authenticity_token' : $("#authenticity_token").val() }
        ).success(function(data,status){
            $scope.roomname = "";
            $scope.chatrooms.push(data);
            $scope.chatroom = _.last($scope.chatrooms);
        }).error(function(data,status){
        });
    };
});



app.controller('postCommentCtrl', function($scope, $rootScope, $http, $state){
    $scope.comment = {body: ""};
    $scope.user = $rootScope.user;
    log("pcc scope",$scope.type, $scope.subject, $scope.user);
    if($scope.type == "comment"){
        $scope.subject.name = $scope.subject.postername;
        log("???",$scope.subject.name);
    } else {
        log("type",$scope.type);
    }
    $scope.postComment = function(){
        log($scope.subject, $scope.comment.body,$scope.type);

        $http.post("/comment", 
            {
                pclass: $scope.type.capitalize(),
                pid: $scope.subject.id,
                comment: $scope.comment.body,
                authenticity_token: $("input#authenticity_token").val()

            })
            .success(function(data,status){
                if($scope.type == "comment"){
                    $scope.subject.children.push(data);
                } else {
                    $scope.subject.comments.push(data);
                }
                $scope.subject.commentcount += 1;
                $scope.comment = "";
                $scope.subject.doreply = false;
                log("???",$scope.subject);
                $scope.subject.name = "foshosdhfosidhg sdfg dfg sdfg dg ";
                $scope.subject.safename = "foshosdhfosidhg sdfg dfg sdfg dg ";
            }).error(function(data,status){

            });
    };
});
app.controller('wrapCommentCtrl', function($scope,$rootScope,$modal){
    log("wcc scope",$scope.type, $scope.subject, $scope.user);
    $scope.user = $rootScope.user;
    $scope.toggleReply = function(item){
        if(item.doreply == true){
            item.doreply = false;
        } else {
            item.doreply = true;
        }
    };
    $scope.delcomment = function(item){
        var modalInst = $modal.open({
            templateUrl: '/template/comment/delete.html',
            controller: 'commentDelCtrl',
            windowClass: 'commentDelModal',
            resolve: {
                mydata: function(){
                    return {
                        item: item
                    };
                }
            }
        });
        modalInst.result.then(
            function(mydata){
                item.dohide = true;
                $scope.subject.commentcount -= 1;
            }, function(mydata){
            }
        );
    };
    
});

app.controller('subBoxCtrl', function($scope,$rootScope,$http,$modal,tagFactory){
    $scope.doshow = true;
    $scope.user = $rootScope.user;
    $scope.editTags = tagFactory.editTags;

    $scope.deleteSub = function(item){
        var modalInst = $modal.open({
            templateUrl: '/template/subs/delete.html',
            controller: 'subDelCtrl',
            resolve: {
                mydata: function(){
                    return {
                        item: item
                    };
                }
            }
        });
        modalInst.result.then(
            function(mydata){
                log("hmm?");
                item.dohide = true;
            }, function(mydata){
            }
        );
    };   
});


app.controller('tagEditCtrl', function($scope,$http,$modalInstance,mydata){
    $scope.loading = true;
    $scope.submitting = false;
    $scope.itemtype = mydata.itemtype;
    $scope.item = mydata.item;
    $scope.tags = {text: ""};
    log($scope.item,"IDSNGOSIDGDSG");
    if($scope.itemtype == 'user'){
        $scope.item.name = $scope.item.safename;
    }

    $http.get("/tags/" + $scope.itemtype.capitalize() + "/" + $scope.item.id)
        .success(function(data,status){
            $scope.tags.text = data;
            $scope.loading = false;
        }).error(function(data,status){
            $modalInstance.dismiss(false);
        });

    $scope.cancel = function(){
        $modalInstance.dismiss(false);
    };
    $scope.finish = function(){
        $scope.submitting = true;
        $http.post("/tag/save", 
            {
                type: $scope.itemtype.capitalize(),
                id: $scope.item.id,
                tags: $scope.tags.text,
                authenticity_token: $("#authenticity_token").val()
            }).success(function(data,status){
                $modalInstance.close(data);
            }).error(function(data,status){
            });
    };
});
app.controller('subDelCtrl', function($scope,$http,$modalInstance,mydata){
    $scope.item = mydata.item;
    $scope.confirmd = function(){
        $http.post("/sub/" + $scope.item.id + "/delete",
            {authenticity_token: $("#authenticity_token").val()})
        .success(function(data,status){
            $modalInstance.close(true);
        }).error(function(data,status){

        });
    };
    $scope.cancel = function(){
        $modalInstance.dismiss(false);
    };
});

app.controller('commentDelCtrl', function($scope,$http,$modalInstance,mydata){
    $scope.item = mydata.item;
    $scope.confirmd = function(){
        $http.post("/comment/delete",
            {authenticity_token: $("#authenticity_token").val(),
             id: $scope.item.id
        }).success(function(data,status){
            $modalInstance.close(true);
        }).error(function(data,status){

        });
    };
    $scope.cancel = function(){
        $modalInstance.dismiss(false);
    };
});

app.controller('signupCtrl', function($scope,$http,$rootScope,$state){
    $scope.user = {email: "", password: "", password_confirmation: "", username: ""};
    $scope.signup = function(){
        $http.post("/register",
            { email: $scope.user.email,
              username: $scope.user.username,
              password: $scope.user.password,
              password_confirmation: $scope.user.password_confirmation,
              authenticity_token: $("#authenticity_token").val()
            }).success(function(data,status){
                $rootScope.user = data;
                $rootScope.userid = data.id;
                $state.transitionTo("/");
            }).error(function(data,status){
            });


    };
});

app.controller('lostpwCtrl', function($scope,$http,$timeout){
    $scope.accepted = false;
    $scope.rejected = false;
    $scope.user = {email: ""};
    $scope.submit = function(){
        $scope.accepted = false;
        $scope.rejected = false;
        $http.post("/forgotpw",
            { email: $scope.user.email,
              authenticity_token: $("#authenticity_token").val()
            }).success(function(data,status){
                $scope.accepted = true;
            }).error(function(data,status){
                $scope.rejected = true;
            });
    };
});
