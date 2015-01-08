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
    } else if (mapid == "_temp") {
        window.tempMap = true;
        var year = url.year;
        var name = url.name;
        var month = url.month;
        var lifeMapData = {};
        var mapInfo = {uid: '_temp', name: name, color: "000000"};
        lifeMapData.ranges = [];
        lifeMapData.birth = DateUtils.makeShortDate(month, year);
        lifeMapData.birthoffset = lifeMapData.birth.getMonth();
        console.log("wood");
        var lmd = LifeMapData.createMap(mapInfo, lifeMapData);
        ViewShare.setModel(lmd);
        ViewMap.setModels(lmd, MapSettings.defaultSettings());
        ViewMap.toCtls();  
        ViewMap.showStartScreen();
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
    
    window.onbeforeunload = function(e) {
        if (window.tempMap) return 'If you want to save your Kilomonth, click Stay on This Page.  Then click Save to create an account' +
                                   ' and save.  Otherwise, your changes will be lost!';
    };
    
    $("#b-save").click(function() {
        $("#signUpModal").modal();
    });
    
    $("#signUpModal").on('shown.bs.modal', function() {   
        $("#name-su").val(ViewMap.lifeMapData.info.name);
        $("#email-su").select();
    });
    
    $("#btn-signup").click(function () {
        var email = $("#email-su").val();
        var password = $("#password-su").val();
        var name = $("#name-su").val();
        User.createNewUser(email, password, name, function(user) {
            if (user) {
                authenticatedUser = user;
                ViewMap.lifeMapData.info.uid = authenticatedUser.uid;
                window.tempMap = false;
                ViewMap.lifeMapData.save();
                window.location.href = "/kilomonth.html?mapid=" + ViewMap.lifeMapData.mapId;
            }
        });
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