/**
 * Created by my dell on 2016/8/21.
 */
var NUM_PRINT_DATA = 6;
$(document).ready(function () {
    hideAll();
    $('#webcam').resize(640, 480);
    $('#webcam').photobooth();
    $('#webcam').data("photobooth").resize(640, 480);
    $('#webcam').on("image", function (event, dataUrl) {
        $("#picture").append('<img src="' + dataUrl + '" width="160px" height="120px">');

        var file = dataURLtoBlob(dataUrl);
        uploadImage(file);
    });

    if (!$('#webcam').data('photobooth').isSupported) {
        alert('HTML5 webcam is not supported by your browser, please use latest firefox, opera or chrome!');
    }
    $('.photobooth ul').hide();

    $('#take-picture').click(function () {
        speakText("");
        $('.trigger').click();
        $('#title').hide();
        $('#name').show();
        $('.sk-circle').show();
    });
    $('#update').click(function () {
        window.location.reload();
    });
    speakText($('#header-title').text());
});
function hideAll() {
    $('.sk-circle').hide();
    $('#title').hide();
    $('#interest').hide();
    $('#divide').hide();
    $('#name').hide();
    $('#update').hide();
    $('#picture').hide();
    $('#header-div').hide();
}

function uploadImage(file) {
    var fd = new FormData();
    fd.append('photo', file);
    $.ajax({
        type: 'POST',
        url: '/act_robot/FaceIdentifyServlet',
        dataType: "json",
        data: fd,
        processData: false,
        contentType: false
    }).done(function (data) {
        console.log(data);
        $('#webcam').hide();
        $('#take-picture').hide();
        $('#update').show();
        $('#picture').show();
        $('#header-div').show();
        var str = "识别结果:" + data["user_speak_name"];
        $('#name').text(str).show();
        $('#title').show();
        // alert(data["user_birthplace"] + " " + data["user_job"] + " " + data["user_department"]+ " " + data["user_major"]);
        var keys = new Array();
        keys.push(data["user_name"]);
        keys.push(data["user_birthplace"]);
        keys.push(data["user_job"]);
        keys.push(data["user_department"]);
        keys.push(data["user_major"]);
        recommend(keys, data["user_speak_name"]);
    });
}

function recommend(keys, userName) {
    $.post("/act_robot/RecommendServlet",
        {
            keys: JSON.stringify(keys)
        },
        function (data) {
            var interestData = new Array();
            for (var i = 0; i < data.length; i++) {
                if (data[i].content.length == 0)
                    continue;
                if (data[i].content.length == 1) {
                    interestData.push(data[i].content[0])
                    continue;
                }
                quickSort_hot(data[i].content, 0, data[i].content.length - 1);
                for (var j = 0; j < 2; j++) {
                    interestData.push(data[i].content[j]);
                }
            }
            interested_content(interestData, userName);
        });
}
function interested_content(interestData, userName) {
    quickSort_hot(interestData, 0, interestData.length - 1);
    console.log(interestData);
    var code = "", relatedContent = "您好，" + userName + ", 以下可能是您感兴趣的内容:";
    var number = NUM_PRINT_DATA;
    if(number > interestData.length)
        number = interestData.length;
    for (var i = 0; i < number; i++) {
        var hotbar = 100;
        if (interestData[i].hot < 100)
            hotbar = interestData[i].hot;
        if (i % 2 == 0)
            code += "<div style='height: 140px'><div style='float:left;width:49%'>";
        else
            code += "<div style='float:right;width:49%'>";
        code += "<div class='weibo_line'>";
        code += "<div class='event_desc'>";
        code += "<span class='badge badge-warning'>" + (i + 1) + "</span>";
        code += "&nbsp;&nbsp;<a href='#' class='robot-answer-title'>" + interestData[i].description + "</a><br/></div>";
        var j = i + 1;
        relatedContent += j + ";" + interestData[i].description + ";";
        code += "<div style='margin-left: 5px; margin-bottom: 3px'>";
        code += "<span class='corewd' style='font-weight: bold'>关键词：</span>";
        code += "<span class = 'robot-answer-corewd'>" + interestData[i].corewords + "</span><br/>";
        // relatedContent += "关键词有："+ interestData[i].corewords + ";";
        if (interestData[i].participant != "") {
            code += "<span style='font-weight: bold'>参与者：</span>";
            code += "<span class='robot-answer-participant'>" + interestData[i].participant + "</span><br/>";
            relatedContent += "参与者有：" + interestData[i].participant + ";";
        }
        if (interestData[i].eventLoc != "其他") {
            code += "<span style='font-weight: bold'>地点：</span>";
            code += "<span class='robot-answer-loc'>" + interestData[i].eventLoc + "</span><br/>";
            relatedContent += "地点：" + interestData[i].eventLoc + ";";
        }
        code += "<span style='float: left; font-weight: bold'>热度：</span>";
        code += "<div class='progress' style='float: left; margin-top: 5px; margin-bottom: 0; height: 10px; width: 150px;'>";
        code += "<div class='progress-bar progress-bar-danger' style='width:" + hotbar + "%' aria-valuenow='" + hotbar + "' aria-valuemin='0' aria-valuemax='100'>";
        code += "<div class='bar'></div></div></div>";
        code += "<span style='margin: 0 0 0 0; font-size: 15px; color: #eb192d;'>&nbsp;" + interestData[i].hot + "</span></div></div>";
        relatedContent += "今日热度为：" + interestData[i].hot + ";";
        if (i % 2 == 0)
            code += "</div>";
        else
            code += "</div></div>";
    }
    $('.sk-circle').hide();
    $('#interest').html(code).show();
    $('#divide').show();
    speakText(relatedContent);
}
