(function () {


    var app = angular.module('myApp', ['ngRoute']);




    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login.html',
            controller: "loginCtrl"
        }).when('/register', {
            templateUrl: 'register.html',
            controller: "registerCtrl"
        }).otherwise({
            redirectTo: 'login'
        });


    }]);

    window.fbAsyncInit = function() {
        FB.init({
            appId      : '#######git ',
            xfbml      : true,
            version    : 'v2.8',
            status:true
        });

        FB.getLoginStatus(function (response) {
            if(response.status==='connected'){
                //bağlandık
            }else if(response.status==='not_authorized'){
                //yetki yok
            }else{
                //facebooka giremedik
            }
        });

    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));









    var url = 'http://localhost:8080/user';
    var urlPublicListings = 'http://localhost:8080/publiclistings';
    var urlAddListing = 'http://localhost:8080/listing';
    var urlAddTodo = 'http://localhost:8080/todo';
    var urlGetTodos = 'http://localhost:8080/todos3/';
    var urlDeleteListing = 'http://localhost:8080/listing/';
    var urlDeleteTodo = 'http://localhost:8080/deleteTodo/';
    var urlAddComment = 'http://localhost:8080/comment';
    var urlGetComments = 'http://localhost:8080/comments2/';
    var urlDeleteComment = 'http://localhost:8080/deleteComment/';
    var urlRateTodo = 'http://localhost:8080/rate/';
    var urlGetUserListings='http://localhost:8080/userlistings/';
    var urlGetUserPrivateListings='http://localhost:8080/userprivatelistings/';
    var urlGetUserPublicListings='http://localhost:8080/userpubliclistings/';
    var urlGetUserTodos='http://localhost:8080/todos2/';
    var urlGetUserCommnets='http://localhost:8080/comments1/';


    app.controller('homeCtrl', function ($scope, $http) {
        if (sessionStorage.getItem("currentUserName") != null) {

            $scope.currentUserName = sessionStorage.getItem("currentUserName");

            $scope.logout = function () {
                console.log("log out metoduna girdi.");
                sessionStorage.removeItem("currentUserName");
                window.location.href = "./login.html";
            }

        } else {
            window.location.href = "./login.html";
        }
    });


    app.controller('loginCtrl', function ($scope, $http,$location) {
        $scope.login = function (user) {

            //alert("giriş yapılıyor "+user.userName+" "+user.password+ "");


            $http.post(url, user)
                .then(
                    function (response) {
                        //errorCode a göre if else yap..
                        console.log("bağlantı yapıldı" + response.data.errorCode + " , " + response.data.errorMessage);

                        if (response.data.errorCode == 0) {
                            console.log(response.data.errorMessage);
                            sessionStorage.setItem("currentUserName", user.userName);
                            //$scope.msg = response.data.errorMessage;
                            window.location.href = "./listings.html";
                            //$location.path('/listings');


                        } else {
                            // alert(response.data.errorMessage);
                            $scope.msg2 = response.data.errorMessage + " lütfen tekrar dene!";

                        }

                    },

                    function (response) {
                        console.log("bağlantı yapılamadı");
                    }
                )


        }
    });

    app.controller('registerCtrl', function ($scope, $http) {


        $scope.register = function (user) {

            if (user.password == user.password2){

                console.log("kayıt ediyor " + user.userName + " " + user.password + " " + user.email + "");


                $http.put(url, user)
                    .then(
                        function (response) {
                            //errorCode a göre if else yap..
                           // alert("bağlantı yapıldı " + response.data.errorMessage);
                            if (response.data.errorCode == 0) {
                                /*alert(response.data.errorMessage + "Login sayfasına yönlendiriliyorsun.");
                                 window.location.href = "./login.html";*/
                                $scope.msg1 = response.data.errorMessage + "Lütfen Giriş Yap";
                            } else {
                                $scope.msg2 = response.data.errorMessage;
                                console.log(response.data.errorMessage + "Tekrar Dene.");
                            }


                        },

                        function (response) {
                            console.log("kayıt hatası");
                        }
                    )


            } else {

                alertify.alert("girilen parolalar uyuşmuyor.");

            }
        }

        $scope.facebook={
            userName:"",
            password:"",
            email:""
        };

        $scope.onFBLogin =function () {
            FB.login(function (response) {
                if(response.authResponse){
                    FB.api('/me' , 'GET' , {fields:'email , first_name , name , id , picture'} ,function (response) {
                        $scope.$apply(function () {
                            $scope.facebook.userName=response.name;
                            $scope.facebook.email=response.email;
                            $scope.fb_image=response.picture.data.url;
                            $scope.facebook.password=response.email;

                        });



                        $http.put(url, $scope.facebook)
                            .then(
                                function (response) {
                                    //errorCode a göre if else yap..
                                    // alert("bağlantı yapıldı " + response.data.errorMessage);
                                    if (response.data.errorCode == 0) {
                                        /*alert(response.data.errorMessage + "Login sayfasına yönlendiriliyorsun.");
                                         window.location.href = "./login.html";*/
                                        $scope.msg1 = response.data.errorMessage + "Lütfen Giriş Yap";
                                    } else {
                                        $scope.msg2 = response.data.errorMessage;
                                        console.log(response.data.errorMessage + "Tekrar Dene.");
                                    }


                                },

                                function (response) {
                                    console.log("kayıt hatası");
                                }
                            )

                        sessionStorage.setItem("currentUserName", $scope.facebook.userName);
                        sessionStorage.setItem("pictureUrl",  $scope.fb_image);
                        window.location.href = "./listings.html";
                    });
                }else{
                    //error
                }
            } , {

                scope:'email,user_likes',
                return_scopes:true


            });


        };




    });


    app.controller('listingCtrl', function ($scope, $http, $location) {


        $scope.userName = sessionStorage.getItem("currentUserName");
        $scope.listingId = null;
        $scope.showComm = false;
        $scope.todoId = null;
        $scope.todoContent = null;
        $scope.rateAverage = null;
        $scope.custom1=true;
        $scope.custom2=false;
        $scope.custom3=true;
        $scope.custom4=true;

        $scope.picture=sessionStorage.getItem("pictureUrl");



        $scope.toggle = function (todoId, todoContent, rateAverage) {
            $scope.showComm = !$scope.showComm;
            $scope.todoId = todoId;
            $scope.todoContent = todoContent;
            $scope.getComments();

            $scope.rateAverage = rateAverage;
        };
        $scope.toggle2 = function () {
            $scope.showComm = !$scope.showComm;
            $scope.todoId = null;
            $scope.todoContent = null;
            $scope.getTodos();
        };
        
        $scope.toggleCustom1=function () {
            $scope.custom1 = $scope.custom1 === false ? true: false;
            $scope.custom2=true;
            $scope.custom3=true;
            $scope.custom4=true;

        }
        $scope.toggleCustom2=function () {
            $scope.custom2 = $scope.custom2 === false ? true: false;
            $scope.custom1=true;
            $scope.custom3=true;
            $scope.custom4=true;
        }

        $scope.toggleCustom3=function () {
            $scope.custom3 = $scope.custom3 === false ? true: false;
            $scope.custom1=true;
            $scope.custom2=true;
            $scope.custom4=true;
        }

        $scope.toggleCustom4=function () {
            $scope.custom4 = $scope.custom4 === false ? true: false;
            $scope.custom3=true;
            $scope.custom1=true;
            $scope.custom2=true;
        }
        
        

        $scope.logout = function () {

           alertify.confirm("Çıkış yapmak istediğinden emin misin?" , function (e) {
               if(e){

                   FB.logout(function () {

                   });

                   sessionStorage.removeItem("currentUserName");
                   sessionStorage.removeItem("pictureUrl");

                   window.location.href = "./index.html";
               }else{

               }
           });

        }


        $scope.addListing = function (liste) {

            console.log("ekleme metoduna girdi userName : " + $scope.userName);


            liste.userName = $scope.userName;


            console.log("liste ekleniyor");

            $http.put(urlAddListing, liste)
                .then(
                    function (response) {
                        //errorCode a göre if else yap..
                        console.log("bağlantı yapıldı" + response.data.errorCode + " , " + response.data.errorMessage);
                        if (response.data.errorCode == 0) {
                            /*alert(response.data.errorMessage + "Login sayfasına yönlendiriliyorsun.");
                             window.location.href = "./login.html";*/
                            $scope.msg1 = response.data.errorMessage;
                            $scope.msg2=null;

                            $scope.getListings();


                        } else {
                            $scope.msg2 = response.data.errorMessage;
                            $scope.msg1=null;
                            //alert(response.data.errorMessage + "Tekrar Dene.");
                        }

                    },


                    function (response) {
                        console.log("bağlantı hatası");
                    }
                );


        }

        $scope.getListings = function () {

            console.log("getListing");

            $http.get(urlPublicListings)
                .then(
                    function (response) {
                        //errorCode a göre if else yap..
                        console.log("veri alındı " + response.data.errorCode + " , " + response.data.errorMessage);

                        $scope.listings = response.data.listingDetailList;

                        //$scope.listingId = $scope.listings.listingId;
                        //$scope.userNameGelen=$scope.listings.userName;


                    },

                    function (response) {
                        console.log("bağlantı hatası");
                    }
                );


        }

        $scope.deleteListings = function (listingId, userName) {

            console.log("deleteListing çalıştı");


            console.log("url değişti");


            //var listingId = $location.search().listingId;
            //var userName1=$location.search().userName;

            console.log(listingId);
            console.log($scope.userName);
            console.log(userName);

            alertify.confirm("Listeyi silmek istediğinden emin misin?", function (e) {
                if (e) {
                    if (userName == $scope.userName) {

                        $http.delete(urlDeleteListing + listingId)
                            .then(
                                function (response) {
                                    //errorCode a göre if else yap..
                                    console.log("Bağlantı yapıldı" + response.data.errorCode + " , " + response.data.errorMessage);
                                    //window.location.href = "./listings.html";
                                    alertify.alert("Liste başarı ile silindi");
                                    $scope.getListings();
                                    $scope.getUserPublicListings();
                                    $scope.getUserTodos();
                                    $scope.getUserCommnets();

                                },

                                function (response) {
                                    console.log("bağlantı hatası");
                                }
                            )


                    } else {

                        alertify.alert("sadece kendi oluşturduğun listelri silebilirsin.");


                    }
                } else {

                }
            });




        }


        $scope.listingName = $location.search()['listingName'];

        $scope.addTodo = function (todo) {

            todo.userName = $scope.userName;
            todo.listingId = $location.search()['listingId'];
            todo.listingName = $location.search()['listingName'];
            $scope.listingName = todo.listingName;

            console.log(todo.listingId + " , " + todo.listingName);

            console.log("todo ekleniyor");

            $http.put(urlAddTodo, todo)
                .then(
                    function (response) {
                        //errorCode a göre if else yap..
                        console.log("bağlantı yapıldı" + response.data.errorCode + " , " + response.data.errorMessage);

                        $scope.getTodos();
                    },


                    function (response) {
                        console.log("bağlantı hatası");
                    }
                );


        }

        $scope.getTodos = function () {

            console.log("getTodos a girdi");

            $scope.listingId = $location.search().listingId;


            console.log($scope.listingId);



            $http.get(urlGetTodos + $scope.listingId)
                .then(
                    function (response) {
                        //errorCode a göre if else yap..
                        console.log("veri alındı " + response.data.errorCode + " , " + response.data.errorMessage);

                        $scope.todos = response.data.todoDetailList;



                    },

                    function (response) {
                        console.log("bağlantı hatası");
                    }
                )

        }

        $scope.deleteTodo = function (todoId, userName1) {

            alertify.confirm("İşi silmek istediğinden emin misin?", function (e) {
                if (e) {
                    if (userName1 == $scope.userName) {

                    $http.delete(urlDeleteTodo + todoId)
                        .then(
                            function (response) {
                                //errorCode a göre if else yap..
                                console.log("Bağlantı yapıldı" + response.data.errorCode + " , " + response.data.errorMessage);
                                alertify.alert("İş başarı ile silindi.");
                                $scope.getTodos();
                                $scope.getUserTodos();

                            },

                            function (response) {
                                console.log("bağlantı hatası");
                            }
                        )


                } else {

                    alertify.alert("sadece kendi oluşturduğun işleri silebilirsin.");


                }
                } else {
                    // user clicked "cancel"
                }
            });



            console.log("url değişti");


            //var todoId = $location.search().todoId;
            //var userName1=$location.search().userName;

            console.log(todoId);
            console.log($scope.userName);
            console.log(userName1);




        }

        $scope.addComment = function (comment) {

            console.log("add comment çalıştı");

            comment.userName = $scope.userName;
            comment.todoId = $scope.todoId;


            console.log(comment.todoId + " , " + comment.userName);

            console.log("comment ekleniyor");

            $http.put(urlAddComment, comment)
                .then(
                    function (response) {
                        //errorCode a göre if else yap..
                        console.log("bağlantı yapıldı" + response.data.errorCode + " , " + response.data.errorMessage);

                        $scope.getComments();
                    },


                    function (response) {
                        console.log("bağlantı hatası");
                    }
                );


        }

        $scope.getComments = function () {

            console.log("getComments a girdi");


            console.log($scope.todoId);

            $http.get(urlGetComments + $scope.todoId)
                .then(
                    function (response) {
                        //errorCode a göre if else yap..
                        console.log("veri alındı " + response.data.errorCode + " , " + response.data.errorMessage);

                        $scope.comments = response.data.commentDetailList;


                    },

                    function (response) {
                        console.log("bağlantı hatası");
                    }
                )

        }

        $scope.deleteComment = function (commentId, userName2){

            console.log("deleteComment çalıştı");


            console.log(commentId);
            console.log($scope.userName);
            console.log(userName2);

            alertify.confirm("Yorumu silmek istediğinden emin misin?", function (e) {
                if (e) {
                    if (userName2 == $scope.userName){

                        $http.delete(urlDeleteComment + commentId)
                            .then(
                                function (response) {
                                    //errorCode a göre if else yap..
                                    console.log("Bağlantı yapıldı" + response.data.errorCode + " , " + response.data.errorMessage);
                                    alertify.alert("Yorum başarı ile silindi.");
                                    $scope.getComments();
                                    $scope.getUserCommnets();

                                },

                                function (response) {
                                    console.log("bağlantı hatası");
                                }
                            )


                    } else {

                        alertify.alert("sadece kendi oluşturduğun yorumları silebilirsin.");


                    }
                } else {

                }
            });





        }

        $scope.giveRate = function (rate, todoId) {

            console.log("rate metodu çalıştı");

            var todo = {};
            todo.todoId = todoId;
            todo.rate = rate;


            $http.post(urlRateTodo + todoId, todo)
                .then(
                    function (response) {
                        //errorCode a göre if else yap..
                        console.log("bağlantı yapıldı" + response.data.errorCode + " , " + response.data.errorMessage);

                        $scope.getTodos();


                    },


                    function (response) {
                        console.log("bağlantı hatası");
                    }
                );



        }

        $scope.getUserPublicListings=function () {
            console.log("getUserPublicListings metoduna girdi");
            console.log($scope.userName+":kullanıcısın listeleri getiriliyor.");

            $http.get(urlGetUserPublicListings+$scope.userName)
                .then(
                    function (response) {
                        //errorCode a göre if else yap..
                        console.log("veri alındı " + response.data.errorCode + " , " + response.data.errorMessage);

                        $scope.userPublicListings = response.data.listingDetailList;

                        //$scope.listingId = $scope.listings.listingId;
                        //$scope.userNameGelen=$scope.listings.userName;


                    },

                    function (response) {
                        console.log("bağlantı hatası");
                    }
                );
        }

        $scope.getUserPrivateListings=function () {
            console.log("getUserPublicListings metoduna girdi");
            console.log($scope.userName+":kullanıcısın listeleri getiriliyor.");

            $http.get(urlGetUserPrivateListings+$scope.userName)
                .then(
                    function (response) {
                        //errorCode a göre if else yap..
                        console.log("veri alındı " + response.data.errorCode + " , " + response.data.errorMessage);

                        $scope.userPrivateListings = response.data.listingDetailList;

                        //$scope.listingId = $scope.listings.listingId;
                        //$scope.userNameGelen=$scope.listings.userName;


                    },

                    function (response) {
                        console.log("bağlantı hatası");
                    }
                );
        }

        $scope.getUserTodos=function () {

            console.log("getUserTodos a girdi");








            $http.get(urlGetUserTodos + $scope.userName)
                .then(
                    function (response) {
                        //errorCode a göre if else yap..
                        console.log("veri alındı " + response.data.errorCode + " , " + response.data.errorMessage);

                        $scope.userTodos = response.data.todoDetailList;



                    },

                    function (response) {
                        console.log("bağlantı hatası");
                    }
                )

        }

        $scope.getUserCommnets=function () {
            console.log("getUserComments a girdi");




            $http.get(urlGetUserCommnets + $scope.userName)
                .then(
                    function (response) {
                        //errorCode a göre if else yap..
                        console.log("veri alındı " + response.data.errorCode + " , " + response.data.errorMessage);

                        $scope.userComments = response.data.commentDetailList;



                    },

                    function (response) {
                        console.log("bağlantı hatası");
                    }
                )
        }
        
    });


})();