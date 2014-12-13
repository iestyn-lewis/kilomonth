var Events = {
    
    getForDate : function(lmd, theDate) {
        var evtDict = lmd.eventDictionary;
        lmd = lmd.data;
        var offset = DateUtils.getOffset(lmd.birth, theDate);
        var arr = evtDict[offset];
        var ret = [];
        if (arr) {
            for(var i=0; i<arr.length; i++) {
                var range = arr[i];
                if (km.layers.layerIsVisible(range.layer)) {
                    ret.push(range);
                }
            }
        }
        if (ret.length > 0) {        
            return {
                eventsDate : theDate,
                events : ret,
                summary : function() {
                    var evts = this.events;
                    var ret = [];
                    for(var i=0; i<evts.length; i++) {
                        var evt = evts[i];
                        var name = evt.name;
                        var description = evt.description || '';
                        console.log(description);
                        var thisEvt = '<i class="fa fa-square" style="color: ' + evt.color + '"></i> ' + name; 
                        if (evt.description)
                            thisEvt += "<br>" + evt.description;
                        if (evt.images) {
                            for(var j=0, image; image = evt.images[j]; j++) {
                                thisEvt+= '<img src="' + image + '.jpg">';
                            }
                        }
                        ret.push(thisEvt);
                    }
                    if (evts.length > 0)
                        return ret.join("<br>");
                    else
                        return null;
                }
            }
        } else {
            return null;
        }
    }
};