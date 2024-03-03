import { renderAnimationFrame } from "./animation";
export function createPlayer(updateFn, animation, options) {
    var _animation_loopCount = animation.loopCount, loopCount = _animation_loopCount === void 0 ? 0 : _animation_loopCount, frameCount = animation.frameCount;
    var _options_frameDuration;
    var frameDuration = (_options_frameDuration = options === null || options === void 0 ? void 0 : options.frameDuration) !== null && _options_frameDuration !== void 0 ? _options_frameDuration : 1000 / 60;
    var listeners = [];
    return {
        currentFrame: 0,
        currentLoop: 0,
        stopped: false,
        stop: function stop() {
            this.stopped = true;
        },
        play: function play() {
            var _this = this;
            this.stopped = false;
            var intervalId = setInterval(function() {
                if (_this.stopped) {
                    clearInterval(intervalId);
                    return;
                }
                if (_this.currentFrame >= frameCount) {
                    if (_this.currentLoop < loopCount || loopCount < 0) {
                        _this.currentLoop++;
                        _this.currentFrame = 0;
                    } else {
                        clearInterval(intervalId);
                    }
                }
                renderAnimationFrame(updateFn, animation, _this.currentFrame);
                listeners.forEach(function(fn) {
                    return fn === null || fn === void 0 ? void 0 : fn();
                });
                _this.currentFrame++;
            }, frameDuration);
        },
        renderFrame: function renderFrame(frame) {
            this.currentFrame = frame;
            renderAnimationFrame(updateFn, animation, this.currentFrame);
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
