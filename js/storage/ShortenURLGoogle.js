var ShortenURLGoogle = {
    init : function() {
        this.apiURL = km.googleUrlShortenerUrl;
        this.apiKey = km.googleAPIKey;
    },
    
    shortenURL : function(longUrl, callback) {
        var url = this.apiURL + "?key=" + this.apiKey;
        $.ajax({
              url: url,
              type: 'POST',
              data: '{"longUrl": "' + longUrl + '"}',
              dataType: 'json',
              contentType: 'application/json',
              success: function(result) {
                callback(result);
              }
            });  
    }
};