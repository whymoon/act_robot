/**
 * Created by songxinxin on 2016/9/21.
 */
lastRes = "null";
$(document).ready(function () {
    speakText("");
    $('#webcam').resize(640, 480);
    $('#webcam').photobooth();
    $('#webcam').data("photobooth").resize(640, 480);
    $('#webcam').on("image",function(event, dataUrl){
        var file = dataURLtoBlob(dataUrl);
        uploadImage(file);
    });

    if(!$('#webcam').data('photobooth').isSupported){
        alert('HTML5 webcam is not supported by your browser, please use latest firefox, opera or chrome!');
    }
    $('#webcam').hide();

    //battery
    setInterval(function(){
        $.post("/act_robot/ChargingServlet",function (data) {
            setBattery(data);
        });
    },5000);
    //photo
    $('.trigger').click();
    setInterval(function(){
        $('.trigger').click();
    },5000);
});

function setBattery(n){
    console.log(n);
    $('#charge').width(n + "%");
    $('#charge').text(n + "%");
}


function dataURLtoBlob(dataUrl) {
    // Decode the dataURL
    var binary = atob(dataUrl.split(',')[1]);

    // Create 8-bit unsigned array
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }

    // Return our Blob object
    return new Blob([new Uint8Array(array)], {
        type: 'image/png'
    });
}
function uploadImage(file) {
    var fd = new FormData();
    fd.append('photo', file);
    $.ajax({
        type: 'POST',
        url: '/act_robot/HelloServlet',
        data: fd,
        processData: false,
        contentType: false
    }).done(function(data) {
        console.log(data);
        if(data == lastRes){
            console.log("same " + lastRes);
            return;
        }
        lastRes = data;
        if(data == "empty")
            speakText("你好！");
        else if(data != "null")
            speakText("你好！" + data);
    });
}

function speakText(contentText) {
    $.post("/act_robot/TtsServlet",
        {
            text: contentText
        },
        function(data){
            console.log(data);
        });
}