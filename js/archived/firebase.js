// interact with firebase
var rootURL = 'https://dazzling-heat-4042.firebaseio.com/';
var fbRootRef = new Firebase(rootURL);
var fbUsersRef = new Firebase(rootURL + 'kilomonth/users');
var fbPublicMapsRef = new Firebase(rootURL + 'kilomonth/publicmaps');

var fbGetUserMaps = function(uid, callback) {
    fbUsersRef.child(uid).child("maps").on("value", function(snapshot) {
        var maps = snapshot.val();
        console.log(maps);
        callback(maps);
    });
};

var fbSaveMap = function(uid, mapName, map) {
    var ref = fbUsersRef.child(uid).child("maps").child(mapName);
    ref.set(JSON.stringify(map));
};

var fbGetMap = function(uid, mapName, callback) {
    var ref = fbUsersRef.child(uid).child("maps").child(mapName);
    ref.once("value", function(dataSnapshot) {
        console.log(dataSnapshot.val());
        callback(JSON.parse(dataSnapshot.val()));
    });
};

var fbCreateUser = function(email, password, name) {
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
                window.location.reload();
              }
            });
        }
    });
};

