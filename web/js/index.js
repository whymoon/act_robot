/**
 * Created by songxinxin on 2016/9/21.
 */
lastRes = "null";
$(document).ready(function () {
    $('#webcam').resize(640, 480);
    $('#webcam').photobooth();
    $('#webcam').data("photobooth").resize(640, 480);
    $('#webcam').on("image", function (event, dataUrl) {
        var file = dataURLtoBlob(dataUrl);
        uploadImage(file);
    });
    if (!$('#webcam').data('photobooth').isSupported) {
        alert('HTML5 webcam is not supported by your browser, please use latest firefox, opera or chrome!');
    }
    $('#webcam').hide();

    //photo
    $('.trigger').click();
    setInterval(function () {
        $('.trigger').click();
    }, 3000);
});

function uploadImage(file) {
    var fd = new FormData();
    fd.append('photo', file);
    $.ajax({
        type: 'POST',
        url: '/act_robot/HelloServlet',
        data: fd,
        processData: false,
        contentType: false
    }).done(function (data) {
        console.log(data);
        if (data == lastRes) {
            console.log("same " + lastRes);
            return;
        }
        lastRes = data;
        if (data == "empty")
            speakText("你好！");
        else if (data != "null")
            speakText("你好！" + data);
    });
}

