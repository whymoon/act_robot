$(document).ready(function () {
    var canvas = document.getElementById("map-canvas");
    var context = canvas.getContext('2d');
    var resolution = 1.0, height = 1000, width = 1000, hscale = 1.0, wscale = 1.0;
    var goals = {};
    var lastOutlier = -1, lastObj = -1;

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
                    goals[goalData[i].x + ":" + goalData[i].y] = String.fromCharCode(65+offset);
                    offset++;
                }
                // goals.push({"pos": goalData[i], "tag": String.fromCharCode(65+offset)});
                lastX = goalData[i].x;
                lastY = goalData[i].y
            }
            var code = "";
            for (var key in goals){
                code += "<tr><td>" + goals[key] + "</td><td id='goal-content-" + goals[key] + "'></td><td id='goal-time-" + goals[key] + "'></td></tr>"
            }
            $("#objs tbody").html(code);
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
                $.get("/act_robot/InspectorServlet?type=obj&lastId=" + lastObj, function (objData) {
                    var maxId = lastObj;
                    for (var i = 0; i < objData.length; i++){
                        var pos = parseInt(objData[i].loc_x) + ":" + parseInt(objData[i].loc_y);
                        if(goals.hasOwnProperty(pos)){
                            $("#goal-content-" + goals[pos]).text(objData[i].objs);
                            $("#goal-time-" + goals[pos]).text(objData[i].time);
                        }

                        maxId = Math.max(maxId, objData[i].id);
                    }
                    lastObj = maxId;
                });
            }, 5000);
            setInterval(function () {
                $.get("/act_robot/AnomalyServlet?lastId=" + lastOutlier, function (data) {
                    var maxId = lastOutlier;
                    for (var i = 0; i < data.length; i++){
                        var pos = parseInt(data[i].loc_x) + ":" + parseInt(data[i].loc_y);
                        $("#warning tbody").append("<tr><td>" + data[i].obj + "</td><td>"
                            + goals[pos] + "</td><td>" + data[i].outlier_type.split(" ")[1] + "</td></tr>");
                        $('#warning').scrollTop($('#warning')[0].scrollHeight);
                        maxId = Math.max(maxId, data[i].id);
                    }
                    lastOutlier = maxId;
                });
            }, 5000);
        });



    });
});
