/**
 * Created by Moon on 2016/7/30.
 */
var i = 0;
var t = self.setInterval('count()',1000);
$(document).ready(function () {
    speakText("");
    hideAll();
    speakText($('#title').text());
    $('#microphone').click(function () {
        speakText("");
        $('.sk-three-bounce').fadeIn();
        $('#user-speak').hide();
        $('#robot-answer').hide();
        $('#microphone').hide();
        $.get("/act_robot/IatServlet", function (data) {
            console.log(data);
            $('#user-speak').text(data);
            $('#user-speak').show();
            $('#question-panel').fadeIn(2000);
            $('#padding-div').hide();
            $('.sk-three-bounce').hide();
            $('.sk-double-bounce').show();
            getAnswer(data);
        });
    })
    $("body").click(function () {
        i = 0;
    })
});
function count(){
    i++;
    if(i>=300)
        window.location.href='index.html';
}
function hideAll() {
    $('.sk-three-bounce').hide();
    $('.sk-double-bounce').hide();
    $('#question-panel').hide();
    $('#answer-panel').hide();
    $('#user-speak').hide();
    $('#robot-answer').hide();
}

function getAnswer(question) {
    // $.get("/act_robot/KnowledgeServlet", function (data) {
    //     console.log(data);
    //     $('#robot-answer').text(data);
    //     $('#robot-answer').show();
    //     $('#answer-panel').fadeIn(2000);
    //     $('#padding-div').hide();
    //     $('.sk-three-bounce').hide();
    //     $('.sk-double-bounce').hide();
    //     $('#microphone').show();
    //     speakText(data);
    // });
    if(question.trim()==""){
        var answer = "对不起，我没有听清";
        $('#robot-answer').text(answer);
        $('#robot-answer').show();
        $('#answer-panel').fadeIn(2000);
        $('#padding-div').hide();
        $('.sk-three-bounce').hide();
        $('.sk-double-bounce').hide();
        $('#microphone').show();
        speakText(answer);
        return;
    }

    $.get("http://www.tuling123.com/openapi/api?key=3aa506e60d4a42c2a182b93360799c24&info=" +　question, function (data) {
            console.log(data.text);
            $('#robot-answer').text(data.text);
            $('#robot-answer').show();
            $('#answer-panel').fadeIn(2000);
            $('#padding-div').hide();
            $('.sk-three-bounce').hide();
            $('.sk-double-bounce').hide();
            $('#microphone').show();
        speakText(data.text);
    });
}

function speakText(contentText) {
    $.post("/act_robot/TtsServlet",
        {
            text: contentText
        },
        function(data) {
            console.log(data);
        });
}