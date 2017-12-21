$(document).ready(function () {
    var canvas = document.getElementById("map-canvas");
    var context = canvas.getContext('2d');
    var resolution = 1.0, height = 1000, width = 1000, hscale = 1.0, wscale = 1.0;
    var goals = {};
    var lastOutlier = -1;

    $.get("/act_robot/InspectorServlet?type=map", function (mapData) {
        canvas.style.background = "url('" + mapData["path"] + "')";
        canvas.style.backgroundSize = "cover";
        resolution = parseFloat(mapData["resolution"]);
        height = parseFloat(mapData["height"]);
        width = parseFloat(mapData["width"]);
        hscale = 850.0 / height;
        wscale = 850.0 / width;
        $.get("/act_robot/InspectorServlet?type=goal", function (goalData) {
            context.font = "25px Courier New";
            context.fillStyle = "blue";
            var lastX = -1, lastY = -1;
            var offset = 0;
            for (var i = 0; i < goalData.length; i++){
                if(goalData[i].x != lastX && goalData[i].y != lastY){
                    context.fillText(String.fromCharCode(65+offset), goalData[i].x * wscale, goalData[i].y * hscale);
                    offset++;
                }
                goals[goalData[i].x + ":" + goalData[i].y] = String.fromCharCode(65+offset);
                // goals.push({"pos": goalData[i], "tag": String.fromCharCode(65+offset)});
                lastX = goalData[i].x;
                lastY = goalData[i].y
            }
            console.log(goals);
            console.log(goals["448:711"]);
            var checkPoint = context.getImageData(0,  0,  canvas.width,  canvas.height);
            setInterval(function () {
                $.get("/act_robot/InspectorServlet?type=pos", function (posData) {
                    // context.clearRect(0, 0, canvas.width, canvas.height);
                    context.putImageData(checkPoint, 0, 0);
                    context.beginPath();
                    context.arc(parseFloat(posData["x"]) / resolution * wscale,
                        (height - (parseFloat(posData["y"]) / resolution)) * hscale,
                        6, 0, Math.PI * 2, true
                    );
                    context.closePath();
                    context.fillStyle = "rgba(0,0,0,1)";
                    context.fill();
                });
            }, 1000);
            setInterval(function () {
                $.get("/act_robot/AnomalyServlet?lastId=" + lastOutlier, function (data) {
                    var maxId = lastOutlier;
                    for (var i = 0; i < data.length; i++){
                        var pos = parseInt(data[i].loc_x) + ":" + parseInt(data[i].loc_y);
                        console.log(pos);
                        $("#warning tbody").append("<tr><td>" + data[i].obj + "</td><td>"
                            + goals[pos] + "</td><td>" + data[i].outlier_type.split(" ")[1] + "</td></tr>");
                        // $("#warning ul").append("<li>" + data[i].obj + " at " + goals[pos] + ": " + data[i].outlier_type + "</li>");
                        $('#warning').scrollTop($('#warning')[0].scrollHeight);
                        maxId = Math.max(maxId, data[i].id);
                    }
                    lastOutlier = maxId;
                });
            }, 5000);
        });



    });
});
