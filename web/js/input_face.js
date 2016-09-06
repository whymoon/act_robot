$(document).ready(function(){
    var files = new Array();
    var fileIndex = 0;
    $('.sk-circle').hide();
	$('#webcam').resize(640, 480);
	$('#webcam').photobooth();
	$('#webcam').data("photobooth").resize(640, 480);
	$('#webcam').on("image",function(event, dataUrl){		
		$("#picture").append( '<img src="' + dataUrl + '" width="128px" height="96px">');
		var file = dataURLtoBlob(dataUrl);
        files[fileIndex] = file;
        fileIndex++;
	});

	if(!$('#webcam').data('photobooth').isSupported){
		alert('HTML5 webcam is not supported by your browser, please use latest firefox, opera or chrome!');
    }
    $('.photobooth ul').hide();

	$('#take-picture').click(function () {
		$('.trigger').click();
	});
    
    $('#upload').click(function () {
        if(files.length != 5){
            alert("请拍摄五张照片！");
            return;
        }
        var userId = $('#input-id').val();
        var userName = $('#input-name').val();
        var userBirthplace = $('#input-birthplace').val();
        var userJob = $('#input-job').val();
        var userDepartment = $('#input-department').val();
        var userMajor = $('#input-major').val();
        if(userId.trim() == "" || userName.trim() == ""||
            userBirthplace.trim()==""||userJob.trim()==""||
            userDepartment.trim() == "" || userMajor.trim() == ""){
            alert("请填写完整信息！");
            return;
        }

        $.post("/act_robot/CheckFaceIdServlet",
            {
                userId: userId

            },
            function (data) {
                //console.log("检查人脸ID finished!")
                if(data == "0"){
                    $('.sk-circle').show();
                    uploadImage(files);
                }
                else{
                    alert("用户id已存在，请尝试其他id");
                }
            });
    });
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
    for(var i = 0; i < file.length; i++){
        fd.append('photo' + i, file[i]);
    }
    var userId = $('#input-id').val();
    var userName = $('#input-name').val();
    var userBirthplace = $('#input-birthplace').val();
    var userJob = $('#input-job').val();
    var userDepartment = $('#input-department').val();
    var userMajor = $('#input-major').val();
    fd.append('userId', userId);
    fd.append('userName', encodeURI(userName));
    fd.append('userBirthplace',encodeURI(userBirthplace));
    fd.append('userJob',encodeURI(userJob));
    fd.append('userDepartment',encodeURI(userDepartment));
    fd.append('userMajor',encodeURI(userMajor));

	$.ajax({
	    type: 'POST',
	    url: '/act_robot/InputFaceServlet',
	    data: fd,
	    processData: false,
	    contentType: false
	}).done(function(data) {
	    alert("上传成功！");
        window.location.reload();
	});
}


