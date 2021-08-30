let forwardTimes = []
let withBoxes = true

function sendData(data, t) {
    return new Promise(function (resolve, reject) {
       //let xhr = new XMLHttpRequest();
       //xhr.open("POST", "http://127.0.0.1:5000", true);
       //xhr.setRequestHeader("Content-Type", "application/json");
       //xhr.send(JSON.stringify(data));
        calculateNums((data), t)
        resolve(null);
    });
}
var assdf = false
var dispDiv

var dispData = [
    ["name", "data"],
    ["name", "data"],
    ["name", "data"],
    ["name", "data"],
    ["name", "data"],
]
var position = [0, 0, 0]
var rot_histories = [[0], [0], [0]]
var pos_histories = [[0], [0], [0]]
var pos_change = [0,0,0]
var px = 0
var py = 0
var pz = 0
var prev_avg_pos = [px, py, pz]
var AVERAGE_DISTANCE = 100
var X_ROT_SCALE = 3
var RESTING_MOUTH_WIDTH = 0.67
function calculateNums(d, timeInMs) {
    if (assdf == false) {
        dispData = []
        dispDiv.innerHTML = ""

        forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30)
        const avgTimeInMs = forwardTimes.reduce((total, t) => total + t) / forwardTimes.length
        
        //$('#time').val(`${Math.round(avgTimeInMs)} ms`)
        //$('#fps').val(`${faceapi.utils.round(1000 / avgTimeInMs)}`)
        dispData.push(["Time", Math.round(avgTimeInMs)])
        dispData.push(["Fps", faceapi.utils.round(1000 / avgTimeInMs)])
        dispData.push(["Score_Thresh", `${document.getElementById('scoreThreshold').value} <a style="color: red;" onclick="onDecreaseScoreThreshold()">-</a> <a style="color: green;" onclick="onIncreaseScoreThreshold()">+</a>`])
        
        points = (d["landmarks"]["_positions"])
        prev_avg_pos = [px, py, pz]
        px = sum(pos_histories[0]) / len(pos_histories[0])
        py = sum(pos_histories[1]) / len(pos_histories[1])
        pz = sum(pos_histories[2]) / len(pos_histories[2])
        var chin = points.slice(0, 17)
        var left_eyebrow = points.slice(17, 22)
        var right_eyebrow = points.slice(22, 27)
        var nose = points.slice(27, 36)
        var left_eye = points.slice(36, 42)
        var right_eye = points.slice(42, 48)
        var mouth = points.slice(48)
        //dispData.push(["Right_Eye", right_eye.join(" ")])
        //dispData.push(["Left_Eye", left_eye.join(" ")])
        var eye_dis = Math.sqrt(Math.pow(right_eye[2]["_y"] - left_eye[1]["_y"], 2) + Math.pow((right_eye[2]["_x"] - left_eye[1]["_x"]), 2))
        var rot_z = Math.atan2((right_eye[2]["_y"] - left_eye[1]["_y"]), (right_eye[2]["_x"] - left_eye[1]["_x"]))
        var left_eyebrow_length = Math.sqrt(Math.pow(left_eyebrow[left_eyebrow.length-1]["_x"] - left_eyebrow[0]["_x"], 2) + Math.pow(left_eyebrow[left_eyebrow.length-1]["_y"] - left_eyebrow[0]["_y"], 2)) / eye_dis
        var right_eyebrow_length = Math.sqrt(Math.pow(right_eyebrow[right_eyebrow.length-1]["_x"] - right_eyebrow[0]["_x"], 2) + Math.pow(right_eyebrow[right_eyebrow.length-1]["_y"] - right_eyebrow[0]["_y"], 2)) / eye_dis
        var eyebrow_implications = left_eyebrow_length - right_eyebrow_length
        var rot_y = rad(eyebrow_implications * 90) * .85
        var nose_length = nose[6]["_y"] - nose[3]["_y"]
        prev_pos = position
        position = [nose[6]["_x"] / d['detection']['_imageDims']['_width'] - .5, nose[6]["_y"] / d['detection']['_imageDims']['_height'] - .5, eye_dis / AVERAGE_DISTANCE]
        pos_change = [px - prev_avg_pos[0], py - prev_avg_pos[1], pz - prev_avg_pos[2]]
        //var pos_change = 
        var rot_x = rad(deg((-Math.atan2(nose_length / eye_dis, 0.05) + rad(66))) * X_ROT_SCALE) + abs(rot_y) * py
        var mouth_height = Math.sqrt(Math.pow(mouth[14]["_x"] - mouth[18]["_x"], 2) + Math.pow(mouth[14]["_y"] - mouth[18]["_y"], 2)) / eye_dis
        var mouth_width = Math.sqrt(Math.pow(mouth[0]["_x"] - mouth[6]["_x"], 2) + Math.pow(mouth[0]["_y"] - mouth[6]["_y"], 2)) / eye_dis - RESTING_MOUTH_WIDTH
        
        //var rot_enum = [0, 0, 0]
        for (const [i, rot] of [-rot_x, -rot_y, rot_z].entries()) {
            //rot_enum[index] = rot
            rot_histories[i].push(rot)
            rot_histories[i] = rot_histories[i].slice(rot_histories.length - 20)
        }
        for (const [i, pos] of position.entries()) {
            //rot_enum[index] = rot
            pos_histories[i].push(position[i])
            pos_histories[i] = pos_histories[i].slice(pos_histories.length - 10)
        }
        dispData.push(["Eye_Dis", eye_dis.toFixed(2)])
        dispData.push(["Left_Brow_lngth", (left_eyebrow_length.toFixed(2))])
        dispData.push(["Right_Brow_lngth", (right_eyebrow_length.toFixed(2))])
        dispData.push(["Brow_Implications", (eyebrow_implications.toFixed(2))])
        dispData.push(["Mouth_Height", (mouth_height.toFixed(2))])
        dispData.push(["Mouth_Width", (mouth_width.toFixed(2))])
        dispData.push(["Position", (position.join(" "))])
        //dispData.push(["Rot_Enum", (rot_enum.join(" "))])
        dispData.push(["Rot_Z", deg(rot_z).toFixed(2)])
        dispData.push(["Rot_Y", deg(rot_y).toFixed(2)])
        dispData.push(["Rot_X", deg(rot_x).toFixed(2)])
        parseDisp()
        //assdf = true

    }
}
function deg(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}

function rad(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function sum(a) {
    let fin = 0
    for (let i = 0; i < a.length; i++) {
        const num = a[i];
        fin += num
    }
    return fin
}

function len(a) {
    return a.length
}

function abs(n) {
    return Math.abs(n)
}

function parseDisp () {
    for (let i = 0; i < dispData.length; i++) {
        const key = dispData[i];
        //console.log(key)
        dispDiv.innerHTML += "<p class='head'>" + key[0] + "</p>" + "<p class='cont'>" + key[1] + "</p>" + "<br>"
    }
}

function onChangeHideBoundingBoxes(e) {
    withBoxes = !$(e.target).prop('checked')
}

function updateTimeStats(timeInMs) {
    forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30)
    const avgTimeInMs = forwardTimes.reduce((total, t) => total + t) / forwardTimes.length
    $('#time').val(`${Math.round(avgTimeInMs)} ms`)
    $('#fps').val(`${faceapi.utils.round(1000 / avgTimeInMs)}`)
    dispData.push(["Time", Math.round(avgTimeInMs)])
    dispData.push(["Fps", faceapi.utils.round(1000 / avgTimeInMs)])
    //parseDisp()
}

async function onPlay() {
    const videoEl = $('#inputVideo').get(0)

    if (videoEl.paused || videoEl.ended || !isFaceDetectionModelLoaded())
        return setTimeout(() => onPlay())


    const options = getFaceDetectorOptions()

    const ts = Date.now()

    const result = await faceapi.detectSingleFace(videoEl, options)
        .withFaceLandmarks()
        .withFaceExpressions()

    let tm = (Date.now() - ts)

    if (result) {
        await sendData(result, tm);
        const canvas = $('#overlay').get(0)
        const dims = faceapi.matchDimensions(canvas, videoEl, true)
        const resizedResult = faceapi.resizeResults(result, dims)

        if (withBoxes) {
            faceapi.draw.drawDetections(canvas, resizedResult)
        }
        faceapi.draw.drawFaceLandmarks(canvas, resizedResult)
    }

    setTimeout(() => onPlay())
}

async function run() {
    // load face detection and face landmark models
    await changeFaceDetector(TINY_FACE_DETECTOR)
    await faceapi.loadFaceLandmarkModel('/')
    await faceapi.loadFaceExpressionModel('/')
    changeInputSize(224)

    // try to access users webcam and stream the images
    // to the video element
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
    const videoEl = $('#inputVideo').get(0)
    videoEl.srcObject = stream
}

function updateResults() { }

$(document).ready(function () {
    //renderNavBar('#navbar', 'webcam_face_landmark_detection')
    initFaceDetectionControls()
    run()
    dispDiv = document.getElementById('jsDisp')
})

var isDebug = false

function debug() {
    isDebug = !isDebug
}