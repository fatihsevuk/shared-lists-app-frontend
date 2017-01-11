window.fbAsyncInit = function() {
    FB.init({
        appId      : '#####',
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