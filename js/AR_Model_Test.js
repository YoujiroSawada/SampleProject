const modelLoadPath = 'Model/GLTF/Monkey_Anim.glb';

const renderer = new THREE.WebGLRenderer
(
    {
        antialias : true,
        alpha : true
    }
);

renderer.setClearColor(new THREE.Color(), 0);
renderer.setSize(640, 480);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0px';
renderer.domElement.style.left = '0px';
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.visible = false;

const camera = new THREE.Camera();
scene.add(camera);

const arToolkitSource = new THREEx.ArToolkitSource
(
    {
        sourceType : 'webcam'
    }
);

arToolkitSource.init(() =>
{
    setTimeout(() =>
    {
        onResize();
    }, 2000);
});

addEventListener('resize', () => {onResize();});

function onResize()
{
    arToolkitSource.onResizeElement();
    arToolkitSource.copyElementSizeTo(renderer.domElement);
    if(arToolkitContext.arController != null)
    {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
    }
};

const arToolkitContext = new THREEx.ArToolkitContext
(
    {
        cameraParamererUrl : 'data/camera_para.dat',
        detectionMode : 'mono'
    }
);

arToolkitContext.init(() =>
{
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});

const arMarkerControls = new THREEx.ArMarkerControls
(
    arToolkitContext,
    camera,

    {
        type : 'pattern',
        patternUrl : 'data/patt.hiro',
        changeMatrixMode : 'cameraTransformMatrix'
    }
);

let model = null;
let animationMixer = null;
const loader = new THREE.GLTFLoader();
loader.setCrossOrigin('anonymous');
const dloader = new THREE.DRACOLoader();
loader.setDRACOLoader(dloader);
loader.load(modelLoadPath, function(gltf)
{
    model = gltf.scene;
    model.position.y = 1.0;
    model.rotation.set(0,0,0);

    const animations = gltf.animations;
    if(animations && animations.length)
    {
        let i;
        animationMixer = new THREE.AnimationMixer(model);
        for(i = 0; i < animations.length; i++)
        {
            animationMixer.clipAction(animations[i]).play();
        }
    }
    scene.add(model);
});

const light = new THREE.DirectionalLight(0xFFFFFF);
light.position.set(1,1,1);
light.intensity = 2;
scene.add(light);

let clock = new THREE.Clock();

requestAnimationFrame(function animate()
{
    requestAnimationFrame(animate);

    if(arToolkitSource.ready)
    {
        arToolkitContext.update(arToolkitSource.domElement);
        scene.visible = camera.visible;
    }

    const delta = clock.getDelta();
    if(animationMixer)
    {
        animationMixer.update(delta);
    }
    renderer.render(scene, camera);
});