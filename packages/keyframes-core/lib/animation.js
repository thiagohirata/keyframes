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
export function renderLayer(updateFn, layer, frame) {
    var _layer_keyframes;
    var keyframe = (_layer_keyframes = layer.keyframes) === null || _layer_keyframes === void 0 ? void 0 : _layer_keyframes[frame];
    if (keyframe) {
        updateFn(layer.ref, keyframe);
    }
}
