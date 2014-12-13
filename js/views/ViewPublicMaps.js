var ViewPublicMaps = {
    init : function() {},
    
    bind : function() {
    },
    
    setModel : function(model) {
        this.maps = model;
    },
    
    toCtls : function() {
        var maps = this.maps;
        for (var map in maps) {
            if (maps.hasOwnProperty(map)) {
                var mapInfo = maps[map];
                $("#storedMaps").append('<a href="/kilomonth.html?mapid=' + map + '" class="btn btn-default btn-map"><i class="fa fa-square" style="color: ' + mapInfo.color + '"></i> ' + mapInfo.name + '</a>');
            }
        }
    }
};