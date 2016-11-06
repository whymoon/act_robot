/**
 * Created by my dell on 2016/8/21.
 */
var i = 0;
var t = self.setInterval('count()',1000);
$(document).ready(function () {
    speakText("");
    hideAll();
    $('#webcam').resize(640, 480);
    $('#webcam').photobooth();
    $('#webcam').data("photobooth").resize(640, 480);
    $('#webcam').on("image", function (event, dataUrl) {
        $("#picture").append('<img src="' + dataUrl + '" width="414px" height="310px">');
        var file = dataURLtoBlob(dataUrl);
        uploadImage(file);
    });

    if (!$('#webcam').data('photobooth').isSupported) {
        alert('HTML5 webcam is not supported by your browser, please use latest firefox, opera or chrome!');
    }
    $('.photobooth ul').hide();

    $('#take-picture').click(function () {
        speakText("");
        $('#webcam').hide();
        $('#take-picture').hide();
        $('#update').show();
        $('.trigger').click();

        document.getElementById("change").innerHTML =
            "<button type='button' class='btn btn-primary btn-lg' id='take-picture'>拍摄</button>";
        document.getElementById("change").innerHTML =
            "<button type='button' class='btn btn-danger btn-lg' id='input_information' style='float: left'>录入信息</button>";
        $('#title').hide();
        $('#name').show();
        $('.sk-circle').show();
    });
    $('#update').click(function () {
        window.location.reload();
    })
    $('#input_information').click(function () {
        speakText("");
        window.location.href = "input_face.html";
    })
    speakText($('#header-title').text());
    $("body").click(function () {
        i = 0;
    })
});
function count(){
    i++;
    if(i>=300)
        window.location.href='index.html';
}
function voice() {
    speakText("");
}
function hideAll() {
    $('.sk-circle').hide();
    $('#title').hide();
    $('#interest').hide();
    $('#name').hide();
    $('#update').hide();
}

function dataURLtoBlob(dataUrl) {
    // Decode the dataURL
    var binary = atob(dataUrl.split(',')[1]);

    // Create 8-bit unsigned array
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }

    // Return our Blob object
    return new Blob([new Uint8Array(array)], {
        type: 'image/png'
    });
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
        var str = "识别结果:" + data["user_name"];
        $('#name').text(str).show();
        $('#title').show();
        // alert(data["user_birthplace"] + " " + data["user_job"] + " " + data["user_department"]+ " " + data["user_major"]);
        var keys = new Array();
        keys.push(data["user_name"]);
        keys.push(data["user_birthplace"]);
        keys.push(data["user_job"]);
        keys.push(data["user_department"]);
        keys.push(data["user_major"]);
        recommend(keys, data["user_name"]);
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
    for (var i = 0; i < interestData.length; i++) {
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
    speakText(relatedContent);
}

function speakText(contentText) {
    $.post("/act_robot/TtsServlet",
        {
            text: contentText
        },
        function (data) {
            console.log(data);
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