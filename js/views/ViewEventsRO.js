var ViewEventsRO = {
    init : function() {},
    bind : function() {},
    setModel : function(lmd, model) {
        this.lifeMapData = lmd;
        this.events = model;
    },
    toCtls : function() {
        var lmd = this.lifeMapData;
        var clickDate = this.events.eventsDate;
        var title = DateUtils.shortDateString(clickDate);
        var dateString = DateUtils.shortDateString(clickDate);
        var message = "";
        title += "<br>" + lmd.getAgo(clickDate);
        title += " ~ " + lmd.getAge(clickDate);
        var events = lmd.eventsOnDate(clickDate);
        message += events.summary();
        $(".wiki").html('<a target="_new" href="http://en.wikipedia.org/wiki/' + dateString.replace(" ", "_") + '">Wikipedia</a>');
        $("#details-title").html(title);
        $("#details-content").html(message);
    },
    showDialog : function() {
        this.toCtls();
        $("#details-modal").modal();
    }
};