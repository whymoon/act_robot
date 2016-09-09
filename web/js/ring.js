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
// function ring() {
//     $.get("/act_robot/RingServlet?ring="+"yes",function(data){
//
//     });
// }
function getAnswer(question) {
    $.get("/act_robot/RingServlet?wd=" + question, function (data) {
        $('#robot-answer-title').text(data.content[0].hot);
        $('#robot-answer-title').show();
        $('#robot-answer-hot').text(data.content[0].hot);
        $('#robot-answer-hot').show();
        $('#robot-answer-loc').text(data.content[0].eventLoc);
        $('#robot-answer-loc').show();
        $('#robot-answer-participant').text(data.content[0].participant);
        $('#robot-answer-participant').show();
        $('#answer-panel').fadeIn(2000);
        $('#padding-div').hide();
        $('.sk-three-bounce').hide();
        $('.sk-double-bounce').hide();
        $('#microphone').show();
        console.log("ring finished!");
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