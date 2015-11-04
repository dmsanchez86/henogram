;(function() {

    var TrasladarPunto = function(from, n, upper, amplitude) {
        var dux = isFinite(n) ? (Math.cos(n) * amplitude) : 0;    
        var duy = isFinite(n) ? (Math.sin(n) * amplitude) : amplitude;
        return [ 
            from[0] - ((upper ? -1 : 1) * dux), 
            from[1] + ((upper ? -1 : 1) * duy)
        ];
    };

    var PuntoEnLinea = function(from, m, distance) {
        var dux = isFinite(m) ? (Math.cos(m) * distance) : 0;
        var duy = isFinite(m) ? (Math.sin(m) * distance) : distance;
        return [
            from[0] + dux,
            from[1] + duy
        ];
    };

    var Fusionado = function(params) {
        params = params || {};
        var _super =  jsPlumb.Connectors.AbstractConnector.apply(this, arguments);
        this.type = "Fusionado";

        var wavelength = params.wavelength || 10,
            amplitude = params.amplitude || 10,
            spring = params.spring,
            compressedThreshold = params.compressedThreshold || 5;

        this._compute = function(paintInfo, paintParams) {
            
             _super.addSegment(this, "Straight", { 
                x1:paintInfo.sx, 
                y1:paintInfo.sy,
                x2:paintInfo.tx,
                y2:paintInfo.ty
             });    
        };
    };
    jsPlumbUtil.extend(Fusionado, jsPlumb.Connectors.AbstractConnector);
    jsPlumb.registerConnectorType(Fusionado, "Fusionado");
})();
