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
		zoomSpeed: .001,
		yUp: true,
		rotateActive: false,
		rotateActiveOnlyInPointerLock: true
	}, options || {});
	_.assign(this, options);
	this._movementSpeedScale = 1;
	if(!this.rotateActiveOnlyInPointerLock) this.rotateActive = true;

	this.pointerTrap = new PointerTrap(element);
	var _this = this;

	//mouse
	this.pointerTrap.on('data', function(pos) {
		if(_this.rotateActive) {
			_this.camera.rotateY(pos.x * -_this.rotationSpeed);
			_this.camera.rotateX(pos.y * -_this.rotationSpeed);
			if(_this.yUp) {
				_this.uprightCamera();
			}
		}
	})

	this.pointerTrap.onAttainSignal.add(function() {
		if(_this.rotateActiveOnlyInPointerLock) _this.rotateActive = true;
	})
	this.pointerTrap.onReleaseSignal.add(function() {
		if(_this.rotateActiveOnlyInPointerLock) _this.rotateActive = false;
	})
	this.onPointerLockAttainSignal = this.pointerTrap.onAttainSignal;
	this.onPointerLockReleaseSignal = this.pointerTrap.onReleaseSignal;

	//mouse wheel
	Mousewheel.onMouseWheelSignal.add(function(val) {
		var zoom = val * _this.zoomSpeed;
		var fov = _this.camera.fov;
		fov *= (1+zoom);
		fov = Math.min(_this.maxFov, Math.max(_this.minFov, fov))
		_this.camera.fov = fov;
		_this.camera.updateProjectionMatrix();
	});

	//yUp
	if(this.yUp) {
		this._lookAtTarget = this.camera.clone();
	}
}

FPSCameraController.prototype = {
	update: function() {
		var rotated = false;
		if(this.keyboard.isPressed('shift')) {
			this._movementSpeedScale = this.movementRunSpeedScale;
		} else {
			this._movementSpeedScale = 1;
		}
		if(this.keyboard.isPressed('a')) {
			this.camera.translateX(-this.movementSpeed * this._movementSpeedScale);
		}
		if(this.keyboard.isPressed('d')) {
			this.camera.translateX(this.movementSpeed * this._movementSpeedScale);
		}
		if(this.keyboard.isPressed('w')) {
			this.camera.translateZ(-this.movementSpeed * this._movementSpeedScale);
		}
		if(this.keyboard.isPressed('s')) {
			this.camera.translateZ(this.movementSpeed * this._movementSpeedScale);
		}
		if(this.keyboard.isPressed('e')) {
			this.camera.position.y += (this.movementSpeed * this._movementSpeedScale);
		}
		if(this.keyboard.isPressed('c')) {
			this.camera.position.y += (-this.movementSpeed * this._movementSpeedScale);
		}
		if(this.keyboard.isPressed('left')) {
			this.camera.rotateY(this.rotationSpeed);
			rotated = true;
		}
		if(this.keyboard.isPressed('right')) {
			this.camera.rotateY(-this.rotationSpeed);
			rotated = true;
		}
		if(this.keyboard.isPressed('up')) {
			this.camera.rotateX(this.rotationSpeed);
			rotated = true;
		}
		if(this.keyboard.isPressed('down')) {
			this.camera.rotateX(-this.rotationSpeed);
			rotated = true;
		}
		if(rotated && this.yUp) {
			this.uprightCamera();
		}
	},
	uprightCamera: function() {
		this._lookAtTarget.position.copy(this.camera.position);
		this._lookAtTarget.rotation.copy(this.camera.rotation);
		this._lookAtTarget.translateZ(-1);
		this.camera.lookAt(this._lookAtTarget.position);
	}
}

module.exports = FPSCameraController;