var StorageFirebase = {
    // interact with firebase
    rootURL : null,
    fbRootRef : null,
    fbUsersRef : null,
    fbMapsRef : null,
    fbPublicMapsRef : null,
    fbSharedMapsRef : null,
    fbSharedUsersRef : null,
    
    init : function() {
        rootURL = km.rootFirebaseUrl;
        fbRootRef = new Firebase(rootURL);
        fbUsersRef = new Firebase(rootURL + 'kilomonth/users');
        fbMapsRef = new Firebase(rootURL + 'kilomonth/maps'); 
        fbPublicMapsRef = new Firebase(rootURL + 'kilomonth/publicmaps'); 
        fbLinkedMapsRef = new Firebase(rootURL + 'kilomonth/linkedmaps');
        fbSharedMapsRef = new Firebase(rootURL + 'kilomonth/sharedmaps');
        fbSharedUsersRef = new Firebase(rootURL + 'kilomonth/sharedusers');
    },
    
    getUserMaps : function(uid, callback) {
        fbUsersRef.child(uid).child("maps").once("value", function(snapshot) {
            var maps = snapshot.val();
            console.log(maps);
            callback(maps);
        });
    },
    
    getUsersMapSharedWith : function(mapid, callback) {
        fbSharedUsersRef.child(mapid).on("child_added", function(snapshot) {
            var uid = snapshot.key();
            fbUsersRef.child(uid).once("value", function(snapshot2) {
                callback(uid, snapshot2.val());
            });
        });
    },
    
    getMapsSharedWithUser : function(uid, callback) {
        fbSharedMapsRef.child(uid).on("child_added", function(snapshot) {
            var mapId = snapshot.key();
            fbMapsRef.child(mapId).once("value", function(snapshot2) {
                callback(mapId, snapshot2.val().info);
            });
        });
    },
    
    shareMapWithUser : function(mapid, uid) {
        fbSharedMapsRef.child(uid).child(mapid).set(true);
        fbSharedUsersRef.child(mapid).child(uid).set(true);
    },
    
    unShareMapWithUser : function(mapid, uid) {
        fbSharedMapsRef.child(uid).child(mapid).remove();
        fbSharedUsersRef.child(mapid).child(uid).remove();
    },
    
    getPublicMaps : function(callback) {
        fbPublicMapsRef.once("value", function(snapshot) {
            var maps = snapshot.val();
            callback(maps);
        });
    },

    saveMap : function(mapId, info, data) {
        var uid = info.uid;
        var map = {info: info, data: JSON.stringify(data)};
        if (uid != "_temp") {
            var ref = fbUsersRef.child(uid).child("maps").child(mapId);
            ref.set(info);
            if (info.public) {
                fbPublicMapsRef.child(mapId).set(info);
            } else {
                fbPublicMapsRef.child(mapId).remove();
            }        
            if (info.outShare) {
                fbLinkedMapsRef.child(mapId).set(info);
            } else {
                fbLinkedMapsRef.child(mapId).remove();
            }        
        }
        ref = fbMapsRef.child(mapId);
        ref.set(map);

    },
    
    removeMap : function(mapId, uid, callback) {
        //fbMapsRef.child(mapId).remove();
        fbUsersRef.child(uid).child("maps").child(mapId).remove();
        fbPublicMapsRef.child(uid).remove(function() {
            callback();
        });
    },

    getMap : function(mapId, callback) {
        var ref = fbMapsRef.child(mapId);
        ref.once("value", function(dataSnapshot) {
            console.log(dataSnapshot.val());
            var map = dataSnapshot.val();
            map.data = JSON.parse(map.data);
            callback(map);
        });
    },
    
    createMap : function(mapInfo, mapData) {
        // push a new map onto the map list
        var jdata = JSON.stringify(mapData);
        var mapRef = fbMapsRef.push({info: mapInfo, data: jdata});
        var newMapId = mapRef.key();
        // set reference in user object
        if (mapInfo.uid != "_temp") {
            var userMapRef = fbUsersRef.child(mapInfo.uid).child("maps").child(newMapId);
            userMapRef.set(mapInfo);
            // if it is public, set a reference in the public object
            if (mapInfo.public) {
                fbPublicMapsRef.child(newMapId).set(mapInfo);
            }
        }
        return newMapId;
    },
    
    getUserFromEmail : function(email, callback) {
        var ref = fbUsersRef;
        ref.orderByChild("email").equalTo(email).once("value", function(snap) {
            var key = null, val = null;
            if (snap.val()) {
                key = ObjectUtils.firstKey(snap.val());
                val = snap.val()[key];
            }
            callback(key, val);
        });
    },
    
    getUserFromId : function(uid, callback) {
        fbUsersRef.child(uid).once("value", function(snap) {
            callback(snap.val());
        });
    },

    createUser : function(email, password, name) {
        fbRootRef.createUser({
            email    : email,
            password : password
        }, function(err) {
            if (err) {
                switch (err.code) {
                    case 'EMAIL_TAKEN':
                        alert('The new user account cannot be created because the email is already in use.');
                        console.log("email taken");
                        break;
                    case 'INVALID_EMAIL':
                        alert('The specified email is not a valid email.');
                        console.log("invalid email");
                        break;
                    default:
                        break;
                }
            } else {
                // Log me in
                fbRootRef.authWithPassword({
                  "email"    : email,
                  "password" : password
                }, function(error, authData) {
                  if (error) {
                    console.log('Login Failed!', error);
                  } else {
                    console.log('Authenticated successfully with payload:', authData);
                    var uid = authData.uid;
                    var ref = fbUsersRef.child(uid).child("name");
                    ref.set(name);
                    ref = fbUsersRef.child(uid).child("email");
                    ref.set(email);
                    window.location.reload();
                  }
                });
            }
        });
    }
};