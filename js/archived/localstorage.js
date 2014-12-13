var storageAvailable = function() {
    return typeof(Storage) != "undefined";
};

var storeObject = function(toStoreName, toStore) {
    if (storageAvailable()) {
        localStorage.setItem(toStoreName, JSON.stringify(toStore));
        return true;
    } else {
        return false;
    }
};

var retrieveObject = function(toRetrieve) {
    if (storageAvailable()) {
        return JSON.parse(localStorage.getItem(toRetrieve));
    } else {
        return null;
    }
};

var deleteObject = function(toDelete) {
    if (storageAvailable()) {
       localStorage.removeItem(toDelete);
    }
}