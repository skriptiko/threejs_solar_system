window.onload = function() {

	var radius = 6371;
	var tilt = 0.41;
	var rotationSpeed = 0.02;
	var cloudsScale = 1.005;
	var moonScale = 0.23;
	var height = window.innerHeight;
	var width  = window.innerWidth;
	var container, stats;
	var camera, controls, scene, renderer;
	var geometry, meshPlanet, meshClouds, meshMoon;
	var dirLight, pointLight, ambientLight;
	var composer;
	var textureLoader = new THREE.TextureLoader();
	var d, dPlanet, dMoon, dMoonVec = new THREE.Vector3();
	var clock = new THREE.Clock();
	var sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune;
	var t = 0;

	init();
	animate();

	function addOrbit(_radius) {
		var geometry = new THREE.Geometry();
		var material = new THREE.PointsMaterial({color: 0x3d3c3c, size: 1, sizeAttenuation: false});

		for (var i = 0; i < 500; i++) {
			var vertex = new THREE.Vector3();
			vertex.x = Math.sin(180/Math.PI*i)*_radius;
			vertex.z = Math.cos(180/Math.PI*i)*_radius;

			geometry.vertices.push(vertex);
		}

		var mesh = new THREE.Points(geometry, material);
		scene.add(mesh);
	}

	function addPlanet(_radius, _tri, _tri1, _link, _color, _bool) {
		var geometry = new THREE.SphereGeometry(_radius, _tri, _tri1);
		// sunMat = new THREE.MeshNormalMaterial();
		var texture = new THREE.TextureLoader().load(_link);
		texture.anisotropy = 8;

		var material = new THREE.MeshPhongMaterial({ emissive: _color, emissiveMap: texture, emissiveIntensity: 1});
		if (_bool == true) material = new THREE.MeshPhongMaterial({map: texture});
		var mesh = new THREE.Mesh(geometry, material);
		mesh.castShadow = true;
		scene.add(mesh);
		return mesh;
	}

	function init() {

		container = document.createElement( 'div' );
		document.body.appendChild( container );

		camera = new THREE.PerspectiveCamera(45, width/height, 1, 1000000);
		camera.position.z = radius * 30;
		camera.position.y = 60000;
		camera.rotation.x = -15*Math.PI/180;

		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2(0x000000, 0.00000025);

		controls = new THREE.FlyControls( camera );
		controls.movementSpeed = 1000;
		controls.domElement = container;
		controls.rollSpeed = Math.PI / 12;
		controls.autoForward = false;
		controls.dragToLook = false;

		// dirLight = new THREE.DirectionalLight( 0xffffff );
		// dirLight.position.set( -1, 0, 1 ).normalize();
		// scene.add( dirLight );

		var light = new THREE.PointLight(0xffffff, 3, 250000, 2);
		light.castShadow = true;
		light.shadowMapWidth = 2048;
		light.shadowMapHeight= 2048;
		scene.add(light);

		// ---- stars -----------------------------
		var stars, starsGeom, starsMat, vertex;

		starsGeom = new THREE.Geometry();
		starsMat = new THREE.PointsMaterial({color: 0x2b2a2a, size: 1, sizeAttenuation: false});

		for (var i = 0; i < 15000; i++) {
			vertex = new THREE.Vector3();
			vertex.x = Math.random()*2-1;
			vertex.y = Math.random()*2-1;
			vertex.z = Math.random()*2-1;
			vertex.multiplyScalar(6000);
			starsGeom.vertices.push(vertex);
		}

		stars = new THREE.Points(starsGeom, starsMat);
		stars.scale.set(50, 50, 50);

		scene.add(stars);

		// ---- stars2 -----------------------------
		var stars2, starsGeom2, starsMat2, vertex2;

		starsGeom2 = new THREE.Geometry();
		starsMat2 = new THREE.PointsMaterial({color: 0xbbbbbb, size: 1, sizeAttenuation: false});

		for (var i = 0; i < 10000; i++) {
			vertex2 = new THREE.Vector3();
			vertex2.x = Math.random()*2-1;
			vertex2.y = Math.random()*2-1;
			vertex2.z = Math.random()*2-1;
			vertex2.multiplyScalar(8000);
			starsGeom2.vertices.push(vertex2);
		}

		stars2 = new THREE.Points(starsGeom2, starsMat2);
		stars2.scale.set(70, 150, 100);

		scene.add(stars2);

		// ---- orbit earth -----------------------------
		addOrbit(30000, 1000);

		// ---- orbit mercury -----------------------------
		addOrbit(8000, 1500);

		// ---- orbit venus -----------------------------
		addOrbit(17000, 2000);

		// ---- orbit mars -----------------------------
		addOrbit(50000, 2500);

		// ---- orbit jupiter -----------------------------
		addOrbit(70000, 3000);

		// ---- orbit saturn -----------------------------
		addOrbit(98000, 4000);

		// ---- orbit uranus -----------------------------
		addOrbit(120000, 4500);

		// ---- orbit neptune -----------------------------
		addOrbit(180000, 5000);

		// ---- sun -----------------------------
		sun = addPlanet(2300, 80, 80, "../model/sun.jpg", 0xffffff, false);

		// ---- mercury -----------------------------
		mercury = addPlanet(60, 20, 20, "../model/mercury.jpg", 0xffffff, true);

		// ---- venus -----------------------------
		venus = addPlanet(90, 20, 20, "../model/venus.jpg", 0xffffff, true);

		// ---- earth -----------------------------
		earth = addPlanet(70, 20, 20, "../model/earth.jpg", 0xffffff, true);

		// ---- mars -----------------------------
		mars = addPlanet(80, 20, 20, "../model/mars.jpg", 0xffffff, true);

		// ---- jupiter -----------------------------
		jupiter = addPlanet(340, 20, 20, "../model/jupiter.jpg", 0xffffff, true);

		// ---- saturn -----------------------------
		saturn = addPlanet(310, 20, 20, "../model/saturn.jpg", 0xffffff, true);

		saturnRingGeom = new THREE.Geometry();
		saturnRingMat = new THREE.PointsMaterial({color: 0x3a3a3a, size: 1, sizeAttenuation: false});

		for (var i = 0; i < 10000; i++) {
			var vertex2 = new THREE.Vector3();
			vertex2.x = Math.sin(180/Math.PI*i)*(700-i/50);
			vertex2.y = Math.random()*5;
			vertex2.z = Math.cos(180/Math.PI*i)*(700-i/50);

			saturnRingGeom.vertices.push(vertex2);
		}

		saturnRing = new THREE.Points(saturnRingGeom, saturnRingMat);
		saturnRing.castShadow = true;
		saturnRing.rotation.x = 13*Math.PI/180;

		scene.add(saturnRing);

		// ---- uranus -----------------------------
		uranus = addPlanet(110, 20, 20, "../model/uranus.png", 0xffffff, true);

		// ---- neptune -----------------------------
		neptune = addPlanet(100, 20, 20, "../model/neptune.jpg", 0xffffff, true);

		// ---- renderer -----------------------------
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( width, height );

		container.appendChild( renderer.domElement );

		stats = new Stats();

		container.appendChild( stats.dom );
		window.addEventListener( 'resize', onWindowResize, false );


		var renderModel = new THREE.RenderPass( scene, camera );

		var effectFilm = new THREE.FilmPass( 0.35, 0.75, 2048, false );
		effectFilm.renderToScreen = true;

		composer = new THREE.EffectComposer( renderer );
		composer.addPass( renderModel );
		composer.addPass( effectFilm );
	}

	function onWindowResize( event ) {
		height = window.innerHeight;
		width  = window.innerWidth;
		renderer.setSize( width, height );
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}

	function animate() {
		requestAnimationFrame( animate );
		render();
		stats.update();
	}

	function render() {

		sun.rotation.y += 0.007;
		earth.rotation.y += 0.007;
		mercury.rotation.y += 0.007;
		venus.rotation.y += 0.007;
		jupiter.rotation.y += 0.007;
		saturn.rotation.y += 0.007;
		saturnRing.rotation.y -= 0.001;
		uranus.rotation.y += 0.007;
		neptune.rotation.y += 0.007;

		earth.position.x = Math.sin(t*0.1)*30000;
		earth.position.z = Math.cos(t*0.1)*30000;

		mercury.position.x = Math.sin(t*0.3)*8000;
		mercury.position.z = Math.cos(t*0.3)*8000;

		venus.position.x = Math.sin(t*0.2)*17000;
		venus.position.z = Math.cos(t*0.2)*17000;

		mars.position.x = Math.sin(t*0.08)*50000;
		mars.position.z = Math.cos(t*0.08)*50000;

		jupiter.position.x = Math.sin(t*0.06)*(-70000);
		jupiter.position.z = Math.cos(t*0.06)*(-70000);

		saturn.position.x = Math.sin(t*0.04)*98000;
		saturn.position.z = Math.cos(t*0.04)*98000;

		saturnRing.position.x = saturn.position.x;
		saturnRing.position.z = saturn.position.z;

		uranus.position.x = Math.sin(t*0.04)*120000;
		uranus.position.z = Math.cos(t*0.04)*120000;

		neptune.position.x = Math.sin(t*0.03)*180000;
		neptune.position.z = Math.cos(t*0.03)*180000;

		t += Math.PI/180*2*0.1;

		// camera.lookAt(saturnRing.position);
		// camera.lookAt(saturnRingGeom.position);
		// camera.position.z = saturnRing.position.z;

		var delta = clock.getDelta();
		// sun.rotation.y += rotationSpeed * delta;

		dPlanet = camera.position.length();
		dMoonVec.subVectors( camera.position, sun.position );
		dMoon = dMoonVec.length();

		if ( dMoon < dPlanet ) {
			d = ( dMoon - radius * moonScale * 1.01 );
		} else {
			d = ( dPlanet - radius * 1.01 );
		}

		controls.movementSpeed = 0.66 * d;
		controls.update( delta );
		composer.render( delta );
	}

}
