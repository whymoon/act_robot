/**
 * Created by my dell on 2016/8/21.
 */
var jsonArray = new Array();
var NUM_PRINT_DATA = 6;

$(document).ready(function(){
    hideAll();
    $('#webcam').resize(640, 480);
    $('#webcam').photobooth();
    $('#webcam').data("photobooth").resize(640, 480);
    $('#webcam').on("image",function(event, dataUrl){
        $("#picture").append( '<img src="' + dataUrl + '" width="640px" height="480px">');
        var file = dataURLtoBlob(dataUrl);
        uploadImage(file);
    });

    if(!$('#webcam').data('photobooth').isSupported){
        alert('HTML5 webcam is not supported by your browser, please use latest firefox, opera or chrome!');
    }
     $('.photobooth ul').hide();

    $('#take-picture').click(function () {
        $('#webcam').hide();
        $('#take-picture').hide();
        $('#update').show();
        $('.trigger').click();
        $('#title').hide();
        $('#name').show();
        $('.sk-circle').show();
    });
    $('#update').click(function () {
        window.location.reload();
    })
    $('#input_information').click(function () {
        window.location.href="input_face.html";
    })
});

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
        async : false, //取消异步
        url: '/act_robot/FaceIdentifyServlet',
        dataType:"json",
        data: fd,
        processData: false,
        contentType: false
    }).done(function(data) {
        console.log(data);

        var str="识别结果:"+ data["user_name"];
        $('#name').text(str).show();
        $('#title').show();
        alert(data["user_birthplace"] + " " + data["user_job"] + " " + data["user_department"]+ " " + data["user_major"]);
        recommend(data["user_name"],false);
        recommend(data["user_birthplace"],false);
        recommend(data["user_job"],false);
        recommend(data["user_department"],false);
        recommend(data["user_major"],true);
        // interested_content();
    });
}

function recommend(recommend_data,boolean){
    $.post("/act_robot/RingServlet?ring=no&wd="+ recommend_data,
        function(data) {
            for(var i = 0;i<data.content.length;i++)
                window.jsonArray.push(data.content[i]);
            console.log("数组长度"+window.jsonArray.length);
            console.log(data);
            // quickSort_hot(data.content,0,data.content.length-1);
            // $('.sk-circle').hide();
            // code += "<div class='bs-callout bs-callout-primary' style=' margin :0 auto;width: 800px'>";
            // code += "<h4>" + data.content[0].description + "<small>"+data.content[0].hot+"</small></h4>";
            // code += "</div>";
            // if(num == 0)
            //     $('#name_interest').html(code).show();
            // else if(num==1)
            //     $('#birthplace_interest').html(code).show();
            // else if(num==2)
            //     $('#job_interest').html(code).show();
            // else if(num==3)
            //     $('#department_interest').html(code).show();
            // else
            //     $('#major_interest').html(code).show();
            if(boolean == true)
                interested_content();
        });
}
function interested_content() {
    quickSort_hot(window.jsonArray,0,window.jsonArray.length-1);
    var number;
    var code = "",relatedContent = "";
    if(window.jsonArray.length>NUM_PRINT_DATA)
        number = NUM_PRINT_DATA;
    else
        number = window.jsonArray.length;
    console.log("num的值"+number + " "+window.jsonArray.length);
    for(var i = 0;i<number;i++){
        var hotbar = 100;
        if (jsonArray[i].hot < 100)
            hotbar = jsonArray[i].hot;
        if (i % 2 == 0)
            code += "<div style='height: 140px'><div style='float:left;width:49%'>";
        else
            code += "<div style='float:right;width:49%'>";
        code += "<div class='weibo_line'>";
        code += "<div class='event_desc'>";
        code += "<span class='badge badge-warning'>" + (i + 1) + "</span>";
        code += "<a href='#' class='robot-answer-title'>" + window.jsonArray[i].description + "</a><br/></div>";
        var j = i+1;
        relatedContent += j+ ";"+window.jsonArray[i].description + ";";
        code += "<div style='margin-left: 5px; margin-bottom: 3px'>";
        code += "<span class='corewd' style='font-weight: bold'>关键词：</span>";
        code += "<span class = 'robot-answer-corewd'>" + window.jsonArray[i].corewords + "</span><br/>";
        relatedContent += "关键词有："+ window.jsonArray[i].corewords + ";";
        if (window.jsonArray[i].participant != "") {
            code += "<span style='font-weight: bold'>参与者：</span>";
            code += "<span class='robot-answer-participant'>" + window.jsonArray[i].participant + "</span><br/>";
            relatedContent += "参与者有："+ window.jsonArray[i].participant + ";";
        }
        if (window.jsonArray[i].eventLoc != "其他") {
            code += "<span style='font-weight: bold'>地点：</span>";
            code += "<span class='robot-answer-loc'>" + window.jsonArray[i].eventLoc + "</span><br/>";
            relatedContent += "地点："+ window.jsonArray[i].eventLoc + ";";
        }
        code += "<span style='float: left; font-weight: bold'>热度：</span>";
        code += "<div class='progress' style='float: left; margin-top: 5px; margin-bottom: 0; height: 10px; width: 150px;'>";
        code += "<div class='progress-bar progress-bar-danger' style='width:" + hotbar + "%' aria-valuenow='" + hotbar + "' aria-valuemin='0' aria-valuemax='100'>";
        code += "<div class='bar'></div></div></div>";
        code += "<span style='margin: 0 0 0 0; font-size: 15px; color: #eb192d;'>&nbsp;" + window.jsonArray[i].hot + "</span></div></div>";
        relatedContent += "今日热度为："+ window.jsonArray[i].hot + ";";
        if(i%2==0)
            code +="</div>";
        else
            code +="</div></div>";
    }
    $('.sk-circle').hide();
    $('#interest').html(code).show();
    speakText(relatedContent);
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