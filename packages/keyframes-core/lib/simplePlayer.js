import { renderAnimationFrame } from "./animation";
export function createPlayer(updateFn, animation, options) {
    var _animation_loopCount = animation.loopCount, loopCount = _animation_loopCount === void 0 ? 0 : _animation_loopCount, frameCount = animation.frameCount;
    var _options_frameDuration;
    var frameDuration = (_options_frameDuration = options === null || options === void 0 ? void 0 : options.frameDuration) !== null && _options_frameDuration !== void 0 ? _options_frameDuration : 1000 / 60;
    var currentFrame = 0;
    var currentLoop = 0;
    var stopped = false;
    var listeners = [];
    var onFrameRendered = function(h) {
        listeners.push(h);
    };
    var stop = function() {
        stopped = true;
    };
    var play = function() {
        stopped = false;
        var intervalId = setInterval(function() {
            if (stopped) {
                clearInterval(intervalId);
                return;
            }
            renderAnimationFrame(updateFn, animation, currentFrame);
            listeners.forEach(function(fn) {
                return fn === null || fn === void 0 ? void 0 : fn();
            });
            currentFrame++;
            if (currentFrame >= frameCount) {
                if (currentLoop < loopCount || loopCount < 0) {
                    currentLoop++;
                    currentFrame = 0;
                } else {
                    clearInterval(intervalId);
                }
            }
        }, frameDuration);
    };
    return {
        stop: stop,
        play: play,
        onFrameRendered: onFrameRendered
    };
}
