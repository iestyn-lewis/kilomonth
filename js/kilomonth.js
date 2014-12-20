var resize_canvas = function() {
    ViewMap.toCtls();
};

$(function() {
    Framework.init(function() { 
        Layers.init();
        km.layers = Layers.default();
        MapSettings.init();
        LifeMapData.init();
        ViewMapInfo.init();
        ViewMapInfo.bind();
        ViewMap.init();
        ViewMap.bind();
        ViewEvents.init();
        ViewEvents.bind();
        ViewEventsRO.init();
        ViewEventsRO.bind();
        ViewEvent.init();
        ViewEvent.bind();
        ViewLayers.init();
        ViewLayers.bind();
        ViewShare.init();
        ViewShare.bind();
        ShortenURLGoogle.init();
        km.urlShortenerProvider = ShortenURLGoogle;
    });

    var url = URI(document.URL).query(true);
    var mapid = url.mapid;
    //var uid = km.authenticatedUser.uid;
    if (mapid == "_new") {
        ViewMapInfo.showDialog();
    } else {
        LifeMapData.getMap(mapid, function(lmd) {
            ViewMap.setModels(lmd, MapSettings.defaultSettings());
            ViewShare.setModel(lmd);
            ViewMap.toCtls();
        });
    }
    
    $(window).on('mapcreated', function(data){
        var map = data.lifeMapData;
        ViewShare.setModel(map);
        ViewMap.setModels(map, MapSettings.defaultSettings());
        ViewMap.toCtls();
        ViewMap.showStartScreen();
    });
    
    
    // putting this out here because it's got weird "this" magic that doesn't
    // work when it's in ViewMap
    $('#month-highlight').qtip({
        content: 'My content',
        position: {
            viewport: $(window),
            effect: false,
            adjust: {
                method: 'flipinvert shift'
            }
        },
        hide: {
            delay : 0
        },
        style: {
            classes: 'qtip-light qtip-shadow qtip-rounded qt-bigfont'
        },
        api: {
            onRender: function() {
                $this = this;
                var qtiptip = this.elements.tooltip;
                $(this.elements.tooltip).mouseover(function() {
                    //alert($this);
                    $this.destroy();
                });
                this.elements.tooltip.bind("click", this.destroy);
            }
        }
    });
});