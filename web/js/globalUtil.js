/**
 * Created by whymo on 2016/11/6.
 */
var JUMP_CHECK_INTERVAL = 1000;
var JUMP_MAX_COUNT = 300;
var BATTERY_CHECK_INTERVAL = 5000;
var count = 0;
var autoJumpDes = "index.html";

$(document).ready(function () {
    speakText("");
    var currentUrl = window.location.href.split('/');
    var currentPage = currentUrl[currentUrl.length - 1];
    if (currentPage == "index.html") {
        autoJumpDes = "screenSaver.html";
        $("body").click(function (e) {
            if ($(e.target).attr("class") != "trigger")
                count = 0;
        });
    }
    else {
        $("body").click(function (e) {
            count = 0;
        });
    }

    setInterval(function () {
        count++;
        if (count >= JUMP_MAX_COUNT)
            window.location.href = autoJumpDes;
    }, JUMP_CHECK_INTERVAL);

    setInterval(function () {
        $.get("/act_robot/StateServlet?type=battery", function (data) {
            if (currentPage == "index.html")
                setBattery(data);
            if (data <= 5) {
                lowBattery();
            }
        });
    }, BATTERY_CHECK_INTERVAL);

    $('.quiet').click(function () {
        speakText("");
    });
});

function setBattery(n) {
    console.log(n);
    $('#charge').width(n + "%");
    $('#charge').text(n + "%");
}

function lowBattery() {
    speakText("电池电量低，请尽快充电！");
    var r = confirm("电池电量低，请尽快充电！");
    if (r == true) {
        window.location.href = "charging.html";
        return true;
    }
    else {
        return false;
    }
}

function speakText(contentText) {
    $.post("/act_robot/TtsServlet",
        {
            text: contentText
        },
        function (data) {
        }
    );
}

function dataURLtoBlob(dataUrl) {
    // Decode the dataURL
    var binary = atob(dataUrl.split(',')[1]);

    // Create 8-bit unsigned array
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }

    // Return our Blob object
    return new Blob([new Uint8Array(array)], {
        type: 'image/png'
    });
}

function quickSort_hot(arr, left, right) {
    var i, j, t, pivot;
    if (left >= right) {
        return;
    }
    pivot = arr[left].hot;
    i = left;
    j = right;
    while (i != j) {
        while (arr[j].hot <= pivot && i < j) {
            j--;
        }
        while (arr[i].hot >= pivot && i < j) {
            i++;
        }
        if (i < j) {
            t = arr[i].hot;
            arr[i].hot = arr[j].hot;
            arr[j].hot = t;
        }
    }
    arr[left].hot = arr[j].hot;
    arr[j].hot = pivot;
    quickSort_hot(arr, left, i - 1);
    quickSort_hot(arr, i + 1, right);
}