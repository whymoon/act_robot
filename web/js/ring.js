/**
 * Created by my dell on 2016/8/17.
 */
$(document).ready(function () {
    hideAll();
    $('#microphone').click(function () {
        $('.sk-three-bounce').fadeIn();
        $('#user-speak').hide();
        $('#robot-answer').hide();
        $('#microphone').hide();
        $('#title').hide();
        $('#content1').hide();
        $('#content2').hide();
        $('#content3').hide();
        $('#content4').hide();
        $('#content5').hide();
        $('#question').show();
        //$('#content5').hide();
        $.get("/act_robot/IatServlet",function (data) {
            console.log(data);
            $('#user-speak').text(data);
            $('#user-speak').show();
            $('#question-panel').fadeIn(2000);
            $('#padding-div').hide()
            $('.sk-three-bounce').hide();
            $('.sk-double-bounce').show();
            getAnswer(data);
        });
    })
});
function hideAll(){
    $('.sk-three-bounce').hide();
    $('.sk-double-bounce').hide();
   $('#question-panel').hide();
    $('#answer-panel').hide();
   $('#user-speak').hide();
    $('#robot-answer').hide();
    $('#question').hide();
}

function getAnswer(question) {
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
        function(data){
            console.log(data);
        });
}