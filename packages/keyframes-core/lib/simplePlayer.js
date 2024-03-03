function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
import { renderAnimationFrame } from "./animation";
export function createPlayer(updateFn, options) {
    for(var _len = arguments.length, animationStack = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        animationStack[_key - 2] = arguments[_key];
    }
    var _options_frameDuration;
    var frameDuration = (_options_frameDuration = options === null || options === void 0 ? void 0 : options.frameDuration) !== null && _options_frameDuration !== void 0 ? _options_frameDuration : 1000 / 60;
    var frameRenderedListeners = [];
    return {
        currentAnimation: animationStack === null || animationStack === void 0 ? void 0 : animationStack[0],
        animationStack: (animationStack === null || animationStack === void 0 ? void 0 : animationStack.slice(1)) || [],
        currentFrame: 0,
        currentLoop: 0,
        stopped: false,
        stop: function stop() {
            this.stopped = true;
        },
        setAnimation: function setAnimation() {
            for(var _len = arguments.length, animationStack = new Array(_len), _key = 0; _key < _len; _key++){
                animationStack[_key] = arguments[_key];
            }
            this.animationStack = _to_consumable_array(animationStack);
            this.currentAnimation = this.animationStack.shift();
            this.currentFrame = 0;
            this.currentLoop = 0;
        },
        tick: function tick() {
            if (this.currentFrame >= this.currentAnimation.frameCount) {
                if (this.currentLoop < this.currentAnimation.loopCount || this.currentAnimation.loopCount < 0) {
                    this.currentLoop++;
                    this.currentFrame = 0;
                } else {
                    var _this_animationStack;
                    var hasMoreAnimation = ((_this_animationStack = this.animationStack) === null || _this_animationStack === void 0 ? void 0 : _this_animationStack.length) > 0;
                    if (hasMoreAnimation) {
                        this.currentAnimation = this.animationStack.shift();
                        this.currentFrame = 0;
                        this.currentLoop = 0;
                    } else {
                        this.stopped = true;
                    }
                }
            }
            this.renderFrame();
        },
        play: function play(newAnimation) {
            var _this = this;
            for(var _len = arguments.length, animationStack = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                animationStack[_key - 1] = arguments[_key];
            }
            if (newAnimation !== undefined) {
                this.setAnimation.apply(this, [
                    newAnimation
                ].concat(_to_consumable_array(animationStack)));
            }
            this.stopped = false;
            var intervalId = setInterval(function() {
                if (_this.stopped) {
                    clearInterval(intervalId);
                    return;
                }
                _this.tick();
            }, frameDuration);
        },
        renderFrame: function renderFrame(frame) {
            if (frame != null) {
                this.currentFrame = frame;
            }
            renderAnimationFrame(updateFn, this.currentAnimation, this.currentFrame);
            frameRenderedListeners.forEach(function(fn) {
                return fn === null || fn === void 0 ? void 0 : fn();
            });
            this.currentFrame++;
        },
        onFrameRendered: function onFrameRendered(h) {
            frameRenderedListeners.push(h);
        }
    };
}
