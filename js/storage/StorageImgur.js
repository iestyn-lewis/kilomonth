var StorageImgur = {    
    init : function() {
        this.client_id = km.imgurClientId;
        this.api_url = km.imgurApiUrl;
    },
    
    storeImage : function(imageStr, callback) {
        var url = "";
        auth = 'Client-ID ' + this.client_id;
        $.ajax({
              url: this.api_url,
              type: 'POST',
              headers: {
                Authorization: auth,
                Accept: 'application/json'
              },
              data: {
                image: imageStr,
                type: 'base64'
              },
              success: function(result) {
                var id = result.data.id;
                callback('https://i.imgur.com/' + id);
              }
            });        
    }
};