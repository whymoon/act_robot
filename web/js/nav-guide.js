/**
 * Created by my dell on 2016/9/8.
 */
$(document).ready(function () {
    speakText("");
    $('#guide_back').hide();
    $('#guide_finish').hide();
    // setInterval(function(){
    //     $.get("/act_robot/StateServlet?type=isNavFinished",function (data) {
    //         if(data == true)
    //             finish();
    //     });
    // },1000);//时间以毫秒算
    $('#return').click(function () {
        window.location.href="nav.html";
    });
    $('#back').click(function () {
        $('#guide_answer').hide();
        $('#guide_back').show();
        $('#guide_finish').hide();
        speakText("正在返航");
        $.get("/act_robot/NavServlet?text=back&des=empty", function (data) {

        });

        setTimeout(back,5000);
    });
});
function finish() {
    $('#guide_answer').hide();
    $('#guide_finish').show();
    speakText("已经到达目的地，请选择返航或继续导航");

    $('#continue').click(function () {
        window.location.href="nav.html";
    });
}
function back() {
    speakText("返航成功，have a good day!");
    window.location.href="nav.html";
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