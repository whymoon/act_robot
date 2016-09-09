/**
 * Created by my dell on 2016/8/17.
 */
var NUM_PRINT_DATA = 7;
$(document).ready(function () {
    hideAll();
    ring();
    $('#microphone').click(function () {
        $('.weibo_line').hide();
        $('.sk-three-bounce').fadeIn();
        $('#user-speak').hide();
        $('#robot-answer').hide();
        $('#microphone').hide();
        $('#title').hide();
        $('#content').hide();
        $('#question').show();
        $('#begin-loading').hide();
        $.get("/act_robot/IatServlet",function (data) {
            console.log(data);
            $('#user-speak').text(data);
            $('#user-speak').show();
            $('#question-panel').fadeIn(2000);
            $('#padding-div').hide()
            $('.sk-three-bounce').hide();
            $('.sk-double-bounce').show();
            $('.sk-three-bounce1').hide();
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
    $('#content').hide();
    $('#begin-loading').show();
}
function ring() {
    $.get("/act_robot/RingServlet?ring=yes",function(data){
        var number;
        console.log(data.latestEvent);
        if(data.latestEvent.length < NUM_PRINT_DATA)
            number = data.latestEvent.length;
        else
            number = NUM_PRINT_DATA;
        var code = "";
        for(var i = 0; i < number; i++){
            if(data.latestEvent[i].description.indexOf("天气预报") == -1)
                code += "<h3>" + data.latestEvent[i].description + "</h3>";
        }
        code += "<h3>......</h3>";
        $('#content').html(code);
        $('#begin-loading').hide();
        $('#content').show();
    });
}
function getAnswer(question) {
    $.get("/act_robot/RingServlet?wd=" + question+ "&ring=no", function (data) {
        console.log(data);
        
        $('#robot-answer-title').text(data.content[0].description);
        $('#robot-answer-title').show();
        $('#robot-answer-corewd').text(data.content[0].corewords);
        $('#robot-answer-corewd').show();
        $('#robot-answer-eventType').text(data.content[0].eventType);
        $('#robot-answer-eventType').show();
        $('#robot-answer-hot').text(data.content[0].hot);
        $('#robot-answer-hot').show();
        $('#robot-answer-loc').text(data.content[0].eventLoc);
        $('#robot-answer-loc').show();
        $('#robot-answer-participant').text(data.content[0].participant);
        $('#robot-answer-participant').show();
        $('#robot-answer-emotion').text(data.content[0].emotion);
        $('#robot-answer-emotion').show();
        $('#robot-answer-date').text(data.content[0].dateString);
        $('#robot-answer-date').show();

        $('#answer-panel').fadeIn(2000);
        $('.weibo_line').show();
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