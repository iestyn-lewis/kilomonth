"kilomonth" : {
        "users": {
          ".write" : "auth != null",
          "$uid": {
            ".read": "auth != null && auth.uid == $uid",
            ".write": "auth != null && auth.uid == $uid"
          }
        },
        "publicmaps": {
          ".read" : "true",
          "$mapid": {
            ".write": "data.child('info').child('uid').val() == auth.uid && newData.child('info').child('uid').val() == auth.uid"
          }
        },
        "maps": {
          "$mapid" : {
            ".read": "data.child('info').child('public').val() == true || data.child('info').child('uid').val() == auth.uid",
            ".write": "data.child('info').child('uid').val() == auth.uid && newData.child('info').child('uid').val() == auth.uid"
          }
        }
      }
    }