var EventHandlers = {
    initialBind: function() {
        c = document.getElementById(mapSettings.canvasId);
    
        $('#addModal').on('shown.bs.modal', function () {
            $('#add-eventName').focus();
        });

        $('#welcomeModal').on('shown.bs.modal', function () {
            $('#welcome-name').focus();
        });

        $('#publishModal').on('shown.bs.modal', function () {
            $('#publish-name').focus();
        });
        
        $("#b-share").click(function() {
            $("#publish-name").val(lifeMapData.userName);
            $("#publishModal").modal();
        });

        $("#publish-save").click(function() {
            fbSaveMap($("#publish-name").val(), lifeMapData);
        });

        $("#columnView").click(function() {
            setRenderer("column");
            kilomonth.renderer.drawMap(mapSettings, lifeMapData);
        });

        $("#blockView").click(function() {
            setRenderer("block");
            kilomonth.renderer.drawMap(mapSettings, lifeMapData);
        });

        $("#add-delete").click(function() {
            console.log('delete' + eventBeingEdited.name);
            for (var i = lifeMapData.ranges.length-1; i >= 0; i--) {
                if (lifeMapData.ranges[i].name == eventBeingEdited.name) {
                    lifeMapData.ranges.splice(i, 1);
                    break;
                }
            }
            //$("#selectModal").modal('hide');

            fbSaveMap(kilomonth.auth.uid, kilomonth.mapid, lifeMapData);
            lmdRehydrate(lifeMapData);
            rebuildEventButtons();
            bindButtonEventHandler();
            kilomonth.renderer.drawMap(mapSettings, lifeMapData);
        });
        
        c.addEventListener('mouseout', function(evt) {
            $("#month-highlight").qtip('hide');
        }, false);
        
        // modal dialog
        c.addEventListener('mouseup', function(evt) {
            var mousePos = getMousePos(c, evt);
            var clickDate = kilomonth.renderer.getDateFromClick(mapSettings, lifeMapData, mousePos);
            var message = clickDate;
            console.log(message);
            $("#month-highlight").qtip('hide');
            drawSelectPopover(clickDate);
        }, false);


        // tooltip
        c.addEventListener('mousemove', function(evt) {
            var mousePos = getMousePos(c, evt);
            var clickDate = kilomonth.renderer.getDateFromClick(mapSettings, lifeMapData, mousePos);
            if (clickDate && clickDate != currentClickDate) {
                currentClickDate = clickDate;
                var title = shortDateString(clickDate);
                var message = "";
                title += "<br>" + lmdGetAgo(lifeMapData, clickDate);
                title += " ~ " + lmdGetAge(lifeMapData, clickDate);
                var events = lmdEventSummary(lifeMapData, clickDate);
                if (events) {
                    //message += "<div style='text-align: left!important;'>";
                    message += events;
                    //message += "</div>";
                }
                //console.log(message);
                //drawTooltip(message);
                highlightMonth(clickDate);
                $('#month-highlight').qtip('option', 'content.title', title); 
                $('#month-highlight').qtip('option', 'content.text', message); 
                $("#month-highlight").qtip('show');
               
                // resize images
                
                $('img').each(function(i, item) {
                    $(item).css({
                        'width': '100%'
                    });
                }); 
                
                 $("#month-highlight").qtip('reposition');
                //monthTip.reposition();

            } else {
                hideTooltip();
                $(".month-highlight").hide();
                $("#month-highlight").qtip('hide');
            }
        }, false);

        c.addEventListener('touchstart', handleTouchStart, false);
        c.addEventListener('touchmove', handleTouchMove, false);
        c.addEventListener('touchend', handleTouchEnd, false);


        // event handlers
        $(".launchPopover").click(function() {
            drawSelectPopover(currentClickDate);
        });


       $("#b-addevent").click(function() {
            currentClickDate = new Date();
            drawSelectPopover(currentClickDate);
       });

       $("#mnuLayer").click(function() {
           $("#layersModal").modal();
       });

       $("#editProperties").click(function() {
            $("#welcomeModal").modal();
       });

       $("#b-addevent-d").click(function() {
           // $("#selectModal").modal('hide');
            drawPopover(null);
       });

        $("#add-month").change(function() {
            console.log("change");
            $("#add-end-month").val($("#add-month").val());
        });

        $("#add-year").change(function() {
            $("#add-end-year").val($("#add-year").val());
        });

        $("#add-save").click(function() {
            var eventName = $("#add-eventName").val();
            var month = $("#add-month option:selected").text();
            var year = $("#add-year option:selected").text();
            var end_month = $("#add-end-month option:selected").text();
            var end_year = $("#add-end-year option:selected").text();
            var layer = $("#selectLayer option:selected").val();
            var color = $("#add-color").val();
            var description = $("#descEdit").code();
            if (eventBeingEdited == "_new") {
                var newEvent = {name: eventName, dates: [month + " 1, " + year, end_month + " 1, " + end_year], style: "fill", color: color, description: description};
                console.log(newEvent);
                lifeMapData.ranges.push(newEvent);
            } else {
                var evt = getEventByName(eventBeingEdited.name);
                evt.name = eventName;
                evt.dates = [month + " 1, " + year, end_month + " 1, " + end_year];
                evt.style = "fill";
                evt.color = color;
                evt.description = description;
                evt.layer = layer;
            }
            fbSaveMap(kilomonth.auth.uid, kilomonth.mapid, lifeMapData);
            lmdRehydrate(lifeMapData);
            rebuildEventButtons();
            bindButtonEventHandler();
            kilomonth.renderer.drawMap(mapSettings, lifeMapData);
        });

        $("#welcome-name").keypress(function(event){
            if(event.keyCode == 13) {
              event.preventDefault();
              $("#welcome-month").focus();
              return false;
            }
          });

        $("#add-eventName").keypress(function(event){
            if(event.keyCode == 13) {
              event.preventDefault();
              $("#add-month").focus();
              return false;
            }
          });

        $("#welcome-save").click(function() {
            var userName = $("#welcome-name").val();
            var month = $("#welcome-month option:selected").text();
            var year = $("#welcome-year option:selected").text();
            var color = $("#welcome-color").val();
            var public = $("#welcome-public").is(':checked');
            lifeMapData = {};
            lifeMapData.ranges = [];
            lifeMapData.userName = userName;
            lifeMapData.color = color;
            lifeMapData.public = public;
            lifeMapData.birth = makeShortDate(month, year);
            lifeMapData.birthoffset = lifeMapData.birth.getMonth();
            console.log(lifeMapData);
            kilomonth.mapid = userName;
            fbSaveMap(kilomonth.auth.uid, kilomonth.mapid, lifeMapData);
            kilomonth.renderer.drawMap(mapSettings, lifeMapData);
            $("#splash").hide();
            $("#ui").show();
            $("#tipsModal").modal();
        });

        $("#b-reset").click(function() {
            if (confirm("Are you sure you want to start over?  All events will be deleted.")) {
                lifeMapData = {};
                deleteObject("lifeMapData");
                window.location.reload();
             }
        });
    }
};
