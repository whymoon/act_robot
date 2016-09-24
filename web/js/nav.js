/**
 * Created by my dell on 2016/9/8.
 */
$(document).ready(function () {
    speakText("");
    hideAll();
    speakText("请告诉我您要去哪里，或点击屏幕上的目的地。");
    $('#microphone').click(function () {
        speakText("");
        $('.sk-three-bounce').fadeIn();
        $('#robot-answer').hide();
        $('#microphone').hide();

        $.get("/act_robot/IatServlet", function (text) {
            $('.sk-three-bounce').show();
            $.get("/act_robot/NavServlet?text=" + text, function (data) {
                if (data == "1") {
                    console.log(data);
                    speakText("即将带您去" + data + "，请跟我走。");
                    setTimeout("window.location.href = 'nav-guide.html'",4000);
                }
                else {
                    console.log(data);
                    speakText("无法识别目的地，请重试");
                    $('.sk-double-bounce').show();
                    $('.sk-three-bounce').hide();
                    $('.sk-double-bounce').hide();
                    $('#microphone').show();
                    $('#guide_answer').show();
                    $('#b1').hide();
                    $('#b2').show();
                }
            });
        });
    });

    $('.destination').click(function () {
        speakText("即将带您去" + $(this).text() + "，请跟我走。");
        setTimeout("window.location.href = 'nav-guide.html'",5000);
    });

});


function hideAll() {
    $('.sk-three-bounce').hide();
    $('.sk-double-bounce').hide();
    $('#guide_answer').hide();
    $('#robot-answer').hide();
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