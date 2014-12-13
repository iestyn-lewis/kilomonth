var User = {
    authenticationProvider: null,
    storageProvider: null,
    authenticated: false,
    
    init: function() {
        authenticationProvider = km.authenticationProvider;
        storageProvider = km.storageProvider;
    },
    
    getAuthenticatedUser : function(callback) {
        var aUser = null;
        var authData = authenticationProvider.getAuthenticatedUser();
        if (authData) {
            storageProvider.getUserFromId(authData.uid, function(userInfo) {
                aUser = User._create(authData, userInfo);
                callback(aUser);
            });
        } else {
            callback(null);
        }
    },
    
    unauthenticateUser : function() {
        authenticationProvider.unauthenticateUser();
    },
    
    getUserFromCredentials : function(email, password, callback) {
        authenticationProvider.getUserFromCredentials(email, password, function(error, auth) {
            if (auth) {
                storageProvider.getUserFromId(auth.uid, function(userInfo) {
                    var aUser = User._create(auth, userInfo);
                    callback(aUser);
                });
            } else {
                callback(null);
            }
        });
    },
    
    createNewUser : function(email, password, name, callback) {
        authenticationProvider.createNewUser(email, password, function(error, auth) {
            var aUser = null;
            if (auth) {
                fbUsersRef.child(auth.uid).child("name").set(name);
                fbUsersRef.child(auth.uid).child("email").set(email);
                storageProvider.getUserFromId(auth.uid, function(userInfo) {
                    aUser = User._create(auth, userInfo);
                    callback(aUser);
                });
            } else {
                callback(aUser);
            }
        });
    },

    // return a user object
    _create: function(auth, userInfo) {
        return {
            authData : auth,
            uid : auth.uid,
            maps : null,
            userInfo : userInfo,
            
            load : function(callback) {
                storageProvider.getUserMaps(this.uid, function(_maps) {
                    this.maps = _maps;
                    callback();
                }.bind(this));
            },
            
            save: function() {}
            
        };
    }
};