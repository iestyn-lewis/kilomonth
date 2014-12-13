var ColumnRenderer = {
    drawMap: function(mapSettings, lmd, c) {
        var lifeMapData = lmd.data;
        var availableHeight = window.innerHeight - 120;
        var availableWidth = window.innerWidth - 50 - mapSettings.yearColumns * mapSettings.textGutterSize;
        console.log('aw: ' + availableWidth);

        mapSettings.yearColumns = 4;

        var maxMonthHeight = Math.floor(availableHeight / (mapSettings.yearsShown / mapSettings.yearColumns));
        var maxMonthWidth = Math.floor(availableWidth / (mapSettings.yearColumns * 12));
        var monthSize =  Math.max(Math.min(maxMonthHeight, maxMonthWidth), 9);
        //monthSize = 30;
        mapSettings.monthSize = monthSize;
        $("#userName").text(lifeMapData.userName);
        var today = new Date();
        $("#monthsAlive").text(DateDiff.inMonths(lifeMapData.birth, today));

        $('#add-year').html("");

        $('#add-end-year').html("");
        for (i = lifeMapData.birth.getFullYear() + 83; i >= lifeMapData.birth.getFullYear(); i--)
        {
            $('#add-year').append($('<option />').val(i).html(i));
            $('#add-end-year').append($('<option />').val(i).html(i));
        }

        c.width = mapSettings.textGutterSize * mapSettings.yearColumns + mapSettings.yearColumns * 12 * (mapSettings.monthSize + mapSettings.padSize) + 1;
        c.height = mapSettings.yearsShown / mapSettings.yearColumns * (mapSettings.monthSize + mapSettings.padSize) + 1;
        ctx = c.getContext("2d");
        var today = new Date();
        var thisMonth = DateDiff.inMonths(lifeMapData.birth, today);

        var size = mapSettings.monthSize;
        var pad = mapSettings.padSize;
        var rows = mapSettings.yearsShown / mapSettings.yearColumns;
        var columns = mapSettings.yearColumns * 12;
        var colors, colorCount;
        var currentAge, currentYear;

        currentAge = 0;
        currentYear = lifeMapData.birth.getFullYear();
        var year, month, x, y, textx;
        for (var yearCol = 0; yearCol < mapSettings.yearColumns; yearCol ++) {
            console.log('yearCol: ' + yearCol);
            for (var dyear = 0; dyear < rows; dyear++) {
                for (var dmonth = 0; dmonth < 12; dmonth++) {
                    year = (yearCol * rows) + dyear;
                    month = dmonth;
                    //console.log('year: ' + year + 'month: ' + month);
                    colors = [];
                    elapsed = year * 12 + month - lifeMapData.birthoffset;
                    //console.log(elapsed);
                    ctx.fillStyle = mapSettings.defaultDarkColor;
                    // months before birth
                    if (year == 0 && month < lifeMapData.birthoffset) {
                        ctx.fillStyle = mapSettings.defaultLightColor;
                    }
                    // months after this one
                    if (elapsed >= thisMonth) {
                        ctx.fillStyle = mapSettings.defaultLightColor;
                    }
                    // x and y positions for the top left of this month
                    x = mapSettings.textGutterSize + (yearCol * mapSettings.textGutterSize) + pad + month * (size + pad) + yearCol * 12 * (size + pad);
                    textx = 12 + yearCol * (mapSettings.textGutterSize + 12 * (size + pad));
                    y = pad + dyear * (size + pad);
                    // console.log('year: ' + year + 'month: ' + month + 'x: ' + x + 'y: ' + y);
                    // marked months
                    var dict = lmd.eventDictionary;
                    var arr = dict[elapsed];
                    if (arr) {
                        for(var e=0; e<arr.length; e++) {
                            if (km.layers.layerIsVisible(arr[e].layer)) {
                                ctx.fillStyle = arr[e].color;
                                colors.push(arr[e].color);
                            }
                        }
                    }
                    colorCount = Math.max(colors.length, 1);
                    var cOffset = size / colorCount;
                    if (colorCount > 1) {
                        for(var c = 0; c<colorCount; c++) {
                            ctx.fillStyle = colors[c];
                            ctx.fillRect(x, y + (c * cOffset), size, cOffset);
                        }
                    } else {
                        ctx.fillRect(x, y, size, size);
                        //canvasRoundRect(ctx, pad + month * size + month * pad, pad + year * size + year * pad, size, size, 5, true, false);
                    }
                    // years
                    ctx.font = '10pt Arial';
                    ctx.fillStyle = "#666666";
                    ctx.fillText("'" + String(currentYear).substring(4, 2) + ' / ' + currentAge, textx, y + 12);

                    // birth
                    if (month == lifeMapData.birthoffset && year == 0) {
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect(x + 3, y + 3, size-6, size-6);
                    }
                    // this month
                    if (elapsed == thisMonth) {
                        ctx.fillStyle = mapSettings.thisMonthColor;
                        ctx.fillRect(x + 3, y + 3, size-6, size-6);
                    }                
                }
                currentAge++;
                currentYear++;
            }
        }
    },

    getDateFromClick: function(mapSettings, lifeMapData, mousePos) {
        lifeMapData = lifeMapData.data;
        var monthSize = mapSettings.monthSize + mapSettings.padSize;
        var textSize = mapSettings.textGutterSize;
        var colSize = textSize + 12 * monthSize;
        var col = Math.floor(mousePos.x / colSize);
        console.log('col: ' + col);
        var xminusCol = mousePos.x - (col * colSize);
        var xinCol = xminusCol - textSize;
        console.log('xmc: ' + xinCol);
        // mouse is in the text gutter
        if (xinCol <= 0)
            return null;
        //console.log( mousePos.x - 1 / monthSize);
        var yearsPerCol = mapSettings.yearsShown / mapSettings.yearColumns;
        var prevMonths = col * 12 * yearsPerCol;
        var monthX = Math.floor((xinCol-1) / monthSize);
        var monthY = Math.floor((mousePos.y-1) / monthSize);
        var monthOffset = prevMonths + (12 * monthY) + monthX;
        var startDate = new Date("January 1, " + lifeMapData.birth.getFullYear());
        return startDate.add(monthOffset).months();
    },

    getXYFromDate: function(mapSettings, lifeMapData, monthDate) {
        lifeMapData = lifeMapData.data;
        var startDate = new Date("January 1, " + lifeMapData.birth.getFullYear());
        var offset = DateDiff.inMonths(startDate, monthDate);
        var monthsPerCol = (mapSettings.yearsShown / mapSettings.yearColumns) * 12;
        var monthSize = mapSettings.monthSize + mapSettings.padSize;
        var textSize = mapSettings.textGutterSize;
        var colSize = textSize + 12 * monthSize;
        var coloffset = Math.floor(offset / monthsPerCol);
        var xColOffset = coloffset * colSize;
        var inCol = offset % monthsPerCol;


        var monthY = Math.floor(inCol/12);
        var monthX = inCol % 12;

        var x = xColOffset + textSize + monthX * monthSize;
        var y = monthY * monthSize;
        return {
            x: x,
            y: y
        }
    }
};
