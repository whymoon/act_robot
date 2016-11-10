// Initialize your app
var $$ = Dom7;
var myApp = new Framework7(
    {
        onPageInit: function () {
            $$('#submit-btn').click(function () {
                var userId = $$('#id').val().trim();
                var userName = $$('#name').val().trim();
                var userHome = $$('#home').val().trim();
                var userJob = $$('#job').val().trim();
                var userOrg = $$('#org').val().trim();
                var userMajor = $$('#major').val().trim();
                if(userId == "" || userName == "" || userHome == "" || userJob == "" || userMajor == "" || userOrg == ""){
                    alert("必填项目不能为空");
                    return;
                }
                var re = /^[0-9a-zA-Z]*$/g;
                if (!re.test(userId)) {
                    alert("id只能为字母和数字组合");
                    return;
                }
                var front = $$('#photo-front').val().trim();
                // var left = $$('#photo-left').val().trim();
                // var right = $$('#photo-right').val().trim();
                var up = $$('#photo-up').val().trim();
                var down = $$('#photo-down').val().trim();
                if(front == "" || up == "" || down == ""){
                    alert("必填项目不能为空");
                    return;
                }
                $$.post("/act_robot/CheckFaceIdServlet",
                    {
                        userId: userId
                    },
                    function (data) {
                        //console.log("检查人脸ID finished!")
                        if (data == "0") {
                            $$('#user-form').submit();
                        }
                        else {
                            alert("用户id已存在，请尝试其他id");
                        }
                    });
            });
        }
    }
);
