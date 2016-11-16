/**
 * Created by my dell on 2016/9/8.
 */
var STATE_GUIDING = 0;
var STATE_STOP = 1;
var STATE_BACKING = 2;
var STATE_GUIDE_FINISHED = 3;
var STATE_BACK_FINISHED = 4;

var state = STATE_GUIDING;
var count = 0;
var tipText = "";
var stopLastState = STATE_GUIDING;

$(document).ready(function () {
    speakText("");
    tipText = $('#nav-tips').text();
    $('#guide-finish').hide();
    $('#guide-stop').hide();

    $('.stop').click(function () {
        stop();
    });
    $('.back').click(function () {
        goBack();
    });
    $('.continue').click(function () {
        continueGuide();
    });
    $('.detail').click(function () {
        detail();
    });
    $('.return').click(function () {
        window.location.href = "nav.html";
    });
    var currentUrl = window.location.href;
    if(currentUrl.indexOf("?") != -1){
        if(currentUrl.split("?")[1] == "goHome")
            $('.back').click();
    }

    setInterval(function () {
        if(state == STATE_GUIDING){
            $.get("/act_robot/StateServlet?type=isNavFinished", function (data) {
                if (data == "true") {
                    guideFinish();
                }
            });
        }
    }, 1000);//时间以毫秒算

    setInterval(function () {
        if (state != STATE_GUIDE_FINISHED)
            return;
        count++;
        if (count >= 600)
            goBack();
    }, 1000);
    $("body").click(function (e) {
        count = 0;
    });
});

function goBack() {
    state = STATE_BACKING;
    $('#nav-tips').text("正在返航");
    $('#guiding').show();
    $('#guide-stop').hide();
    $('#guide-finish').hide();
    speakText("正在返航");
    $.get("/act_robot/NavServlet?text=back&des=back", function (data) {
        setInterval(function () {
            if(state == STATE_BACKING){
                $.get("/act_robot/StateServlet?type=isNavFinished", function (data) {
                    if (data == "true") {
                        backFinsih();
                    }
                });
            }
        }, 1000);//时间以毫秒算
    });
}
function stop() {
    stopLastState = state;
    state = STATE_STOP;
    $('#guiding').hide();
    $('#guide-stop').show();
    tipText = $('#nav-tips').text();
    speakText("导航已停止，请选择返航或继续");
    $.get("/act_robot/StateServlet?type=stop", function (data) {
        console.log(data);
    });
}

function detail() {
    $.get("/act_robot/StateServlet?type=detail", function (data) {
        console.log(data);
    });
}

function guideFinish() {
    state = STATE_GUIDE_FINISHED;
    $('#guide-finish').show();
    $('#guiding').hide();
    speakText("已经到达目的地，请选择返航或去下一个地点");
}

function backFinsih() {
    state = STATE_BACK_FINISHED;
    speakText("返航成功");
    setTimeout("window.location.href = 'nav.html'", 2000);
}

function continueGuide() {
    state = stopLastState;
    $('#nav-tips').text(tipText);
    $('#guiding').show();
    $('#guide-stop').hide();
    speakText("继续导航");
    $.get("/act_robot/StateServlet?type=continueGuide", function (data) {
        console.log(data);
    });
}

function speakText(contentText) {
    $.post("/act_robot/TtsServlet",
        {
            text: contentText
        },
        function (data) {
        }
    );
}