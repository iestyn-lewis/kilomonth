var ViewUser = {
    authenticatedUser : null,
        
    setModel : function(model) {
        authenticatedUser = model;
    },
    
    bind : function() {
        this.$btnLoginModal = $("#btnLogin");
        this.$btnSignupModal = $("#btnSignUp");
        this.$storedMaps = $("#storedMaps");
        this.$btnLogout = $("#btnLogout");
        this.$newKilomonth = $("#newKilomonth");
        this.$loginModal = $("#loginModal");
        this.$signupModal = $("#signUpModal");
        this.$btnLogin = $("#btn-login");
        this.$btnSignup = $("#btn-signup");
        this.$email = $("#email");
        this.$password = $("#password");
        this.$emailSU = $("#email-su");
        this.$passwordSU = $("#password-su");
        this.$nameSU = $("#name-su");
        
        $storedMaps.hide();
        $btnLogout.hide();
        $btnSignupModal.show();
        
        $btnSignupModal.click(ViewUser.handleSignupDialog);
        $btnLoginModal.click(ViewUser.handleLoginDialog);
        $btnSignup.click(ViewUser.handleSignup);
        $btnLogout.click(ViewUser.handleLogout);
        $btnLogin.click(ViewUser.handleLogin);
        
        $loginModal.on('shown.bs.modal', function() {   
            $email.select();
        });
    }.bind(this),
    
    toCtls: function() {
        if (authenticatedUser) {
            $btnLoginModal.hide();
            $btnLogout.show();
            //$("#start").hide();
            $btnSignupModal.hide();    
            //$("#userInfo").html('for <a href="#" id="lnkShowUserInfo">' + authenticatedUser.userInfo.name + '</a>');
            $("#userInfo").html('for ' + authenticatedUser.userInfo.name);
            authenticatedUser.load(function () {
                ViewUser.displayMaps(authenticatedUser.maps);
                $storedMaps.show();
            });
            km.storageProvider.getMapsSharedWithUser(authenticatedUser.uid, function(mapId, mapInfo) {
                $("#sharedMaps").show();
                $("#sharedMaps").append('<a href="/kilomonth.html?mapid=' + mapId + '" class="btn btn-default btn-map"><i class="fa fa-square" style="color: ' + mapInfo.color + '"></i> ' + mapInfo.name + '</a>');
            });
        } else {
            $("#start").show();
            $storedMaps.hide();
            $btnLogout.hide();
        }
    },
    
    fromCtls: function() {},
    
    handleSignupDialog : function() {
        $signupModal.modal();
    },
    
    handleSignup : function () {
        var email = $emailSU.val();
        var password = $passwordSU.val();
        var name = $nameSU.val();
        User.createNewUser(email, password, name, function(user) {
            if (user) {
                authenticatedUser = user;
                window.location.reload();
            }
        });
    },
    
    handleLoginDialog : function() {
        $loginModal.modal();
    },
    
    handleLogin : function() {
        var email = $email.val();
        var password = $password.val();
        User.getUserFromCredentials(email, password, function(user) {
            if (user) {
                authenticatedUser = user;
                window.location.reload();
            }
        });
    },
    
    handleLogout : function() {
        User.unauthenticateUser();
        window.location.reload();
    },
    
    displayMaps : function(maps) {
        //$storedMaps.html("");
        for (var map in maps) {
            if (maps.hasOwnProperty(map)) {
                var mapInfo = maps[map];
                $storedMaps.append('<a href="/kilomonth.html?mapid=' + map + '" class="btn btn-default btn-map"><i class="fa fa-square" style="color: ' + mapInfo.color + '"></i> ' + mapInfo.name + '</a>');
            }
        }
    }
};