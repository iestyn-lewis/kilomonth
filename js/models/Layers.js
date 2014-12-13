var Layers = {
    init : function() {   
    },
    
    default : function() {
        return this._create({
            none: {displayName: "None", selected: true},
            edu: {displayName: "Education", selected: true},
            work: {displayName: "Places Worked", selected: true},
            live: {displayName: "Places Lived", selected: true},
            vac: {displayName: "Vacations / Travel", selected: true},
            birth: {displayName: "Births / Anniversaries", selected: true},
            milestone: {displayName: "Milestones", selected: true},
            project: {displayName: "Projects", selected: true},
            change: {displayName: "Life Changing Events", selected: true}
        });
    },
    
    _create : function(layers) {
        return {
            layers: layers,
            
            layerIsSelected : function(code) {
                return this.layers[code].selected;
            },
            
            layerIsVisible : function(code) {
                var c = code || 'none';
                return this.layerIsSelected(c);
            },
            
            setLayerSelected : function(code, selected) {
                this.layers[code].selected = selected;
            }
            
        };
    }
    

};