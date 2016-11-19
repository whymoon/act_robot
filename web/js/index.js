/**
 * Created by songxinxin on 2016/9/21.
 */
lastRes = "null";
var HOME_CHECK_INTERVAL = 1000;
var HOME_MAX_COUNT = 240;
var homeCount = 0;
var isSaid = false;
$(document).ready(function () {
    //google-chrome --kiosk http://example.com
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
    $.get("/act_robot/StateServlet?type=isBackgroundOpened",function (data) {
        console.log(data);
        if(data == "false"){
            $('#start-background').show();
            $('#stop-background').hide();
        }
        else{
            $('#start-background').hide();
            $('#stop-background').show();
        }
    });

    $('#stop-background').click(function () {
        if(window.confirm("警告!!此操作将关闭机器人程序，机器人状态获取、移动功能将无法正常工作，确定关闭？")){
            $.get("/act_robot/StateServlet?type=stopBackGround",function (data) {
                $('#start-background').show();
                $('#stop-background').hide();
                alert(data);
            });
        }
    });

    $("body").click(function (e) {
        if ($(e.target).attr("class") != "trigger")
            homeCount = 0;
    });

    setInterval(function () {
        homeCount++;
        if (homeCount >= HOME_MAX_COUNT){
            $.get("/act_robot/StateServlet?type=isHome",function (data) {
                if(data.trim() == "false"){
                    window.location.href = "nav-guide.html?goHome"
                }
            });
        }
    }, HOME_CHECK_INTERVAL);

    $('#start-background').click(function () {
        if(window.confirm("警告!!请将机器人放于初始位置，并保证正确的初始朝向，之后按确定启动机器人程序，错误的初始位置可能会导致定位系统混乱!!")){
            $.get("/act_robot/StateServlet?type=startBackGround",function (data) {
                $('#start-background').hide();
                $('#stop-background').show();
                alert(data);
            });
        }
    });

    //photo
    $('.trigger').click();
    setInterval(function () {
        if(!isSaid)
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
        if(data != "null")
            isSaid = true;
        if (data == "empty")
            speakText("你好！欢迎来到A C T实验室");
        else if (data != "null")
            speakText("你好！" + data);
    });
}

