$(document).ready(function(){
    var canvas = document.getElementById("map-canvas");
    var context = canvas.getContext('2d');
    var resolution = 1.0, height = 1000, width = 1000, scale = 1.0;

    $.get("/act_robot/InspectorServlet?type=map",function (data) {
        canvas.style.background = "url('" + data["path"] + "')";
        canvas.style.backgroundSize = "cover";
        resolution = parseFloat(data["resolution"]);
        height = parseFloat(data["height"]);
        width = parseFloat(data["width"]);
        scale = 870.0 / height;
    });
    setInterval(function(){
        $.get("/act_robot/InspectorServlet?type=pos",function (data) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.save();
            context.beginPath();
            console.log(parseFloat(data["x"]) / resolution * scale);
            context.arc(parseFloat(data["x"]) / resolution * scale,
                (height - (parseFloat(data["y"]) / resolution)) * scale,
                6, 0, Math.PI * 2, true
            );
            context.closePath();
            context.fillStyle = "rgba(0,0,0,1)";
            context.fill();
        });
    },1000);
});
