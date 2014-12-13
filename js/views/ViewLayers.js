var ViewLayers = {
    init : function() {},
    bind : function() {
        $("#mnuLayer").click(this.showDialog.bind(this));
        $("#layer-save").click(this.applyLayerSelection.bind(this));
    },
    
    showDialog : function() {
        this.toCtls();
        $("#layersModal").modal();
    },
    
    applyLayerSelection : function() {
        this.fromCtls();
        ViewMap.toCtls();
    },
    
    toCtls : function() {
        // layers
        var div = $("#layerVisibilitySelection");
        div.html("");
        var layers = km.layers.layers;
        var layerData = layers["none"];
        var chk = layerData.selected ? "checked" : "";
        div.append('<div class="checkbox">' + 
                        '<label>' + 
                            '<input class="layerSelect" id="layer' + 'none' + '" type="checkbox" ' + chk + '> ' +
                            'Untagged Events' +
                        '</label>' +
                     '</div><p>');
        for (var layer in layers) {
            if (layers.hasOwnProperty(layer)) {
                if (layer != "none") {
                    var layerData = layers[layer];
                    var chk = layerData.selected ? "checked" : "";
                    div.append('<div class="checkbox">' + 
                            '<label>' + 
                                '<input class="layerSelect" id="layer' + layer + '" type="checkbox" ' + chk + '> ' +
                                layerData.displayName +
                            '</label>' +
                         '</div>');
                }
            }
        }
        $("#layerSelectAll").click(function() {
            $(".layerSelect").prop('checked', true);
        });
        $("#layerSelectNone").click(function() {
            $(".layerSelect").prop('checked', false);
        });

    },
    
    fromCtls : function() {
        $(".layerSelect").each(function(i,element) {
            var id = element.id.replace("layer", "");
            var checked = element.checked;
            km.layers.layers[id].selected = checked;
        });
    }
};