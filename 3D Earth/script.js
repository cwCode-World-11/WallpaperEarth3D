// let mainHours = (new Date().getHours() / 23) * 100;

// Setting Date And Timer
setInterval(() => {
  const dateObj = new Date();
  const dayArr = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
  document.querySelector(
    ".dateAndTimer"
  ).innerHTML = `<span id='dateSpan'>${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()}<span id='daySpan'>${
    dayArr[dateObj.getDay()]
  }</span></span><span id='dividerLine'></span><span id='timeSpan'>${
    dateObj.getHours() % 12 === 0 ? 12 : dateObj.getHours() % 12
  } - ${
    dateObj.getMinutes() < 10
      ? "0" + dateObj.getMinutes()
      : dateObj.getMinutes()
  } - ${
    dateObj.getSeconds() < 10
      ? "0" + dateObj.getSeconds()
      : dateObj.getSeconds()
  } ${dateObj.getHours() >= 12 ? "PM" : "AM"}</span>`;
}, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xe5e4e4, 0, 75);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const textureLoader = new THREE.TextureLoader();

// Background
const geometryStar = new THREE.BufferGeometry();
const vertices = [];
const color4 = new THREE.Color(0xffffff);
let colorsArr = [];

for (let i = 0; i < 800; i++) {
  vertices.push(THREE.MathUtils.randFloatSpread(2000)); // x
  vertices.push(THREE.MathUtils.randFloatSpread(2000)); // y
  vertices.push(THREE.MathUtils.randFloatSpread(2000)); // z
  colorsArr.push(0.7, 0.7, 0.7);
}

geometryStar.setAttribute(
  "color",
  new THREE.Float32BufferAttribute(colorsArr, 3)
);

geometryStar.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(vertices, 3)
);

const particles = new THREE.Points(
  geometryStar,
  new THREE.PointsMaterial({ size: 0.5, vertexColors: true })
);
const color3 = new THREE.Color("rgb(0, 0, 10)");
scene.background = color3;
scene.add(particles);

// ReferenceEARTH
const geometryREFERENCE = new THREE.SphereGeometry(0.5, 50, 50);
const materialREDERENCE = new THREE.MeshBasicMaterial({
  map: textureLoader.load("./Asset/clock.png"),
});
const earthREFERENCE = new THREE.Mesh(geometryREFERENCE, materialREDERENCE);
earthREFERENCE.name = "earthReference";
scene.add(earthREFERENCE);

// EARTH
const geometry = new THREE.SphereGeometry(0.6, 50, 50);
geometry.faceVertexUvs[0].forEach((faceUvs) => {
  faceUvs.forEach((uv) => {
    {
      uv.x *= 0.99; // Adjust the U (horizontal) coordinate
      uv.y *= 1.05; // Adjust the V (vertical) coordinate
    }
  });
});
const material = new THREE.MeshPhongMaterial({
  map: textureLoader.load("./Asset/earth.jpg"),
  normalScale: new THREE.Vector2(0, 5),
  specular: color4,
  specularMap: textureLoader.load("./Asset/earthGloss.jpg"),
  normalMap: textureLoader.load("./Asset/earthNormal.jpg"),
  shininess: 0.3,
});
// material.blending = THREE.AdditiveBlending;
// material.side = THREE.FrontSide;
const earth = new THREE.Mesh(geometry, material);
earth.name = "earth";
earth.rotation.set(-1, -1.1, -1);
scene.add(earth);

// SUN
const geometrySUN = new THREE.SphereGeometry(10, 50, 50);
const materialSun = new THREE.MeshBasicMaterial({
  map: textureLoader.load("./Asset/sun.jpg"),
  side: THREE.DoubleSide,
  fog: false,
});
const sun = new THREE.Mesh(geometrySUN, materialSun);
sun.rotation.set(-1, -1.1, -1);
sun.position.set(100, 0, 0);
sun.name = "sun";
earthREFERENCE.add(sun);
// Lens(Sun Glow)
const geometrySUNGLOW1 = new THREE.PlaneGeometry(80, 80);
const materialSUNGLOW1 = new THREE.MeshBasicMaterial({
  map: textureLoader.load("./Asset/lensflare.png.jpg"),
  fog: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  transparent: true,
  opacity: 0.8,
});
const lensSUNGLOW1 = new THREE.Mesh(geometrySUNGLOW1, materialSUNGLOW1);
sun.add(lensSUNGLOW1);

// Lights
const spotLight = new THREE.SpotLight(0x404040, 3);
spotLight.position.set(2, 0, 0);
spotLight.angle = 0.5;
spotLight.penumbra = 2;
earthREFERENCE.add(spotLight);

scene.add(new THREE.AmbientLight(0x404040, 1));

// Clickable
const rayCaster = new THREE.Raycaster();
const mousePosition = new THREE.Vector2();
const info = document.querySelector(".info");
const infoTitle = document.querySelector(".titleInfo");
const infoDescription = document.querySelector(".decriptionInfo");
const infoLink = document.querySelector(".info a");
const closeBtn = document.querySelector(".info span");
function txtInfo(title, des, link, linkTxt) {
  infoTitle.innerHTML = title;
  infoDescription.innerHTML = des;
  infoLink.href = link;
  infoLink.innerHTML = linkTxt;
}
window.addEventListener("dblclick", function (e) {
  mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / this.window.innerHeight) * 2 + 1;
  // ////////
  rayCaster.setFromCamera(mousePosition, camera);
  // Find objects intersecting the ray
  const intersects = rayCaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    // The first object in the intersections array is the one clicked
    const clickedObject = intersects[0].object;
    // Handle the click event for the clicked object
    console.log("Object clicked: ", clickedObject);
    // Perform actions specific to the clicked object
    info.classList.contains("infoHide")
      ? info.classList.remove("infoHide")
      : info.classList.add("infoHide");
    if (clickedObject.name == "sun") {
      txtInfo(
        "Sun",
        "The Sun is the star at the center of the Solar System. It is a massive hot ball of plasma, inflated and heated by nuclear fusion reactions at its core. Part of this internal energy is emited from the Sun's surface as light, ultraviolet, and infrared radiation, providing most of the energy for life on Earth.",
        "https://en.wikipedia.org/wiki/Sun",
        "Sun"
      );
    } else {
      if (clickedObject.parent.type == "Object3D") {
        txtInfo(
          "Earth In Day",
          `Today date is ${new Date()}.`,
          "https://www.google.com/search?q=what+day+today",
          "What day today"
        );
      } else {
        txtInfo(
          "Earth",
          "Earth is the third planet from the Sun and the only astronomical object known to harbor life. This is enabled by Earth being a water world, the only one in the Solar System sustaining liquid surface water. ",
          "https://en.wikipedia.org/wiki/Earth",
          "Earth"
        );
      }
      // txtInfo("Hello World", "Rajanstark", "http://www.google.com", "Google");
    }
  }
});
closeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (info.classList.contains("infoHide")) {
    info.classList.remove("infoHide");
  } else {
    info.classList.add("infoHide");
  }
});
document.querySelector(".resetView").addEventListener("click", () => {
  camera.position.set(
    0.99605170622995,
    -0.029021134616375333,
    -0.08389739126983356
  );
});

camera.position.set(
  0.99605170622995,
  -0.029021134616375333,
  -0.08389739126983356
);

const orbit = new THREE.OrbitControls(camera, renderer.domElement);
orbit.update();

renderer.render(scene, camera);

// earthREFERENCE.rotateY(-linear(0, 100, mainHours, -3.2, 3.2));
let mainHours = new Date().getHours();
if (mainHours >= 0 && mainHours <= 6) {
  earthREFERENCE.rotateY(-linear(0, 6, mainHours, -3.2, -1.2));
} else if (mainHours > 6 && mainHours <= 19) {
  earthREFERENCE.rotateY(-linear(6, 19, mainHours, -1.2, 1));
} else {
  earthREFERENCE.rotateY(-linear(20, 23, mainHours, 1, 3.2));
}
function animate() {
  orbit.update();
  orbit.rotateSpeed = 0.08;
  // console.log("camera:", camera.position);
  if (camera.position.z >= -1267.2338487726024) {
    document.querySelector(".outOfUniverse").classList.add("hide");
  } else {
    document.querySelector(".outOfUniverse").classList.remove("hide");
  }

  mainHours = (new Date().getHours() / 23) * 100;
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Linear
function linear(minInput, maxInput, inValue, minOut, maxOut) {
  // Define the input values
  const inputMin = minInput;
  const inputMax = maxInput;
  const inputValue = inValue; // Change this value as your input

  // Define the output range
  const outputMin = minOut;
  const outputMax = maxOut;

  // Calculate the proportion
  const inputRange = inputMax - inputMin;
  const outputRange = outputMax - outputMin;
  const proportion = (inputValue - inputMin) / inputRange;

  // Calculate the output value
  const outputValue = proportion * outputRange + outputMin;

  // console.log(
  //   `For input value ${inputValue}, the output value is ${outputValue}`
  // );

  return outputValue;
}
