/**
 * Created by my dell on 2016/9/8.
 */
var i = 0;
var t = self.setInterval('count()',1000);
$(document).ready(function () {
    speakText("");
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
                if (!(data == "error")) {
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
    $("body").click(function () {
        i = 0;
    })

    $('.destination').click(function () {
        $('#guide_answer span').text($(this).text());
        $('#guide_answer').show();
        $.get("/act_robot/NavServlet?text=empty&des=" + $(this).text(), function (data) {
            if (!(data == "error")) {
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
function count(){
    i++;
    if(i>=300)
        window.location.href='index.html';
}

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