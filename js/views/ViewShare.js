var ViewShare = {
    init : function() {},
    
    setModel : function(model) {
        this.lifeMapData = model;
    },
    
    bind : function() {
       
        $("#b-share").click(this.showDialog.bind(this));
        $("#shareModal").on('shown.bs.modal', function () {
            $('#shareText').select();
        });
        
        
        $("#chkShareLink").click(function() {
            var outShare = $("#chkShareLink").prop('checked');
            $("#shareText").prop('disabled', !outShare);
            if (outShare)
                $("#copypaste").show();
            else
                $("#copypaste").hide();
            if (outShare) {
                $('#shareText').select();
            }
            ViewShare.fromCtls();
        });
        
        $("#chkSharePublic").click(this.fromCtls.bind(this));
                
        $("#btnAddShareUser").click(this.handleAddUserButton.bind(this));
        
        $("#share-save").click(this.fromCtls.bind(this));
        

    },
    
    showDialog : function() {
        var info = this.lifeMapData.info;
        /*if (info.shortUrl) {
            var shortUrl = info.shortUrl;
            var text = "Check out my Kilomonth - a month by month look at my life - at " + shortUrl;
            $("#shareText").text(text);
            $("#shareModal").modal();
        } else { */
            km.urlShortenerProvider.shortenURL(document.URL, function(ret) {
                ViewShare.lifeMapData.info.shortUrl = ret.id;
                ViewShare.lifeMapData.save();
                var text = "Check out my Kilomonth - a month by month look at my life - at " + ret.id;
                $("#shareText").text(text);
                $("#shareModal").modal();                
            });
       // }
        this.toCtls();
    },
    
    handleAddUserButton : function() {
        var email = $("#txtAddShareUser").val();
        if (email != "") {
            km.storageProvider.getUserFromEmail(email, function(uid, user) {
                if (uid) {
                    km.storageProvider.shareMapWithUser(ViewShare.lifeMapData.mapId, uid);
                    //ViewShare.addUser(uid, user);
                    $("#txtAddShareUser").val("");
                    $("#txtAddShareUser").select();
                } else {
                    alert("Could not find a user with that email address.  Try again.");
                }
            });
        }
    },
    
    handleRemoveUserButton : function(uid) {
        km.storageProvider.unShareMapWithUser(ViewShare.lifeMapData.mapId, uid.replace('_', ':'));
        $("#" + uid).remove();
    },
    
    bindRemoveUserButtons : function() {
        $(".deleteShareUser").click(function(event) {
            ViewShare.handleRemoveUserButton(event.target.parentElement.parentElement.id);
        });
    },
    
    addUser : function(uid, user) {
        $("#usersSharedWith").append('<div id="' + uid.replace(':', '_') + '" class="sharedUser">' + user.name + ' <a href="#" class="deleteShareUser"><i class="fa fa-close"></i></a></div>');
        ViewShare.bindRemoveUserButtons();
    },
    
    toCtls : function() {
        var info = this.lifeMapData.info;
        var public = info.public || false;
        var inShare = info.inShare || false;
        var outShare = info.outShare || false;
        $("#chkSharePublic").prop('checked', public);
        $("#chkShareLink").prop('checked', outShare);
        if (outShare)
            $("#copypaste").show();
        else
            $("#copypaste").hide();
        var mapID = this.lifeMapData.mapId;
         $("#usersSharedWith").html("");
        km.storageProvider.getUsersMapSharedWith(mapID, function(uid, user) {
            ViewShare.addUser(uid, user);
        });
        ViewShare.bindRemoveUserButtons();   
    },
    
    fromCtls : function() {
        var public = $("#chkSharePublic").prop('checked');
        var outShare = $("#chkShareLink").prop('checked');
        var info = ViewShare.lifeMapData.info;
        info.public = public;
        info.outShare = outShare;
        ViewShare.lifeMapData.save();
    }
};