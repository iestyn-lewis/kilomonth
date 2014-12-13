var AuthenticateFirebase = {
    rootURL : km.rootFirebaseUrl,
    fbRootRef : null,
    
    init : function() {
        fbRootRef = new Firebase(rootURL);
    },    
    
    getAuthenticatedUser : function() {
        return fbRootRef.getAuth();
    },
    
    getUserFromCredentials : function(email, password, callback) {
       fbRootRef.authWithPassword({
          email    : email,
          password : password
        }, function(error, authData) {
          if (error === null) {
            // user authenticated with Firebase
            console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
            callback(null, authData);
          } else {
            callback(error, null);
          }
        });
    },
    
    createNewUser : function(email, password, callback) {
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
                callback(err, null);
            } else {
                // Log me in
                fbRootRef.authWithPassword({
                    "email"    : email,
                    "password" : password
                }, function(error, authData) {
                    if (error) {
                        console.log('Login Failed!', error);
                        callback(err, null);
                    } else {
                        console.log('Authenticated successfully with payload:', authData);
                        callback(null, authData);
                    }
                });
            }
        });
    },
    
    unauthenticateUser : function() {
        fbRootRef.unauth();
    }
};