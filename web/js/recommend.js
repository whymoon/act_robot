/**
 * Created by my dell on 2016/8/21.
 */
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
        $('#update').show();
        $('.trigger').click();
        $('#webcam').hide();
        $('#title').hide();
        $('#take-picture').hide();
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
    $('#interset').hide();
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
        dataType:"json",
        data: fd,
        processData: false,
        contentType: false
    }).done(function(data) {
        console.log(data);
        var str="识别结果:"+ data["user_name"];
        $('#name').text(str).show();
        $('#title').show();
        recommend(data["user_name"]);
        recommend(data["user_birthplace"]);
        recommend(data["user_job"]);
        recommend(data["user_department"]);
        recommend(data["user_major"]);
        alert(data["user_birthplace"] + " " + data["user_job"] + " " + data["user_department"]+ " " + data["user_major"]);
    });
}

function recommend(recommend_data){
    var code="";
    $.post("/act_robot/RingServlet?ring=no&wd=", recommend_data,
        function(data) {
            console.log(data);
            quickSort_hot(data.content,0,data.content.length-1);
            $('.sk-circle').hide();
            code += "<div class='bs-callout bs-callout-primary' style=' margin :0 auto;width: 800px'>";
            code += "<h4>" + data.content[0].description + "<small>"+data.content[0].hot+"</small></h4>";
            code += "</div>";
            for(var i = 0;i<5;i++){
                if(i == 0)
                    $('#name_interest').html(code).show();
                else if(i==1)
                    $('#birthplace_interest').html(code).show();
                else if(i==2)
                    $('#job_interest').html(code).show();
                else if(i==3)
                    $('#department_interest').html(code).show();
                else
                    $('#major_interest').html(code).show();
            }
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