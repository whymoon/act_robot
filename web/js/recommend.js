/**
 * Created by my dell on 2016/8/21.
 */
$(document).ready(function(){
    hideAll();
    //$('#picture').hide();
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
        //$('#picture').show();
    });
    $('#update').click(function () {
        window.location.reload();
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
        var str="result:"+ data["user_id"];
        $('#name').text(str).show();
        $('#title').show();
        detail(data);
    });
}

function detail(recommend_data){
    $.post("/act_robot/RecommendServlet",
        recommend_data,
        function(data) {
        // console.log(data);
            $('.sk-circle').hide();
            var code = "";
            for(var i = 0;i<data.length;i++){
                code+="<a href=\"#\" class=\"list-group-item\">" + data[i]["content"] + "<a/>";//最好用中括号不用点
            }
            $('#interset').html(code).show();
        });
}