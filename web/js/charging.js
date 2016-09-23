/**
 * Created by my dell on 2016/9/22.
 */
window.onload = function(){
    var canvas = document.getElementById('canvas'),  //获取canvas元素
        context = canvas.getContext('2d'),  //获取画图环境，指明为2d,二维
        centerX = canvas.width/2,   //Canvas中心点x轴坐标
        centerY = canvas.height/2,  //Canvas中心点y轴坐标
        rad = Math.PI*2/100, //将360度分成100份，那么每一份就是rad度
        speed = 0.1; //加载的快慢就靠它了
    //绘制蓝色外圈
    function blueCircle(n){
        context.save();//save 保存画布状态
        context.strokeStyle = "#13FF0E"; //设置描边样式
        context.lineWidth = 15; //设置线宽
        context.beginPath(); //路径开始
        context.arc(centerX, centerY, 100 , -Math.PI/2, -Math.PI/2 +n*rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
        context.stroke(); //绘制
        context.closePath(); //路径结束
        context.restore();
    }
    //绘制白色外圈
    function whiteCircle(){
        context.save();
        context.beginPath();
        context.strokeStyle = "white";
        context.lineWidth = 15; //设置线宽
        context.arc(centerX, centerY, 100 , 0, Math.PI*2, false);
        context.stroke();
        context.closePath();
        context.restore();
    }
    //百分比文字绘制
    function text(n){
        context.save(); //save和restore可以保证样式属性只运用于该段canvas元素
        context.strokeStyle = "#fff"; //设置描边样式
        context.font = "40px Arial"; //设置字体大小和字体
        //绘制字体，并且指定位置
        if(n < 10)
            context.strokeText(n.toFixed(0)+"%", centerX-25, centerY+10);
        else if(n < 100)
            context.strokeText(n.toFixed(0)+"%", centerX-35, centerY+10);
        else
            context.strokeText(n.toFixed(0)+"%", centerX-50, centerY+10);
        context.stroke(); //执行绘制
        context.restore();
    }
    setInterval(function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        whiteCircle();
        $.post("/act_robot/ChargingServlet",function (data) {
                    text(parseInt(data));
                    blueCircle(parseInt(data));
                });
    },1000);//时间以毫秒算
};