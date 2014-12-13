var ViewMapInfo = {
    init : function() {},
    
    bind : function() {  
        $("#welcome-color").colorPicker({showHexField: false});
        $('#welcomeModal').on('shown.bs.modal', function () {
            $('#welcome-name').focus();
        });
        for (i = new Date().getFullYear(); i > 1900; i--)
        {
            $('#welcome-year').append($('<option />').val(i).html(i));
        }
        
        $("#welcome-delete").click(function() {
            if (confirm("WARNING: You are about to delete this entire Kilomonth, including all events and pictures.")) {
                km.storageProvider.removeMap(this.lifeMapData.mapId, this.lifeMapData.info.uid, function() {
                    window.location.href = "/";
                });
            }
        }.bind(this));
        
        $("#welcome-close").click(function() {
            if (!this.lifeMapData) {
                window.location.href = "/";
            }
        }.bind(this));
      
        $("#welcome-save").click(function() {
            var userName = $("#welcome-name").val();
            var month = $("#welcome-month option:selected").text();
            var year = $("#welcome-year option:selected").text();
            var color = $("#welcome-color").val();
            //var public = $("#welcome-public").is(':checked');            
            console.log(lifeMapData);
            if (this.lifeMapData) {
                this.lifeMapData.data.birth = DateUtils.makeShortDate(month, year);
                this.lifeMapData.data.birthoffset = this.lifeMapData.data.birth.getMonth();
                this.lifeMapData.info.userName = userName;
                this.lifeMapData.info.color = color;
                this.lifeMapData.save();
            } else {
                var lifeMapData = {};
                var mapInfo = {uid: km.authenticatedUser.uid, name: userName, color: color};
                lifeMapData.ranges = [];
                lifeMapData.birth = DateUtils.makeShortDate(month, year);
                lifeMapData.birthoffset = lifeMapData.birth.getMonth();
                var lmd = LifeMapData.createMap(mapInfo, lifeMapData);
                var evt = $.Event('mapcreated', {lifeMapData: lmd});
                $(window).trigger(evt);    
            }
        }.bind(this));
    },
    
    setModel : function(lmd) {
        this.lifeMapData = lmd;
    },
    
    toCtls : function() {   
        if (this.lifeMapData) {
            $("#myModalLabel").text("Edit Info");
            $("#welcome-save").text("Save");
            var info = this.lifeMapData.info;
            $("#welcome-name").val(info.name);
            $("#welcome-color").val(info.color);
            $("#welcome-color").change();
            $("#welcome-public").prop("checked",info.public);
            var month = this.lifeMapData.data.birth.getMonth() + 1;
            var year = this.lifeMapData.data.birth.getFullYear();
            $("#welcome-month").val(month);
            $("#welcome-year").val(year);
            $("#welcome-delete").show();
        }
    },
    
    fromCtls : function() {
    },
    
    showDialog : function() {
        this.toCtls();
        $("#welcomeModal").modal();
    }
};