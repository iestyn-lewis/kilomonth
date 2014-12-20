var ViewMap = {
    init : function() {},
    
    bind : function() {
        this.$splashDiv = $("#splash");
        this.$uiDiv = $("#ui");
        this.$canvas = document.getElementById("months");
        this.$monthHighlight = $("#month-highlight");
        
        this.$mnuColumnView = $("#columnView");
        this.$mnuBlockView = $("#blockView");
              
        // event handlers
        this.$mnuColumnView.click(function() {
            this.setRenderer("column");
            this.toCtls();
        }.bind(this));
        
        this.$mnuBlockView.click(function() {
            this.setRenderer("block")
            this.toCtls();
        }.bind(this));

        $("#editInfo").click(this.showInfoDialog.bind(this));
        
        this.$canvas.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
        this.$canvas.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
        this.$canvas.addEventListener('mouseout', this.handleMouseOut.bind(this), false);
        
        $(window).on('mapupdated', this.toCtls.bind(this));
        
    },
    
    setModels : function(lifeMapData, mapSettings) {
        this.lifeMapData = lifeMapData;
        this.mapSettings = mapSettings;
        this.readOnly = true;
        if (km.authenticatedUser)  {
            if (lifeMapData.info.uid == km.authenticatedUser.uid) {
                this.readOnly = false;
             }
        }
        this.setRenderer(this.mapSettings.renderer);
    },
    
    showInfoDialog : function() {
        if (!this.readOnly) {
            ViewMapInfo.setModel(this.lifeMapData);
            ViewMapInfo.showDialog();
        }
    },
    
    showStartScreen : function() {
        $("#tipsModal").modal();
    },
    
    setRenderer : function(touse) {
        switch (touse) {
            case "column":
                this.renderer = ColumnRenderer;
                break;
            case "block":
                this.renderer = BlockRenderer;
                break;
        }       
    },
    
    toCtls : function() {
        if (this.lifeMapData) {
            if (this.readOnly) {
                $("#b-share").hide();
            }
            $("#userName").text(this.lifeMapData.info.name);
            var today = new Date();
            $("#monthsAlive").text(DateDiff.inMonths(this.lifeMapData.data.birth, today));
            this.renderer.drawMap(this.mapSettings, this.lifeMapData, this.$canvas);
            this.$splashDiv.hide();
            this.$uiDiv.show();
        } else {
            this.$splashDiv.show();
            this.$uiDiv.hide();
        }
    },
    
    handleMouseMove : function(evt) {
        var c = this.$canvas;
        var lmd = this.lifeMapData;
        var mousePos = CanvasUtils.getMousePos(c, evt);
        var clickDate = this.renderer.getDateFromClick(this.mapSettings, this.lifeMapData, mousePos);
        if (clickDate && clickDate != this.currentClickDate) {
            this.currentClickDate = clickDate;
            var title = DateUtils.shortDateString(clickDate);
            var message = "";
            title += "<br>" + lmd.getAgo(clickDate);
            title += " ~ " + lmd.getAge(clickDate);
            var events = lmd.eventsOnDate(clickDate);
            if (events) {
                message += events.summary();
            }
            this.highlightMonth(clickDate);
            this.displayTooltip(title, message);
        } else {
            this.hideHighlight();
        }
    },
    
    handleMouseUp : function(evt) {
        var c = this.$canvas;
        var mousePos = CanvasUtils.getMousePos(c, evt);
        var clickDate = this.renderer.getDateFromClick(this.mapSettings, this.lifeMapData, mousePos);
        var message = clickDate;
        this.hideHighlight();
        var events = this.lifeMapData.eventsOnDate(clickDate);
        if (this.readOnly) {
            if (events) {
                ViewEventsRO.setModel(this.lifeMapData, events);
                ViewEventsRO.showDialog();
            }
        } else {
            if (events) {
                ViewEvents.setModel(this.lifeMapData, events);
                ViewEvents.showDialog();
            } else {
                ViewEvent.setModel(this.lifeMapData, this.lifeMapData.newEvent(clickDate));
                ViewEvent.showDialog();
            }
        }
    }, 
    
    handleMouseOut : function(evt) {
        this.hideHighlight();       
    },
    
    hideHighlight : function() {
        $(".qtip").hide();
        this.$monthHighlight.css('visibility', 'hidden');
    },
    
    highlightMonth : function(monthDate) {
        if (!this.highlightedMonth) {
            this.drawRectAroundMonth(monthDate, this.mapSettings.highlightColor);
            this.highlightedMonth = monthDate;
        } else {
            if (Math.abs(DateDiff.inMonths(this.highlightedMonth, monthDate)) > 0) {
                this.drawRectAroundMonth(monthDate, this.mapSettings.highlightColor);
                this.highlightedMonth = monthDate;
           }
        }
    },
    
    drawRectAroundMonth : function(monthDate, color) {
        var rect = this.$canvas.getBoundingClientRect();
        var pos = this.renderer.getXYFromDate(this.mapSettings, this.lifeMapData, monthDate);
        var ht = this.$monthHighlight;
        //console.log(pos);
        ht.css('visibility', 'visible');
        ht.css({top: pos.y + rect.top, left: pos.x + rect.left, height: this.mapSettings.monthSize + 3, width: this.mapSettings.monthSize + 3});
        ht.show();
    },
    
    displayTooltip : function(title, message) {
        this.$monthHighlight.qtip('option', 'content.title', title); 
        this.$monthHighlight.qtip('option', 'content.text', message === "" ? " " : message); 
        this.$monthHighlight.qtip('show');
        // resize images
        $('img').each(function(i, item) {
            $(item).css({
                'width': '100%'
            });
        }); 
        this.$monthHighlight.qtip('reposition');
    }
};