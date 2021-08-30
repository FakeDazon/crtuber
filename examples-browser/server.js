const express = require('express')
const path = require('path')
const { get } = require('request')
const fs = require('fs')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const viewsDir = path.join(__dirname, 'views')
app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, '../images')))
app.use(express.static(path.join(__dirname, '../media')))
app.use(express.static(path.join(__dirname, '../../weights')))
app.use(express.static(path.join(__dirname, '../../dist')))

app.get('/', (req, res) => res.redirect('/webcam_face_landmark_detection'))
app.get('/webcam_face_detection', (req, res) => res.sendFile(path.join(viewsDir, 'webcamFaceDetection.html')))
app.get('/webcam_face_landmark_detection', (req, res) => res.sendFile(path.join(viewsDir, 'webcamFaceLandmarkDetection.html')))
app.get('/webcam_face_expression_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'webcamFaceExpressionRecognition.html')))
app.get('/webcam_age_and_gender_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'webcamAgeAndGenderRecognition.html')))


app.listen(3000, () => console.log('Listening on port 3000!'))
