var PublicMaps = {
    init : function() {
        this.authenticationProvider = km.authenticationProvider;
        this.storageProvider = km.storageProvider;
    },
    
    getAll : function(callback) {
        this.storageProvider.getPublicMaps(function(maps) {
            callback(this._create(maps));
        }.bind(this));
    },
    
    _create : function(maps) {
        return maps;
    }
};