var _ = require('lodash');
var Keyboard = require('game-keyboard');
var keyMap = require("game-keyboard/key_map")["US"];
var PointerTrap = require('pointer-trap-relative');
var Mousewheel = require('input-mousewheel');
function FPSCameraController(camera, element, options) {
	this.camera = camera;
	this.keyboard = new Keyboard(keyMap);
	options = _.merge({
		movementSpeed: .1,
		movementRunSpeedScale: 2.5,
		rotationSpeed: .001,
		minFov: 10,
		maxFov: 100,
		zoomSpeed: .001
	}, options || {});
	_.assign(this, options);
	this.movementSpeedScale = 1;

	this.pointerTrap = new PointerTrap(element);
	var _this = this;

	//mouse
	this.pointerTrap.on('data', function(pos) {
		_this.camera.rotateY(pos.x * -_this.rotationSpeed);
		_this.camera.rotateX(pos.y * -_this.rotationSpeed);
	})

	//mouse wheel
	Mousewheel.onMouseWheelSignal.add(function(val) {
		var zoom = val * _this.zoomSpeed;
		var fov = _this.camera.fov;
		fov *= (1+zoom);
		fov = Math.min(_this.maxFov, Math.max(_this.minFov, fov))
		_this.camera.fov = fov;
		_this.camera.updateProjectionMatrix();
	});
}

FPSCameraController.prototype = {
	update: function() {
		if(this.keyboard.isPressed('shift')) {
			this.movementSpeedScale = this.movementRunSpeedScale;
		} else {
			this.movementSpeedScale = 1;
		}
		if(this.keyboard.isPressed('a')) {
			this.camera.translateX(-this.movementSpeed * this.movementSpeedScale);
		}
		if(this.keyboard.isPressed('d')) {
			this.camera.translateX(this.movementSpeed * this.movementSpeedScale);
		}
		if(this.keyboard.isPressed('w')) {
			this.camera.translateZ(-this.movementSpeed * this.movementSpeedScale);
		}
		if(this.keyboard.isPressed('s')) {
			this.camera.translateZ(this.movementSpeed * this.movementSpeedScale);
		}
		if(this.keyboard.isPressed('left')) {
			this.camera.rotateY(this.rotationSpeed);
		}
		if(this.keyboard.isPressed('right')) {
			this.camera.rotateY(-this.rotationSpeed);
		}
		if(this.keyboard.isPressed('up')) {
			this.camera.rotateX(this.rotationSpeed);
		}
		if(this.keyboard.isPressed('down')) {
			this.camera.rotateX(-this.rotationSpeed);
		}
	}
}

module.exports = FPSCameraController;