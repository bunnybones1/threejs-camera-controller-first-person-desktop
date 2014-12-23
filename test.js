var onReady = function() {
	var View = require('threejs-managed-view').View;
	var CameraControllerFPS = require('./');
	var view = new View({
		useRafPolyfill: false
	});
	var scene = view.scene;

	var sphereGeometry = new THREE.SphereGeometry(1.5);
	var size = 100;
	var sizeHalf = size * .5;
	var bounds = new THREE.Box3(
		new THREE.Vector3(-sizeHalf, -sizeHalf, -sizeHalf),
		new THREE.Vector3(sizeHalf, sizeHalf, sizeHalf)
	)
	var random = new THREE.Vector3();
	var boundSize = bounds.size();
	for (var i = 0; i < 600; i++) {
		var ball = new THREE.Mesh(sphereGeometry);
		scene.add(ball);
		random.set(
			Math.random(),
			Math.random(),
			Math.random()
		);
		ball.position.copy(bounds.min).add(random.multiply(boundSize));
	};

	var fpsController = new CameraControllerFPS(view.camera, view.canvasContainer);

	view.renderManager.onEnterFrame.add(function() {
		fpsController.update();
	})
}

var loadAndRunScripts = require('loadandrunscripts');
loadAndRunScripts(
	[
		'bower_components/three.js/three.js'
	],
	onReady
);