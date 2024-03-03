import { renderAnimationFrame } from "./animation";
export function createPlayer(updateFn, animation, options) {
    var _options_frameDuration;
    var frameDuration = (_options_frameDuration = options === null || options === void 0 ? void 0 : options.frameDuration) !== null && _options_frameDuration !== void 0 ? _options_frameDuration : 1000 / 60;
    var listeners = [];
    return {
        currentAnimation: animation,
        currentFrame: 0,
        currentLoop: 0,
        stopped: false,
        stop: function stop() {
            this.stopped = true;
        },
        setAnimation: function setAnimation(newAnimation) {
            this.currentAnimation = newAnimation;
            this.currentFrame = 0;
            this.currentLoop = 0;
        },
        play: function play(newAnimation) {
            var _this = this;
            if (newAnimation !== undefined) {
                this.setAnimation(newAnimation);
            }
            this.stopped = false;
            var intervalId = setInterval(function() {
                if (_this.stopped) {
                    clearInterval(intervalId);
                    return;
                }
                if (_this.currentFrame >= _this.currentAnimation.frameCount) {
                    if (_this.currentLoop < _this.currentAnimation.loopCount || _this.currentAnimation.loopCount < 0) {
                        _this.currentLoop++;
                        _this.currentFrame = 0;
                    } else {
                        clearInterval(intervalId);
                    }
                }
                renderAnimationFrame(updateFn, _this.currentAnimation, _this.currentFrame);
                listeners.forEach(function(fn) {
                    return fn === null || fn === void 0 ? void 0 : fn();
                });
                _this.currentFrame++;
            }, frameDuration);
        },
        renderFrame: function renderFrame(frame) {
            this.currentFrame = frame;
            renderAnimationFrame(updateFn, this.currentAnimation, this.currentFrame);
            listeners.forEach(function(fn) {
                return fn === null || fn === void 0 ? void 0 : fn();
            });
            this.currentFrame++;
        },
        onFrameRendered: function onFrameRendered(h) {
            listeners.push(h);
        }
    };
}
