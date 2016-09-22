/**
 * Created by songxinxin on 2016/9/21.
 */
    function setProcess(){
        var processbar = document.getElementById("processbar");
        // processbar.style.width = parseInt(processbar.style.width) - 1 + "%";//递减的
        processbar.style.width = parseInt(Math.random()*100+1) + "%";//随机数
        processbar.innerHTML = processbar.style.width;
        if(processbar.style.width == "0%"){
            window.clearInterval(bartimer);
        }
    }
    var bartimer = window.setInterval(function(){setProcess();},1000);
    window.onload = function(){
        bartimer;
    };