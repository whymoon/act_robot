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
    $('#stop-background').hide();

    $('#stop-background').click(function () {
        if(window.confirm("此操作将关闭机器人程序，机器人状态获取、移动功能将无法正常工作，确定重启？")){
            $.get("/act_robot/StateServlet?type=stopBackGround",function (data) {
                $('#start-background').show();
                $('#stop-background').hide();
            });
        }
    });

    $('#start-background').click(function () {
        if(window.confirm("请将机器人放于初始位置，并保证正确的初始朝向，之后按确定启动机器人程序")){
            $.get("/act_robot/StateServlet?type=startBackGround",function (data) {
                $('#start-background').hide();
                $('#stop-background').show();
            });
        }
    });

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

