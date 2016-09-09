/**
 * Created by my dell on 2016/9/8.
 */
$(document).ready(function () {
    hideAll();
    $('#microphone').click(function () {
        $('.sk-three-bounce').fadeIn();
        $('#robot-answer').hide();
        $('#microphone').hide();

        $.get("/act_robot/IatServlet", function (data) {
            $('.sk-three-bounce').show();
            $.get("/act_robot/NavServlet", function (data) {
                if (data == "1") {
                    console.log(data);
                    // $('.sk-double-bounce').show();
                    // $('.sk-three-bounce').hide();
                    // $('.sk-double-bounce').hide();
                    // $('#guide_answer').show();
                    // $('#b1').show();
                    // $('#b2').hide();
                    // getAnswer(data);
                    window.location.href="nav-guide.html";
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
                    getAnswer(data);
                }

            });
        });
    })
        $('#button1').click(function () {
            window.location.href="nav-guide.html";
            // $('.sk-three-bounce').hide();
            // $('.sk-double-bounce').hide();
            // $('#robot-answer').show();
            // $('#guide_answer').show();
            // $('#b2').hide();
            // $('#microphone').hide();

        })
        $('#button2').click(function () {
            window.location.href="nav-guide.html";

        })
        $('#button3').click(function () {
            window.location.href="nav-guide.html";

        })
        $('#button4').click(function () {
            window.location.href="nav-guide.html";

        })
        $('#button5').click(function () {
            window.location.href="nav-guide.html";

        })
        $('#button6').click(function () {
            window.location.href="nav-guide.html";

        })

    });
    function hideAll() {
        $('.sk-three-bounce').hide();
        $('.sk-double-bounce').hide();
        $('#guide_answer').hide();
        $('#robot-answer').hide();
    }

    function getAnswer(question) {
        $.get("http://www.tuling123.com/openapi/api?key=3aa506e60d4a42c2a182b93360799c24&info=" + question, function (data) {
            console.log(data.text);
            $('#robot-answer').text(data.text);
            $('#robot-answer').show();
            $('#guide_answer').fadeIn(2000);
            $('#padding-div').hide();
            $('.sk-three-bounce').hide();
            $('.sk-double-bounce').hide();
            //$('#microphone').show();
        });
    }