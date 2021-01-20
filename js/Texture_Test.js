window.addEventListener('load', init);

const width = 1920;
const height = 1080;

const modelLoadPath = 'Model/GLTF/Monkey.glb';

function init()
{
    console.log('loaded');

    console.log('width : ' + width);
    console.log('height : ' + height);

    // レンダラー作成
    const renderer = CreateRenderer();

    // シーン作成
    const scene = new THREE.Scene();

    // カメラを作る
    const camera = CreatCamera(45, +100);

    // Textureロード
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('Model/Texture/Hoge_img0.png', function(texture)
    {
        // ジオメトリ作成
        const box = CreateBox(500, 0x0000ff, texture);

        // シーンに追加
        scene.add(box);
    });

    // ライトを作る
    const light = new THREE.DirectionalLight(0xffffff);
    light.intensity = 2;
    light.position.set(1,1,1);

    // シーンに追加
    scene.add(light);

    tick();

    function tick()
    {
        requestAnimationFrame(tick);

        renderer.render(scene,camera);
    }
}

function CreateRenderer()
{
    const renderer = new THREE.WebGLRenderer
    (
        {
            canvas : document.querySelector('#myCanvas')
        }
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    return renderer;
}

function CreatCamera(FOV, pos)
{
    const camera = new THREE.PerspectiveCamera(FOV, width/height, 1, 10000);
    camera.position.set(0,0,pos);
    return camera;
}

function CreateBox(size, color, texture)
{
    const geometry = new THREE.BoxGeometry(size, size, size);
    // const material = new THREE.MeshStandardMaterial
    // (
    //     {
    //         color : color
    //     }
    // );
    const material = new THREE.MeshLambertMaterial({map:texture});
    const box = new THREE.Mesh(geometry, material);
    return box;
}