import { OrbitControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js';	
import { WEBGL } from 'https://unpkg.com/three@0.126.0/examples/jsm/WebGL.js';
import { GUI } from 'https://unpkg.com/three@0.126.0/examples/jsm/libs/dat.gui.module.js';
window.addEventListener('DOMContentLoaded', init);

function init(){
    const width = image.width;
    const height = image.height;

    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#image')
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    // シーンを作成
    const scene = new THREE.Scene();

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 100);
    camera.position.set(0, 0, +10);
    
    // 箱を作成
    function fractal_box(n,size){
        var box = new THREE.Group();
        if(n==0){
            const geometry = new THREE.BoxGeometry(size*2**n, size*2**n, size*2**n);
            const material7 = new THREE.MeshStandardMaterial({color: 0xffffff});
            const box7 = new THREE.Mesh(geometry, material7);
            box7.position.set(-size*2**n/2, -size*2**n/2, -size*2**n/2);
            box7.receiveShadow = true;
            box7.castShadow = true;
            box.add(box7);
        }else{
            const box1=fractal_box(n-1,size);
            box1.position.set(-size*2**n/2,size*2**n/2,size*2**n/2);
            const box2=fractal_box(n-1,size);
            box2.position.set(size*2**n/2,-size*2**n/2,size*2**n/2);
            const box3=fractal_box(n-1,size);
            box3.position.set(size*2**n/2,size*2**n/2,-size*2**n/2);
            const box4=fractal_box(n-1,size);
            box4.position.set(size*2**n/2,-size*2**n/2,-size*2**n/2);
            const box5=fractal_box(n-1,size);
            box5.position.set(-size*2**n/2,-size*2**n/2,size*2**n/2);
            const box6=fractal_box(n-1,size);
            box6.position.set(-size*2**n/2,size*2**n/2,-size*2**n/2);
            const geometry = new THREE.BoxGeometry(size*2**n, size*2**n, size*2**n);
            const material7 = new THREE.MeshStandardMaterial({color: 0xffffff});
            const box7=new THREE.Mesh(geometry, material7);
            box7.position.set(-size*2**n/2,-size*2**n/2,-size*2**n/2);
            box7.receiveShadow = true;
            box7.castShadow = true;
            box.add(box1);
            box.add(box2);
            box.add(box3);
            box.add(box4);
            box.add(box5);
            box.add(box6);
            box.add(box7);
        }
        return box;
    }
    
    const n=4;
    const size=1;
    const center=10-size*4*2**n;
    const box=fractal_box(n,size);
    box.position.set(0, 0, center);
    //box.receiveShadow = true;
    //box.castShadow = true;
    scene.add(box);
    

    //scene.fog = new THREE.Fog(0x000000, size*4*2**n-60*2**n, size*4*2**n+60*2**n);
    const light1 = new THREE.SpotLight(0xFFFFFF,1,500,Math.PI,50,1);
    light1.position.set(1,1,1);
    light1.castShadow = true;
    scene.add(light1);
    const light2 = new THREE.SpotLight(0x00FF00,2,500,Math.PI,10,1);
    light2.position.set(-1,1,1);
    light2.castShadow = true;
    //scene.add(light2);
    const light3 = new THREE.SpotLight(0x0000FF,2,500,Math.PI/4,10,0.5);
    light3.position.set(0,-1,1);
    light3.castShadow = true;
    //scene.add(light3);
    const light4 = new THREE.AmbientLight(0xFFFFFF,0.5);
    scene.add(light4);

    const settings = {
        resetCamera: function() {
            controls.update();
            camera.position.set(0, 0, 10);
        }
    };

    const gui = new GUI();
	gui.add(settings, 'resetCamera');
	gui.open();
    const controls = new OrbitControls(camera, renderer.domElement);
    tick();
    // 初回実行
    //renderer.render(scene, camera);
    function tick() {
        requestAnimationFrame(tick);

        // 箱を回転させる
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;

        // レンダリング
        renderer.render(scene, camera);
    }
}