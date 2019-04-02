async function signInClick(){
    const u = $('#username')[0].value;
    const p = $('#password')[0].value;

    let response = await fetch("/db/signIn", {
        method: 'POST',
        body:  JSON.stringify({username: u, password: p}),
        headers: {
            "Content-Type": "application/json"
        }
    });

    let responseJson = await response.json();
    if(responseJson.result == "good"){
        console.log("inside good");
        window.location.replace('/home');
    }
    else{
        $("#invalidMessage").show('fast');
    }
}

function signUpClick(){
    window.location.replace('/signUp')
}

//Fade in dashboard box
$(document).ready(function(){
    $('.box').hide().fadeIn(1000);
});

$("a").click(function (evt){
    evt.preventDefault();
    return false;
});
