/**
 * Created by whymo on 2016/8/2.
 */
$(document).ready(function(){
    $('.sk-circle').hide();
    $('#webcam').resize(640, 480);
    $('#webcam').photobooth();
    $('#webcam').data("photobooth").resize(640, 480);
    $('#webcam').on("image",function(event, dataUrl){
        $("#picture").append( '<img src="' + dataUrl + '" width="128px" height="96px">');
        var file = dataURLtoBlob(dataUrl);
        uploadImage(file);
    });

    if(!$('#webcam').data('photobooth').isSupported){
        alert('HTML5 webcam is not supported by your browser, please use latest firefox, opera or chrome!');
    }
});

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
        alert(data);
    });
}



