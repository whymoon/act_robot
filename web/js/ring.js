/**
 * Created by my dell on 2016/8/17.
 */
var NUM_PRINT_DATA = 4;
var NUM_PRINT_DATA_ring = 6;
var i = 0;
var t = self.setInterval('count()',1000);
$(document).ready(function () {
    speakText("");
    hideAll();
    ring();
    // $('.badge a').on("click","h4",function () {
    //     alert("nishi");
    // })
    $('#microphone').click(function () {
        speakText("");
        $('.weibo_line').hide();
        $('.sk-three-bounce').fadeIn();
        $('#user-speak').hide();
        $('#robot-answer').hide();
        $('#microphone').hide();
        $('#title').hide();
        // $('#content').hide();
        $('#content').show();
        $('#question').show();
         $('#question-panel').hide();
        $('#answer-panel').hide();
        $('#begin-loading').hide();
        $.get("/act_robot/IatServlet",function (data) {
            console.log(data);
            var ask = askForDetails(data);
            if(ask == 1 | ask == 2 | ask == 3 | ask == 4 | ask == 5 | ask == 6){
                var ask1 = document.getElementsByTagName("a")[ask-1];
                var href = document.getElementsByClassName("badge")[ask-1].click;
                speakText(ask);
                console.log(ask1);
                console.log(href);
            }
            else{
                $('#content').hide();
                $('#user-speak').text(data);
                $('#user-speak').show();
                $('#question-panel').fadeIn(2000);
                $('#padding-div').hide()
                $('.sk-three-bounce').hide();
                $('.sk-double-bounce').show();
                $('.sk-three-bounce1').hide();
                getAnswer(data);
            }

            // }
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
function ring() {
    speakText($('#title').text());
    $.get("/act_robot/RingServlet?ring=yes",function(data){
        var number;
        console.log(data.latestEvent);
        if(data.latestEvent.length < NUM_PRINT_DATA_ring)
            number = data.latestEvent.length;
        else
            number = NUM_PRINT_DATA_ring;
        quickSort_hot(data.latestEvent,0,number-1);
        var code = "";
        var speakContent = "";
        for(var i = 0; i < number; i++){
            if(data.latestEvent[i].description.indexOf("天气预报") == -1) {
                code += "<div class='bs-callout bs-callout-primary' >";
                code += "<a   data-toggle='modal'  href='#dialog' onclick='openWin(\""+ data.latestEvent[i].description +"\",\""+ data.latestEvent[i].corewords +"\",\""+ data.latestEvent[i].eventId +"\");'><h4>" + "<span class='badge'>"+data.latestEvent[i].hot + "</span> &nbsp;&nbsp;" + data.latestEvent[i].description +" <small>地点:"+data.latestEvent[i].eventLoc+"</small></h4></a>";
                //code += "<a   data-toggle='modal'  href='#dialog' ><h4>" + "<span class='badge'>"+data.latestEvent[i].hot + "</span> &nbsp;&nbsp;" + data.latestEvent[i].description +" <small>地点:"+data.latestEvent[i].eventLoc+"</small></h4></a>";
                code += "</div>";
                speakContent += data.latestEvent[i].description + ";";
            }
        }
        $('#content').html(code);
        $('#begin-loading').hide();
        $('#content').show();
        speakText(speakContent);
    });
}
function askForDetails(text) {
    var regex = "";
    var str = "";
    var num = "";
    var des = 0;
    regex += "(告诉我[\\u4e00-\\u9fa5]+)|" + "(我想看[\\u4e00-\\u9fa5]+)|" + "(我想知道[\\u4e00-\\u9fa5]+)|"
        + "(我要看[\\u4e00-\\u9fa5]+)|" + "(我要知道[\\u4e00-\\u9fa5]+)|";
    if(text.match(regex)){
        str = text.match("第[一二三四五六]条");
        if(str != null) {
            for (var i = 0; i < str.length; i++) {
                if (str[i] != "") {
                    num = str[i];
                    break;
                }
            }
            if(text.match("一"))
                des = 1;
            else if(text.match("二"))
                des = 2;
            else if(text.match("三"))
                des = 3;
            else if(text.match("四"))
                des = 4;
            else if(text.match("五"))
                des = 5;
            else
                des = 6;
        }
    }
    $('.sk-three-bounce').hide();
    $('.sk-double-bounce').hide();
    $('#microphone').show();
    return des;
}

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
function voice() {
    speakText("");
}
function openWin(description,words,Id)
{
    var year = parseInt(Id.substr(0,4));
    var month = parseInt(Id.substr(4,2));
    var day = parseInt(Id.substr(6,2));
    var hour = parseInt(Id.substr(8,2));
    var minute = parseInt(Id.substr(10,2));
    var date = year + "年"+ month  + "月"+ day  + "日"+ hour + "时"+minute+"分";
    var s = "<h4>标题：</h4><p>"+description+"</p>"+
        "<h4>关键字：</h4><p>"+words+"</p>" +
        "<h4>时间：</h4><p>"+ date+"</p>"
    $('#dialog').on('shown.bs.modal', function () {
        document.getElementById("detail").innerHTML =s;
    })
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
        $('#padding-div').hide();
        $('.sk-three-bounce').hide();
        $('.sk-double-bounce').hide();
        $('#microphone').show();
        console.log("ring finished!");
    });
}
function quickSort_hot(arr, left, right) {
    var i, j, t, pivot;
    if (left >= right) {
        return;
    }
    pivot = arr[left].hot;
    i = left;
    j = right;
    while (i != j) {
        while (arr[j].hot <= pivot && i < j) {
            j--;
        }
        while (arr[i].hot >= pivot && i < j) {
            i++;
        }
        if (i < j) {
            t = arr[i].hot;
            arr[i].hot = arr[j].hot;
            arr[j].hot = t;
        }
    }
    arr[left].hot = arr[j].hot;
    arr[j].hot = pivot;
    quickSort_hot(arr, left, i - 1);
    quickSort_hot(arr, i + 1, right);
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