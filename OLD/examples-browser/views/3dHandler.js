import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";
import { OBJLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/MTLLoader.js';
//import * as THREE from 'three';


var cubes = [];
var rotation = [0, 0]
function main() {
    //lol()
    const canvas = document.querySelector("#c");
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setClearColor(0xFF0000, 0)

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
    const loader = new OBJLoader();

    const scene = new THREE.Scene();

    scene.background = null
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.PlaneGeometry(boxWidth, boxHeight, boxDepth);

    // just an array we can use to rotate the cubes
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = 1016;
    ctx.canvas.height = 776;
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const texture = new THREE.CanvasTexture(ctx.canvas);



    const material = new THREE.MeshBasicMaterial({
        map: texture, side: THREE.DoubleSide
    });
    const cube = new THREE.Mesh(geometry, material);
    //scene.add(cube);
    cubes.push(cube); // add to our list of cubes to rotate

    // load a resource

    const tvTex = new THREE.TextureLoader().load("textures/Color Map.png")

    const tvMat = new THREE.MeshBasicMaterial({
        map: tvTex, side: THREE.DoubleSide
    });

    const mtlLoader = new MTLLoader();
    mtlLoader.setMaterialOptions({ side: THREE.FrontSide })
    mtlLoader.load('textures/crt.mtl', (mtl) => {
        mtl.preload();/*
    const metl = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide
    });*/
        console.log(mtl.materials["Monitor01"])
        //loader.setMaterials(mtl)
        loader.load(
            // resource URL
            'models/crt.obj',
            // called when resource is loaded
            function (object) {
                object.traverse(function (child) {

                    if (child instanceof THREE.Mesh) {

                        child.material = tvMat;
                        if (child.name.startsWith("SCREEN")) {
                            console.log(child)
                            child.material = material;
                        }

                    }

                });
                object.rotation.y = 3.141592654
                object.scale.y = object.scale.x = object.scale.z = 4;
                object.position.z = -.4
                scene.add(object);
                cubes.push(object)

            },
            // called when loading is in progresses
            function (xhr) {

                console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            },
            // called when loading has errors
            function (error) {

                console.log(error);

            }
        );
    })

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function randInt(min, max) {
        if (max === undefined) {
            max = min;
            min = 0;
        }
        return (Math.random() * (max - min) + min) | 0;
    }
    var pos = 0
    function drawRandomDot(time) {
        ctx.clearRect(0, 0, 10000, 10000);
        pos += 4
        if (pos > 776) {
            pos -= 776 + 400
        }
        //ctx.drawImage(bg, 0, 0);
        //ctx.globalAlpha = Math.random() / 4 + .75
        ctx.fillStyle = hslToHex(142, 61, (Math.random() / 8 + .75) * 15);
        ctx.fillRect(0, 0, 2000, 1000)
        ctx.globalAlpha = .9
        // Assuming your canvas element is ctx
        ctx.shadowColor = "#16e978" // string
        //Color of the shadow;  RGB, RGBA, HSL, HEX, and other inputs are valid.
        ctx.shadowOffsetX = 0; // integer
        //Horizontal distance of the shadow, in relation to the text.
        ctx.shadowOffsetY = 0; // integer
        //Vertical distance of the shadow, in relation to the text.
        ctx.shadowBlur = 10; // integer
        //Blurring effect to the shadow, the larger the value, the greater the blur.
        ctx.fillStyle = "#d6ffe9"
        ctx.font = "200px Arial";
        ctx.fillText(":)", 20, 200, 1000);
        ctx.shadowColor = "#0000" // string

        crtEffect(pos)
    }

    function crtEffect(pos) {
        ctx.drawImage(lines, 0, 0);
        ctx.globalAlpha = .2
        ctx.drawImage(wipe, 0, pos);
        ctx.drawImage(wipe, 0, pos - 776 - 400);
        ctx.globalAlpha = 1

    }

    function render(time) {
        //time *= 0.001;
        time += 1;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        drawRandomDot(time);
        texture.needsUpdate = true;

        cubes.forEach((cube, ndx) => {
            //const speed = 0.2 + ndx * 0.1;
            //const rot = time * speed;
            //cube.rotation.x = 3.141592654 * .15;
            //cube.rotation.y = rot;
            const speed = .0005;
            const rot = (time * speed) + 3.141592654;
            cube.rotation.x = 3.141592654 * .07;
            cube.rotation.y = rot;
        });

        renderer.render(scene, camera);
        //fakeCRT();
        //ctx.drawImage(lines, 110, 110);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

main()

var lines = new Image();
var wipe = new Image();
lines.src =
    "textures/scanlines.png";
wipe.src =
    "textures/wipe.png";

//window.addEventListener("load", fakeCRT, false);
/*
function fakeCRT() {
  var glcanvas, source, srcctx, texture, w, h, hw, hh, w75;
  // Try to create a WebGL canvas (will fail if WebGL isn't supported)
  glcanvas = fx.canvas();

  // Assumes the first canvas tag in the document is the 2D game, but
  // obviously we could supply a specific canvas element here.
  source = document.getElementsByTagName("canvas")[0];
  srcctx = source.getContext("2d");

  // This tells glfx what to use as a source image
  texture = glcanvas.texture(source);

  // Just setting up some details to tweak the bulgePinch effect
  w = source.width;
  h = source.height;
  hw = w / 2;
  hh = h / 2;
  w75 = w * 0.75;

  // Hide the source 2D canvas and put the WebGL Canvas in its place
  //source.parentNode.insertBefore(glcanvas, source);
  //source.style.display = "none";
  //glcanvas.className = source.className;
  //glcanvas.id = source.id;
  //source.id = "old_" + source.id;

  // It is pretty silly to setup a separate animation timer loop here, but
  // this lets us avoid monkeying with the source game's code.
  // It would make way more sense to do the following directly in the source
  // game's draw function in terms of performance.
  setInterval(function () {
    // Give the source scanlines
    //srcctx.drawImage(lines, 0, 0, w, h);

    // Load the latest source frame
    texture.loadContentsOf(source);

    // Apply WebGL magic
    glcanvas
      .draw(texture)
      .bulgePinch(hw, hh, w75, 0.12)
      .vignette(0.25, 0.74)
      .update();
  }, Math.floor(1000 / 40));
}*/