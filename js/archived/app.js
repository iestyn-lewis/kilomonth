var lifeMapData = {};
var kilomonth = {};

kilomonth.auth = null;
kilomonth.renderer = null;
kilomonth.lifeMapData = {};

var mapSettings =
{
    canvasId: "months",
    monthSize: 9,
    padSize: 1,
    textGutterSize: 55,
    defaultLightColor: "#dddddd",
    defaultDarkColor: "#888888",
    thisMonthColor: "#ffffff",
    highlightColor: "#ff0000",
    yearsShown: 84,
    yearColumns: 2
};

var monthTip;
var c; // canvas
var ctx; // context
var highlightedMonth;
var currentClickDate;
var eventsBeingEdited;
var eventBeingEdited;

var resize_canvas = function() {
    kilomonth.renderer.drawMap(mapSettings, lifeMapData);
};

var setRenderer = function(rnd) {
    switch (rnd) {
        case "column":
            kilomonth.renderer = ColumnRenderer;
            break;
        case "block":
            kilomonth.renderer = BlockRenderer;
            break;
    }
}
    
var getEventsOnDate = function(theDate) {
    var ret = [];
    for(var i=0; i<lifeMapData.ranges.length; i++) {
        range = lifeMapData.ranges[i];
        if (theDate >= range.dates[0] && theDate <= range.dates[1]) {
            ret.push(range);
        };
    }
    return ret;
};

var highlightMonth = function(monthDate) {
    if (!highlightedMonth) {
        drawRectAroundMonth(monthDate, mapSettings.highlightColor);
        highlightedMonth = monthDate;
    } else {
        if (Math.abs(DateDiff.inMonths(highlightedMonth, monthDate)) > 0) {
            drawRectAroundMonth(monthDate, mapSettings.highlightColor);
            highlightedMonth = monthDate;
       }
    }
};

var drawRectAroundMonth = function(monthDate, color) {
    var rect = c.getBoundingClientRect();
    var pos = kilomonth.renderer.getXYFromDate(monthDate);
    var ht = $(".month-highlight");
    //console.log(pos);
    ht.css({top: pos.y + rect.top, left: pos.x + rect.left, height: mapSettings.monthSize + 3, width: mapSettings.monthSize + 3});
    ht.show();
}



;

function getTouchPos(canvas, evt) {
    evt.preventDefault();
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.targetTouches[0].pageX - rect.left,
        y: evt.targetTouches[0].pageY - rect.top
    }
};

function handleTouchStart(evt) {
    // retarget monthTip
    monthTip.hide();
    monthTip = new Opentip($("#month-highlight"), {target: true, tipJoint: "bottom right"});
    evt.preventDefault();
    var mousePos = getTouchPos(c, evt);
    mousePos.y -= 50;
    var clickDate = kilomonth.renderer.getDateFromClick(mapSettings, lifeMapData, mousePos);
    var message = shortDateString(clickDate);
    message += "<br>" + lmdGetAgo(lifeMapData, clickDate);
    message += "<br>" + lmdGetAge(lifeMapData, clickDate);
    var events = lmdEventSummary(lifeMapData, clickDate);
    if (events) message += events;
    message += "<br><a class='launchPopover btn btn-default btn-xs' id='launchPopover'>Edit</a>";
    //console.log(message);
    drawTooltip(message);
    highlightMonth(clickDate);
    currentClickDate = clickDate;
    bindLinkEventHandler();
};

function handleTouchEnd(evt) {
   
};

function getEventByName(name) {
    var range = null;
    for(var i= 0; i<lifeMapData.ranges.length; i++) {
        range = lifeMapData.ranges[i];
        if (range.name == name)
            break;
    }
    return range;
};

function handleTouchMove(evt) {
    evt.preventDefault();
    var mousePos = getTouchPos(c, evt);
    mousePos.y -= 50;
    var clickDate = kilomonth.renderer.getDateFromClick(mapSettings, lifeMapData, mousePos);
    var message = shortDateString(clickDate);
    message += "<br>" + lmdGetAgo(lifeMapData, clickDate);
    message += "<br>" + lmdGetAge(lifeMapData, clickDate);
    var events = lmdEventSummary(lifeMapData, clickDate);
    if (events) message += events;
    //console.log(message);
    message += "<br><br><a class='launchPopover btn btn-default btn-xs' id='launchPopover'>Edit</a>";
    drawTooltip(message);
    highlightMonth(clickDate);
    currentClickDate = clickDate;
    bindLinkEventHandler();
};


function drawPopover(event) {
    // draw edit dialog with all events for that month

    $("#add-color-col").addClass("col-xs-12");
    $("#add-color-col").removeClass("col-xs-6");
    $("#add-on-top-col").hide();
    if (!event) {
        var month = currentClickDate.getMonth() + 1;
        var year = currentClickDate.getFullYear();
        eventBeingEdited = "_new";
        //$("#add-form-label").text("Add Event");
        $("#add-existing-events").hide();
        $("#add-delete").hide();
        $("#add-eventName").val("");
        $("#add-month").val(month);
        $("#add-year").val(year);
        $("#add-end-month").val(month);
        $("#add-end-year").val(year);
        $("#descEdit").code(null);
        $("#addModal").modal();
    } else {
        $("#add-existing-events").show();
        var month = event.dates[0].getMonth() + 1;
        var year = event.dates[0].getFullYear();
        var month2 = event.dates[1].getMonth() + 1;
        var year2 = event.dates[1].getFullYear();
        var layer = event.layer;
        $("#add-color").val(event.color);
        $("#add-color").change();
        $("#add-month").val(month);
        $("#add-year").val(year);
        $("#add-end-month").val(month2);
        $("#add-end-year").val(year2);
        $("#add-eventName").val(event.name);
        $("#selectLayer").val(layer);
        $("#add-delete").show();
        $("#add-form-label").text('Edit Event');
        $("#add-delete").show();
        $("#descEdit").code(event.description || null);
        $("#addModal").modal();
    }
};

function drawSelectPopover(clickDate) {
    currentClickDate = clickDate;
    var month = clickDate.getMonth() + 1;
    var year = clickDate.getFullYear();
    var events = getEventsOnDate(clickDate);
    $(".wiki").html('<a target="_new" href="http://en.wikipedia.org/wiki/' + shortDateString(currentClickDate).replace(" ", "_") + '">Wikipedia</a>');
    if (events.length == 0) {
        $("#add-form-label").text(shortDateString(currentClickDate));
        drawPopover(null);
    } else {
        eventsBeingEdited = events;
        $("#eventSelector").html("");
        $("#select-month-label").text(shortDateString(currentClickDate));
        for(var i=0; i<events.length; i++) {
            var event = events[i];
            $("#eventSelector").append('<button type="button" class="btn btn-default btn-event" style="white-space: normal;"><i class="fa fa-square" style="color: ' + event.color + '"></i> ' + event.name + '</button>');
        }
        $("#selectModal").modal();
        bindButtonEventHandler();
    }
};

function rebuildEventButtons() {
    var events = getEventsOnDate(currentClickDate);
    eventsBeingEdited = events;
    $("#eventSelector").html("");
    for(var i=0; i<events.length; i++) {
        var event = events[i];
        $("#eventSelector").append('<button type="button" class="btn btn-default btn-event" style="white-space: normal;"><i class="fa fa-square" style="color: ' + event.color + '"></i> ' + event.name + '</button>');
    }
};

function drawTooltip(title) {
    monthTip.setContent(title);
    monthTip.show(); // Shows the tooltip immediately
    //monthTip.reposition();
};

function hideTooltip() {
    monthTip.hide();
};

function displayHighlight(clickDate) {
    var message = shortDateString(clickDate);
    message += "<br>" + lmdGetAge(lifeMapData, clickDate);
    var events = lmdEventSummary(lifeMapData, clickDate);
    if (events) message += events;
    //console.log(message);
    drawTooltip(message);
    highlightMonth(clickDate);
};

function preventBehavior(e) {
    e.preventDefault();
};

function bindLinkEventHandler() {
    $(".launchPopover").click(function() {
        drawSelectPopover(currentClickDate);
    });
};

function bindButtonEventHandler() {
    $(".btn-event").click(function() {
       console.log("poo");
       var name = $(this).text().trim();
       console.log('name' + name);
        var event;
        var foundEvent = false;
        for(var i=0; i<eventsBeingEdited.length; i++) {
            event = eventsBeingEdited[i];
            console.log('ename' + event.name);
            if (event.name.trim() == name) {
                console.log('set event');
                foundEvent = true;
                eventBeingEdited = event;
                break;
            }
        }
        if (foundEvent) {
           console.log('selected: ' + event.name);
           drawPopover(event);
       }
   });
};

$(function() {
    kilomonth.auth = fbRootRef.getAuth();
    setRenderer("block");
    document.addEventListener("touchmove", preventBehavior, false);
    // init
    monthTip = new Opentip($("#months"), {containInViewport: true});
    $('#month-highlight').qtip({
        content: 'My content',
        position: {
            viewport: $(window),
            effect: false,
            adjust: {
                method: 'flipinvert shift'
            }
        },
        style: {
            classes: 'qtip-light qtip-shadow qtip-rounded qt-bigfont'
        },
        api: {
            onRender: function() {
                $this = this;
                var qtiptip = this.elements.tooltip;
                $(this.elements.tooltip).mouseover(function() {
                    //alert($this);
                    $this.destroy();
                });
                this.elements.tooltip.bind("click", this.destroy);
            }
        }
    });
    
    // color picker
    $("#add-color").colorPicker({showHexField: false});
    $("#welcome-color").colorPicker({showHexField: false});
    $('#descEdit').summernote({
       // height: 300
    });
    
    for (i = new Date().getFullYear(); i > 1900; i--)
    {
        $('#welcome-year').append($('<option />').val(i).html(i));
    }
    
    // set event handlers
    EventHandlers.initialBind();
    
    var url = URI(document.URL).query(true);
    kilomonth.mapid = url.mapid;
    if (kilomonth.mapid == "_new") {
        
    } else {
        console.log(kilomonth.auth.uid);
        console.log(kilomonth.mapid);
        fbGetMap(kilomonth.auth.uid, kilomonth.mapid, function(data) {
            lifeMapData = data;
            lmdRehydrate(lifeMapData);
            kilomonth.renderer.drawMap(mapSettings, lifeMapData);
            $("#splash").hide();
            $("#ui").show();
        });
    }
   resize_canvas();
});



