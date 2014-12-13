var ObjectUtils = {
    allKeys : function(obj) {
        if (!obj)
            return null;
        var ret = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                ret.push(k);
            }
        }
        return ret;
    },
    
    firstKey : function(obj) {
        var keys = ObjectUtils.allKeys(obj);
        if (!keys)
            return null;
        return keys[0];
    }       
};