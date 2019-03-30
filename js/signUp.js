async function signInClick(){
    window.location.replace('/');
}

function checkUsername(username){
    return true;
}

async function signUpClick(){
    const fName = $('#fName')[0].value;
    const lName = $('#lName')[0].value;
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


    if(checkUsername(username)){
        let response = await fetch("/db/createUser", {
            method: "POST",
            body: JSON.stringify({fName: fName, lName: lName, username: username, password: password}),
            headers: {
                "Content-Type": "application/json"
            }
        });

        let responseJson = await response.json();
        if(responseJson.result == "good"){
            window.location.replace("/home");
        }
        else{
            $('#invalidMessage').show('fast');
        }
    }
    else{

    }
}

$(document).ready(function(){
    $('.box').hide().fadeIn(1000);
});

$("a").click(function (evt){
    evt.preventDefault();
    return false;
});
