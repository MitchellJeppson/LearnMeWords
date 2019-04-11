
function signInClick(){
    window.location.replace('/');
}

function signUpClick(){
    const firstName = $('#fName')[0].value;
    const lastName = $('#lName')[0].value;
    const username = $('#username')[0].value;
    const password = $('#password')[0].value;
    const password2 = $('#password2')[0].value;

    const passwordRegex = /^[A-Za-z]\w{6,12}$/;
    if(password !== password2){
        $('#passwordsDontMatchMessage').show('fast');
        $('#passwordFormatMessage').hide('fast');
        $('#invalidMessage').hide('fast');
        return;
    }
    else if(!password.match(passwordRegex)){
        $('#passwordFormatMessage').show('fast');
        $('#passwordsDontMatchMessage').hide('fast');
        $('#invalidMessage').hide('fast');
        return;
    }

    sendPostRequest("/db/createUser", {firstName: firstName, lastName: lastName, username: username, password: password, password2: password2});
}

$(document).ready(function(){
    $('.box').hide().fadeIn(1000);
});

$("a").click(function (evt){
    evt.preventDefault();
    return false;
});
