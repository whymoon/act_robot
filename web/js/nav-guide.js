/**
 * Created by my dell on 2016/9/8.
 */
$(document).ready(function () {
    speakText("");
    $('#return').click(function () {
        window.location.href="nav.html";
    })
});
function speakText(contentText) {
    $.post("/act_robot/TtsServlet",
        {
            text: contentText
        },
        function(data){
            console.log(data);
        });
}