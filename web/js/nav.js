/**
 * Created by my dell on 2016/9/8.
 */
$(document).ready(function () {
    hideAll();
    $('#microphone').click(function () {
        $('.sk-three-bounce').fadeIn();
        $('#robot-answer').hide();
        $('#microphone').hide();

        $.get("/act_robot/IatServlet", function (text) {
            $('.sk-three-bounce').show();
            $.get("/act_robot/NavServlet?text=" + text, function (data) {
                if (data == "1") {
                    console.log(data);
                    window.location.href = "nav-guide.html";
                }
                else {
                    console.log(data);
                    $('.sk-double-bounce').show();
                    $('.sk-three-bounce').hide();
                    $('.sk-double-bounce').hide();
                    $('#microphone').show();
                    $('#guide_answer').show();
                    $('#b1').hide();
                    $('#b2').show();
                }
            });
        });
    });

    $('.destination').click(function () {
        window.location.href = "nav-guide.html";
    });

});
function hideAll() {
    $('.sk-three-bounce').hide();
    $('.sk-double-bounce').hide();
    $('#guide_answer').hide();
    $('#robot-answer').hide();
}
