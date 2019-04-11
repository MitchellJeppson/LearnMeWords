
function signInClick(){

    const username = $('#username')[0].value;
    const password = $('#password')[0].value;

    sendPostRequest("/db/signIn", {username: username, password: password});
}

function signUpClick(){
    window.location.href = "/signUp";
}

$(document).ready(function(){
    $('.box').hide().fadeIn(1000);
});

$("a").click(function (evt){
    evt.preventDefault();
    return false;
});
