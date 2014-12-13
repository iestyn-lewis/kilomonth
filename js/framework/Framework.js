var km = {};

var Framework = {
    init : function(callback) {
        km.rootFirebaseUrl = 'https://dazzling-heat-4042.firebaseio.com/';
        km.imgurClientId = 'c79b5ab16574e49';
        km.imgurApiUrl = 'https://api.imgur.com/3/image';
        km.googleAPIKey = 'AIzaSyAhFGKePG0tz0elL_1XaF1YR7ONU5tLu6A';
        km.googleUrlShortenerUrl = 'https://www.googleapis.com/urlshortener/v1/url';
        
        StorageFirebase.init();
        AuthenticateFirebase.init();
        StorageImgur.init();
    
        km.storageProvider = StorageFirebase;
        km.authenticationProvider = AuthenticateFirebase;
        km.imageStorageProvider = StorageImgur;
        
        User.init();
        User.getAuthenticatedUser(function(user) {
            km.authenticatedUser = user;
            callback();
        });
    }
};