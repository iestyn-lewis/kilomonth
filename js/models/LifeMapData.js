var LifeMapData = {

    init : function() {
        this.authenticationProvider = km.authenticationProvider;
        this.storageProvider = km.storageProvider;
    },
    
    getMap : function(mapId, callback) {
        storageProvider.getMap(mapId, function(map) {
            var ret = LifeMapData._create(mapId, map.info, map.data);
            ret._rehydrate();
            callback(ret);
        });
    },
    
    createMap : function(mapInfo, mapData) {
        var mapId = storageProvider.createMap(mapInfo, mapData);
        var ret = LifeMapData._create(mapId, mapInfo, mapData);
        ret._rehydrate();
        return ret;
    },
        
    _create : function(mapId, mapInfo, mapData) {
        return {
            mapId : mapId,
            info : mapInfo,
            data : mapData,
            
            save : function() {
                km.storageProvider.saveMap(this.mapId, this.info, this.data);
                this._rehydrate();   
                var evt = $.Event('mapupdated');
                $(window).trigger(evt);
            },
            
            _rehydrate : function() {
                var lmd = this.data;
                lmd.birth = new Date(lmd.birth);
                lmd.ranges = lmd.ranges || [];
                this.eventDictionary = [];
                for(var i=0; i<lmd.ranges.length; i++) {
                    var range = lmd.ranges[i];
                    range.dates[0] = new Date(range.dates[0]);
                    range.dates[1] = new Date(range.dates[1]);
                    var startOffset = DateUtils.getOffset(lmd.birth, range.dates[0]);
                    var endOffset = DateUtils.getOffset(lmd.birth, range.dates[1]);
                    for (var j=startOffset; j<=endOffset; j++) {
                        var arr = this.eventDictionary[j];
                        if (arr) {
                            arr.push(range);
                        } else {
                            this.eventDictionary[j] = [];
                            this.eventDictionary[j].push(range);
                        }
                    }
                } 
            },
                
            eventsOnDate : function(clickDate) {
                return Events.getForDate(this, clickDate);
            },
            
            newEvent : function(clickDate) {
                return Event.newEvent(this, clickDate);
            },
            
            eventByEvent : function(event) {
                var lifeMapData = this.data;
                var range = null;
                for(var i= 0; i<lifeMapData.ranges.length; i++) {
                    range = lifeMapData.ranges[i];
                    if (range.name == event.name && range.dates[0] == event.dates[0] && range.dates[1] == event.dates[1])
                        break;
                }
                return range;
            },

            getAge : function(theDate) {
                var lmd = this.data;
                var age = Math.floor(DateDiff.inMonths(lmd.birth, theDate) / 12);
                if (age >= 0)
                    return "Age " + age;
                else
                    return "";
            },

            getAgo : function(theDate) {
                var lmd = this.data;
                var thisyear = new Date().getFullYear();
                var age = Math.floor(DateDiff.inMonths(new Date("January 1, " + thisyear), theDate) / 12);
                var plural = " years ";
                if (Math.abs(age) == 1)
                    plural = " year ";
                if (age < 0)
                    return Math.abs(age) + plural + "ago";
                else if (age > 0)
                    return Math.abs(age) + plural + "from now";
                else 
                    return "";
            }   
        }
    }
};