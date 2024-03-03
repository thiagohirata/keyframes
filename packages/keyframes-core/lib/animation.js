export function renderAnimationFrame(updateFn, animation, frame) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = animation.layers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var layer = _step.value;
            renderLayer(updateFn, layer, frame);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}
function _prepareLayer(layer) {
    if ("keyrframeIndexes" in layer) return layer;
    var preparedLayer = layer;
    preparedLayer.keyframesIndexes = Object.keys(layer.keyframes).map(Number);
    return preparedLayer;
}
function renderLayer(updateFn, layer, frame) {
    var pLayer = _prepareLayer(layer);
    var nextKeyframeIdx = pLayer.keyframesIndexes.findIndex(function(v) {
        return v > frame;
    });
    if (nextKeyframeIdx > 0) {
        var nextKeyFrameFrame = pLayer.keyframesIndexes[nextKeyframeIdx];
        var nextKeyframe = pLayer.keyframes[nextKeyFrameFrame];
        var prevKeyFrameFrame = pLayer.keyframesIndexes[nextKeyframeIdx - 1];
        var prevKeyframe = pLayer.keyframes[prevKeyFrameFrame];
        var prevKeyframeValue = typeof prevKeyframe === "object" && prevKeyframe && "value" in prevKeyframe ? prevKeyframe.value : prevKeyframe;
        if (nextKeyframe && prevKeyFrameFrame != frame && (typeof nextKeyframe === "number" && pLayer.interpolation === "linear" || typeof nextKeyframe === "object" && "interpolation" in nextKeyframe && nextKeyframe.interpolation === "linear")) {
            var nextKeyframeValue = typeof nextKeyframe === "object" && "value" in nextKeyframe ? nextKeyframe.value : nextKeyframe;
            if (typeof prevKeyframeValue === "number" && typeof nextKeyframeValue === "number") {
                var diff = nextKeyFrameFrame - prevKeyFrameFrame;
                var diffFrame = frame - prevKeyFrameFrame;
                var interpolatedValue = prevKeyframeValue + (nextKeyframeValue - prevKeyframeValue) * diffFrame / diff;
                updateFn(pLayer.ref, interpolatedValue);
            }
        } else {
            updateFn(pLayer.ref, prevKeyframeValue);
        }
    }
}
