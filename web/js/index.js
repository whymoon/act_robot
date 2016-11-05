/**
 * Created by songxinxin on 2016/9/21.
 */
lastRes = "null";
var i = 0;
var t = self.setInterval('count()',1000);
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
        $.get("/act_robot/StateServlet?type=battery",function (data) {
            setBattery(data);
            if(data <= 10){
                lowBattery();
            }
        });
    },5000);
    //photo
    $('.trigger').click();
    setInterval(function(){
        $('.trigger').click();
    },3000);
    $("body").click(function () {
        if($(e.target().is('trigger')))
            i = i;
        else
             i = 0;
    })
});
function count(){
    i++;
    if(i>=300)
        window.location.href='screenSaver.html';
}
function setBattery(n){
    console.log(n);
    $('#charge').width(n + "%");
    $('#charge').text(n + "%");
}

function lowBattery() {
    var r = confirm("Low Battery!");
    if(r == true){
        window.location.href="charging.html";
        return true;
    }else {
        return false;
    }
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