/**
 * Created by my dell on 2016/8/17.
 */
var NUM_PRINT_DATA = 6;
$(document).ready(function () {
    hideAll();
    ring();
    $('#microphone').click(function () {
        // speakText(text).stop();
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
    $('#return').click(function () {
        window.history.back();
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
        var text = "以下是今天的热门事件：";
        console.log(data.latestEvent);
        if(data.latestEvent.length < NUM_PRINT_DATA)
            number = data.latestEvent.length;
        else
            number = NUM_PRINT_DATA;
        var code = "<ul>";
        for(var i = 0; i < number; i++){
            if(data.latestEvent[i].description.indexOf("天气预报") == -1)
                code += "<li style='font-size: 20px'>" + data.latestEvent[i].description + "</li>";
                text += data.latestEvent[i].description + ";";
        }
        // code += "<h3>......</h3>";
        code += "</ul>";
        $('#content').html(code);
        $('#begin-loading').hide();
        $('#content').show();
        speakText(text);
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
        var relatedContent = "有关内容如下：";
        for(var i = 0; i < number; i++) {
            var hotbar = 100;
            if (data.content[i].hot < 100)
                hotbar = data.content[i].hot;
            if (i % 2 == 0)
                code += "<div style='height: 140px'><div style='float:left;width:49%'>";
            else
                code += "<div style='float:right;width:49%'>";
            code += "<div class='weibo_line'>";
            code += "<div class='event_desc'>";
            code += "<span class='badge badge-warning'>" + (i + 1) + "</span>";
            code += "<a href='#' class='robot-answer-title'>" + data.content[i].description + "</a><br/></div>";
            var j = i+1;
            relatedContent += j+ ";"+data.content[i].description + ";";
            code += "<div style='margin-left: 5px; margin-bottom: 3px'>";
            code += "<span class='corewd' style='font-weight: bold'>关键词：</span>";
            code += "<span class = 'robot-answer-corewd'>" + data.content[i].corewords + "</span><br/>";
            relatedContent += "关键词有："+ data.content[i].corewords + ";";
            if (data.content[i].participant != "") {
                code += "<span style='font-weight: bold'>参与者：</span>";
                code += "<span class='robot-answer-participant'>" + data.content[i].participant + "</span><br/>";
                relatedContent += "参与者有："+ data.content[i].participant + ";";
            }
            // code += "<span class='half-width'><span style='font-weight: bold'>事件类型：</span>";
            // code += "<span class='robot-answer-eventType'>" + data.content[i].eventType + "</span>";
            if (data.content[i].eventLoc != "其他") {
                code += "<span style='font-weight: bold'>地点：</span>";
                code += "<span class='robot-answer-loc'>" + data.content[i].eventLoc + "</span><br/>";
                relatedContent += "地点："+ data.content[i].eventLoc + ";";
            }
            // code += "<span class='half-width'><span style='font-weight: bold'>事件情绪倾向：</span>";
            // code += "<span class='robot-answer-emotion'>" + data.content[i].emotion +"</span></span>";
            code += "<span style='float: left; font-weight: bold'>热度：</span>";
            code += "<div class='progress' style='float: left; margin-top: 5px; margin-bottom: 0; height: 10px; width: 150px;'>";
            code += "<div class='progress-bar progress-bar-danger' style='width:" + hotbar + "%' aria-valuenow='" + hotbar + "' aria-valuemin='0' aria-valuemax='100'>";
            code += "<div class='bar'></div></div></div>";
            code += "<span style='margin: 0 0 0 0; font-size: 15px; color: #eb192d;'>&nbsp;" + data.content[i].hot + "</span></div></div>";
            relatedContent += "今日热度为："+ data.content[i].hot + ";";
            if(i%2==0)
                code +="</div>";
            else
                code +="</div></div>";

        }
        speakText(relatedContent);
        $('#answer-panel .panel-body').html(code);
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