/**
 * Created by my dell on 2016/9/8.
 */
$(document).ready(function () {
    speakText("");
    $('#guide_back').hide();
    $('#guide_finish').hide();
    var isFinished = false;
    setInterval(function(){
        $.get("/act_robot/StateServlet?type=isNavFinished",function (data) {
            if(!isFinished && data == "true"){
                isFinished = true;
                finish();
            }

        });
    },1000);//时间以毫秒算
    $('#return').click(function () {
        window.location.href="nav.html";
    });

});
function finish() {
    $('#guide_answer').hide();
    $('#guide_finish').show();
    speakText("已经到达目的地，请选择返航或继续导航");

    $('#continue').click(function () {
        window.location.href="nav.html";
    });


    $('#back').click(function () {
        $('#guide_answer').hide();
        $('#guide_back').show();
        $('#guide_finish').hide();
        speakText("正在返航");
        var isBack = false;
        $.get("/act_robot/NavServlet?text=back&des=back", function (data) {
            setInterval(function(){
                $.get("/act_robot/StateServlet?type=isNavFinished",function (data) {
                    if(!isBack && data == "true"){
                        isBack = true;
                        back();
                    }

                });
            },1000);//时间以毫秒算
        });

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