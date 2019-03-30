async function sendData (data, word){
    var fd = new FormData();
    fd.append('upl', data, word);
    let response = await fetch('/processAudio', {
        method: 'post',
        body: fd,
        headers: {
            enctype: 'multipart/form-data',
        }
    });

    let responseJson = await response.json();
    alert(responseJson.outputMessage+"\nYou guessed: "+responseJson.userWord+"\nGoogle Understood: "+responseJson.understoodWord);
}

function handleClick(elem, word){
    var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple'
    });

    wavesurfer.load('/crowd-cheering.mp3');
    wavesurfer.toggleMute();

    wavesurfer.on('ready', function () {
        wavesurfer.play();
    });

    console.log(word);
}

function wordClicked(word){
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    function hasGetUserMedia() {
        return !!(navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia);
        }

        if (hasGetUserMedia()) {
            console.log("good!");
        } else {
            alert('getUserMedia() is not supported by your browser');
        }

        navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
            context = new AudioContext()

            var source = context.createMediaStreamSource(stream)

            var rec = new Recorder(source)
            rec.record();

            setTimeout(() => {
                rec.stop();
                blob = rec.exportWAV((blob) => {
                    sendData(blob, word);
                });
            }, 3000);

        }).catch(function(err){
            console.log("Declined");
            console.log(err);
        });
    }
