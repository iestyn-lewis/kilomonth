var lmdInitialize = function(lmd) {
    lmd.userName = "";
    lmd.ranges = [];
    lmd.categories = ["Places Lived", "Vacations", "Places Worked", "Milestones", "Births", "Deaths", "Anniversaries"];
}

var lmdRehydrate = function(lmd) {
    lmd.birth = new Date(lmd.birth);
    lmd.ranges = lmd.ranges || [];
    for(var i=0; i<lmd.ranges.length; i++) {
        var range = lmd.ranges[i];
        range.dates[0] = new Date(range.dates[0]);
        range.dates[1] = new Date(range.dates[1]);
    }    
};

var lmdEventsOnDate = function(lmd, theDate) {
    var ret = [];
    for(var i=0; i<lmd.ranges.length; i++) {
        var range = lmd.ranges[i];
        if (range.dates[0] <= theDate && range.dates[1] >= theDate) {
            ret.push(range);
        }
    }
    return ret;
};

var lmdEventSummary = function(lmd, theDate) {
    var evts = lmdEventsOnDate(lmd, theDate);
    var ret = [];
    for(var i=0; i<evts.length; i++) {
        var name = evts[i].name;
        var description = evts[i].description || '';
        console.log(description);
        ret.push('<i class="fa fa-square" style="color: ' + evts[i].color + '"></i> ' + name + description);
    }
    if (evts.length > 0)
        return ret.join("<br>");
    else
        return null;
};

var lmdGetAge = function(lmd, theDate) {
    var age = Math.floor(DateDiff.inMonths(lmd.birth, theDate) / 12);
    if (age >= 0)
        return "Age " + age;
    else
        return "";
};

var lmdGetAgo = function(lmd, theDate) {
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
};