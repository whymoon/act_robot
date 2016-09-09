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
        var number;
        console.log(data.content);
        if(data.content.length < NUM_PRINT_DATA)
            number = data.content.length;
        else
            number = NUM_PRINT_DATA;
        var code = "";
        for(var i = 0; i < number; i++){
            var hotbar = 100;
            if(data.content[i].hot < 100)
                hotbar = data.content[i].hot;
            code += "<div class='weibo_line'>";
            code += "<div class='event_desc'>";
            code += "<span class='badge badge-warning'>" + (i + 1) + "</span>";
            code += "<a href='#' class='robot-answer-title'>" + data.content[i].description +"</a><br/></div>";
            code += "<div style='margin-left: 5px; margin-bottom: 3px'>";
            code += "<span class='corewd' style='font-weight: bold'>关键词：</span>";
            code += "<span class = 'robot-answer-corewd'>" + data.content[i].corewords + "</span><br/>";
            code += "<span style='font-weight: bold'>参与者：</span>";
            code += "<span class='robot-answer-participant'>" + data.content[i].participant + "</span><br/>";
            code += "<span class='half-width'><span style='font-weight: bold'>事件类型：</span>";
            code += "<span class='robot-answer-eventType'>" + data.content[i].eventType + "</span>";
            code += "<span style='font-weight: bold'>地点：</span>";
            code += "<span class='robot-answer-loc'>" + data.content[i].eventLoc +"</span><br/>";
            code += "<span class='half-width'><span style='font-weight: bold'>事件情绪倾向：</span>";
            code += "<span class='robot-answer-emotion'>" + data.content[i].emotion +"</span></span>";
            code += "<span style='float: left; font-weight: bold'>热度：</span>";
            code += "<div class='progress' style='float: left; margin-top: 5px; margin-bottom: 0; height: 10px; width: 150px;'>";
            code += "<div class='progress-bar progress-bar-danger' style='width:" + hotbar + "%' aria-valuenow='" + hotbar + "' aria-valuemin='0' aria-valuemax='100'>";
            code += "<div class='bar'></div></div></div>";
            code += "<span style='margin: 0 0 0 0; font-size: 15px; color: #eb192d;'>&nbsp;" + data.content[i].hot + "</span></div></div>";
        }

        //$('#robot-answer-title').text(data.content[0].description);
        //$('#robot-answer-title').show();
        //$('#robot-answer-corewd').text(data.content[0].corewords);
        //$('#robot-answer-corewd').show();
        //$('#robot-answer-eventType').text(data.content[0].eventType);
        //$('#robot-answer-eventType').show();
        //$('#robot-answer-hot').text(data.content[0].hot);
        //$('#robot-answer-hot').show();
        //$('#robot-answer-loc').text(data.content[0].eventLoc);
        //$('#robot-answer-loc').show();
        //$('#robot-answer-participant').text(data.content[0].participant);
        //$('#robot-answer-participant').show();
        //$('#robot-answer-emotion').text(data.content[0].emotion);
        //$('#robot-answer-emotion').show();
        //$('#robot-answer-date').text(data.content[0].dateString);
        //$('#robot-answer-date').show();
        $('#answer-panel .panel-body').html(code);
        $('#answer-panel').fadeIn(2000);
        // $('.weibo_line').show();
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