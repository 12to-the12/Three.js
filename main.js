
import * as THREE from './three.module.js';
import { OrbitControls } from "./OrbitControls.js";
import { OBJLoader } from './OBJLoader.js';


let container;

let camera, scene, renderer, controls;



let object;

init();
animate();


function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 5, 10);
    // scene

    scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0x880808, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);




    // manager

    function loadModel() {

        object.traverse(function (child) {

            if (child.isMesh) child.material.map = texture;

        });

        scene.add(object);

    }

    const manager = new THREE.LoadingManager(loadModel);

    manager.onProgress = function (item, loaded, total) {

        console.log(item, loaded, total);

    };

    // texture

    const textureLoader = new THREE.TextureLoader(manager);
    const texture = textureLoader.load('../obj/brain.jpg');

    // model

    function onProgress(xhr) {

        if (xhr.lengthComputable) {

            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');

        }

    }

    function onError() { }

    const loader = new OBJLoader(manager);
    loader.load('./obj/untitled.Obj', function (obj) {

        object = obj;

    }, onProgress, onError);

    //

    renderer = new THREE.WebGLRenderer({});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);


    // controls

    controls = new OrbitControls(camera, renderer.domElement);
    //    controls.listenToKeyEvents(window); // optional

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.minDistance = 10;
    controls.maxDistance = 80;
    controls.rotateSpeed = 3.0;

    controls.maxPolarAngle = Math.PI / 2;




    //

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}


//

function animate() {

    requestAnimationFrame(animate);
    controls.update();
    render();

}

function render() {





    camera.lookAt(scene.position);

    renderer.render(scene, camera);

}
