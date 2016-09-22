/**
 * Created by songxinxin on 2016/9/21.
 */
    function setProcess(n){
        var processbar = document.getElementById("processbar");
        processbar.style.width = n + "%";
        processbar.innerHTML =n + "%";
    }
    setInterval(function(){
        $.post("/act_robot/ChargingServlet",function (data) {
            setProcess(parseInt(data));
        });
    },1000);