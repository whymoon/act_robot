/**
 * Created by my dell on 2016/8/17.
 */
var NUM_PRINT_DATA = 4;
var NUM_PRINT_DATA_HOME_PAGE = 8;
var latestEvent;
var EVENT_TYPE = ["其它事件", "自然灾害事件", "安全事故灾难", "环境污染和生态破坏事故", "公共卫生事件",
    "其它事件", "社会安全事件", "政治新闻事件", "军事事件", "社会焦点事件"];
var MOOD_TYPE = ["中性", "高兴", "愤怒", "悲伤"];
$(document).ready(function () {
    hideAll();
    getRecentHotSpot();
    $('#microphone').click(function () {
        speakText("");
        $('#listening').fadeIn();
        $('#user-speak').hide();
        $('#robot-answer').hide();
        $('#microphone').hide();
        $('#title').text("告诉我您感兴趣的关键词 ");
        $('#content').hide();
        $('#question-panel').hide();
        $('#answer-panel').hide();
        $('#begin-loading').hide();
        $.get("/act_robot/IatServlet", function (data) {
            console.log(data);
            $('#user-speak').text(data);
            $('#user-speak').show();
            $('#question-panel').fadeIn(2000);
            $('#listening').hide();
            $('#searching').show();
            getAnswer(data);
        });
    });
});

function getRecentHotSpot() {
    speakText($('#title').text());
    $.get("/act_robot/RingServlet?type=latest&wd=",function(data){
        var number;
        console.log(data.latestEvent);
        if(data.latestEvent.length < NUM_PRINT_DATA_HOME_PAGE)
            number = data.latestEvent.length;
        else
            number = NUM_PRINT_DATA_HOME_PAGE;
        quickSort_hot(data.latestEvent,0,number-1);
        latestEvent = data.latestEvent;
        var code = "";
        var speakContent = "";
        for(var i = 0; i < number; i++){
            if(data.latestEvent[i].description.indexOf("天气预报") == -1) {
                code += "<div class='row bs-callout bs-callout-primary content-item'>";
                code += "<div class='col-md-1' align='center'><span class='badge'>" + data.latestEvent[i].hot + "</span></div>";
                code += "<div class='col-md-11'>";
                code += "<a href='#' data-toggle='modal' data-target='#detail-modal'>";
                code += "<h4><span>" + data.latestEvent[i].description + "<small>&nbsp;&nbsp;"
                code += data.latestEvent[i].eventLoc + "</small></span></h4>";
                code += "</a></div><div style='display: none' class='item-index'>" + i + "</div></div>";
                speakContent += data.latestEvent[i].description + ";";
            }
        }
        $('#content').html(code);
        $('#begin-loading').hide();
        $('#content').show();
        $('.content-item').click(function () {
            var itemIndex = parseInt($(this).children("div.item-index").text());
            console.log(parseInt(latestEvent[itemIndex].eventType) + " " + parseInt(latestEvent[itemIndex].emotion));
            $('#detail-desc').text(latestEvent[itemIndex].description);
            $('#detail-keywords').text(latestEvent[itemIndex].corewords);
            $('#detail-loc').text(latestEvent[itemIndex].eventLoc);
            $('#detail-hot').text(latestEvent[itemIndex].hot);
            $('#detail-people').text(latestEvent[itemIndex].participant);
            if(latestEvent[itemIndex].relatedWeibos.length > 0)
                $('#detail-weibo').text(latestEvent[itemIndex].relatedWeibos[0].content);
            else
                $('#detail-weibo').text("无");
            if((latestEvent[itemIndex].eventType+"").trim() != "")
                $('#detail-type').text(EVENT_TYPE[parseInt(latestEvent[itemIndex].eventType)]);
            else
                $('#detail-type').text("未知");
            if((latestEvent[itemIndex].emotion+"").trim() != "")
                $('#detail-mood').text(MOOD_TYPE[parseInt(latestEvent[itemIndex].emotion)]);
            else
                $('#detail-mood').text("未知");
        });
        speakText(speakContent);
    });
}

function hideAll(){
    $('#listening').hide();
    $('#searching').hide();
    $('#question-panel').hide();
    $('#answer-panel').hide();
    $('#user-speak').hide();
    $('#robot-answer').hide();
}

function getAnswer(question) {
    $.get("/act_robot/RingServlet?type=search&wd=" + question, function (data) {
        console.log(data);
        var number;
        console.log(data.content);
        if(data.content.length < NUM_PRINT_DATA)
            number = data.content.length;
        else
            number = NUM_PRINT_DATA;
        var code = "";
        var relatedContent = "有关内容如下：";
        quickSort_hot(data.content,0,number-1);
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
            code += "&nbsp;&nbsp;<a href='#' class='robot-answer-title' style='font-size: large'>" + data.content[i].description + "</a><br/></div>";
            var j = i+1;
            relatedContent += j+ ";"+data.content[i].description + ";";
            code += "<div style='margin-left: 5px; margin-bottom: 3px'>";
            code += "<span class='corewd' style='font-weight: bold'>关键词：</span>";
            code += "<span class = 'robot-answer-corewd'>" + data.content[i].corewords + "</span><br/>";
            //relatedContent += "关键词有："+ data.content[i].corewords + ";";
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
        $('#listening').hide();
        $('#searching').hide();
        $('#microphone').show();
    });
}

