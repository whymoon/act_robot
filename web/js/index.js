/**
 * Created by songxinxin on 2016/9/21.
 */
$(document).ready(function () {
    $('#webcam').resize(640, 480);
    $('#webcam').photobooth();
    $('#webcam').data("photobooth").resize(640, 480);
    $('#webcam').on("image",function(event, dataUrl){
        $("#picture").append( '<img src="' + dataUrl + '" width="128px" height="96px">');
        var file = dataURLtoBlob(dataUrl);
        uploadImage(file);
    });

    if(!$('#webcam').data('photobooth').isSupported){
        alert('HTML5 webcam is not supported by your browser, please use latest firefox, opera or chrome!');
    }
    $('#webcam').hide();
    $('#picture').hide();
});
//battery
function setProcess(n){
    var processbar = document.getElementById("processbar");
        processbar.style.width = n + "%";
        processbar.innerHTML =n + "%";
    }
setInterval(function(){
        $.post("/act_robot/ChargingServlet",function (data) {
            setProcess(parseInt(data));
        });
    },1000);
//photo
setInterval(function(){
    $('.trigger').click();
},5000);

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
        if(parseInt(data)>0)
            speakText("你好");
        // else
        //     speakText("你不是人");
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