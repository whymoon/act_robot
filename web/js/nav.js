/**
 * Created by my dell on 2016/9/8.
 */
$(document).ready(function () {
    hideAll();
    speakText("请告诉我您要去哪里，或点击屏幕上的目的地。");
    $('#microphone').click(function () {
        speakText("");
        $('.sk-three-bounce').fadeIn();
        $('#robot-answer').hide();
        $('#microphone').hide();
        $('#guide_answer').hide();
        $.get("/act_robot/IatServlet", function (text) {
            $('.sk-three-bounce').show();
            $('#guide_answer span').text(text);
            $('#guide_answer').show();
            $.get("/act_robot/NavServlet?text=" + text + "&des=empty", function (data) {
                if (data != "error") {
                    console.log(data);
                    data = data.trim();
                    var reg = new RegExp("^[0-9]*$");
                    if (reg.test(data)) {
                        var speakData = "";
                        for (var i = 0; i < data.length; i++) {
                            speakData += data[i];
                            speakData += " ";
                        }
                    }
                    console.log(speakData);
                    speakText("即将带您去" + speakData.trim() + "，请跟我走。");
                    setTimeout("window.location.href = 'nav-guide.html'", 4000);
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
        $('#guide_answer span').text($(this).text());
        $('#guide_answer').show();
        var clickText = $(this).text().trim();
        var des = clickText.replace(new RegExp(" ", "gm"), "");
        console.log(des);
        $.get("/act_robot/NavServlet?text=empty&des=" + des, function (data) {
            if (data != "error") {
                speakText("即将带您去" + clickText + "，请跟我走。");
                setTimeout("window.location.href = 'nav-guide.html'", 4000);
            }
            else {
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

function hideAll() {
    $('.sk-three-bounce').hide();
    $('.sk-double-bounce').hide();
    $('#guide_answer').hide();
    $('#robot-answer').hide();
}