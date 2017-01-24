var myApp=angular.module("myApp" , []);
myApp.controller("myController" , ['$scope' , function ($scope) {


    $scope.facebook={
        username:"",
        email:""
    };

    $scope.onFBLogin =function () {
        FB.login(function (response) {
            if(response.authResponse){
                FB.api('/me' , 'GET' , {fields:'email , first_name , name , id , picture'} ,function (response) {
                    $scope.$apply(function () {
                        $scope.facebook.username=response.name;
                        $scope.facebook.email=response.email;
                        $scope.fb_image=response.picture.data.url;
                    });

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


}]);