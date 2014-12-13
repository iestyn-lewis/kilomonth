var ViewEvents = {
    init : function() {},
    
    bind : function() {
        this.$dialog = $("#selectModal");
        this.$eventSelector = $("#eventSelector");
        this.$wikiLink = $(".wiki");
        this.$dialogLabel = $("#select-month-label");
        this.$btnAddEvent = $("#b-addevent-d");
        
        this.$btnAddEvent.click(function(evt) {
            ViewEvent.setModel(this.lifeMapData, Event.newEvent(null, this.events.eventsDate));
            ViewEvent.showDialog();
        }.bind(this));
        
        $(window).on('mapupdated', function() {
            if (this.events) {
                this.events = this.lifeMapData.eventsOnDate(this.events.eventsDate);
                var events = this.events;
                if (events) {
                    this.toCtls();
                } else {
                    this.$dialog.modal('hide');
                }
            }
        }.bind(this));
    },
    
    setModel : function(lmd, model) {
        this.lifeMapData = lmd;
        this.events = model;
    },
    
    showDialog : function() {
        this.toCtls();
        this.$dialog.modal();
    },
    
    toCtls : function() {
        var clickDate = this.events.eventsDate;
        var events = this.events.events;
        var dateString = DateUtils.shortDateString(clickDate);
        this.$wikiLink.html('<a target="_new" href="http://en.wikipedia.org/wiki/' + dateString.replace(" ", "_") + '">Wikipedia</a>');
        this.$eventSelector.html("");
        this.$dialogLabel.text(dateString);
        if (events) {
            for(var i=0; i<events.length; i++) {
                var event = events[i];
                this.$eventSelector.append('<button type="button" class="btn btn-default btn-event" style="white-space: normal;"><i class="fa fa-square" style="color: ' + event.color + '"></i> ' + event.name + '</button>');
            }
            this.bindButtonEventHandler();
        }
    },
    
    bindButtonEventHandler : function() {
        $(".btn-event").click(function() {
           var name = $(this).text().trim();
           console.log('name' + name);
            var event;
            var foundEvent = false;
            var eventsBeingEdited = ViewEvents.events.events;
            var eventBeingEdited;
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
               ViewEvent.setModel(ViewEvents.lifeMapData, event);
               ViewEvent.showDialog();
           }
       });
    }
};