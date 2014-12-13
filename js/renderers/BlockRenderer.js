var BlockRenderer = {
    drawMap: function(mapSettings, lmd, c) {
        var lifeMapData = lmd.data;
        var availableHeight = window.innerHeight - 100;
        var availableWidth = window.innerWidth - 50;
        mapSettings.yearColumns = 4;
        var htRatio = availableWidth / availableHeight;
        if (htRatio < 1.15)
            mapSettings.yearColumns = 2;


        var maxMonthHeight = Math.floor(availableHeight / (mapSettings.yearsShown / mapSettings.yearColumns));
        var maxMonthWidth = Math.floor(availableWidth / (mapSettings.yearColumns * 12));
        var monthSize = Math.max(Math.min(maxMonthHeight, maxMonthWidth), 9);
        //monthSize = 30;
        mapSettings.monthSize = monthSize;

        $('#add-year').html("");

        $('#add-end-year').html("");
        for (i = lifeMapData.birth.getFullYear() + 83; i >= lifeMapData.birth.getFullYear(); i--)
        {
            $('#add-year').append($('<option />').val(i).html(i));
            $('#add-end-year').append($('<option />').val(i).html(i));
        }

        c.width = mapSettings.yearColumns * 12 * (mapSettings.monthSize + mapSettings.padSize) + 1;
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
        for (var year = 0; year < rows; year++) {
            for (var month = 0; month < columns; month ++) {
                if (month % 12 == 0 && !(year == 0 && month < 12)) {
                    currentAge++;
                    currentYear++;
                }
                colors = [];
                elapsed = year * columns + month - lifeMapData.birthoffset;
                ctx.fillStyle = mapSettings.defaultDarkColor;
                // months before birth
                if (year == 0 && month < lifeMapData.birthoffset) {
                    ctx.fillStyle = mapSettings.defaultLightColor;
                }
                // months after this one
                if (elapsed >= thisMonth) {
                    ctx.fillStyle = mapSettings.defaultLightColor;
                }
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
                        ctx.fillRect(pad + month * size + month * pad, pad + year * size + year * pad + (c * cOffset), size, cOffset);
                    }
                } else {
                    ctx.fillRect(pad + month * size + month * pad, pad + year * size + year * pad, size, size);
                    //canvasRoundRect(ctx, pad + month * size + month * pad, pad + year * size + year * pad, size, size, 5, true, false);
                }
                // new years
                if (month % 12 == 0 && month != 0) {
                    ctx.fillStyle = "#ffffff"
                    ctx.fillRect(pad + month * size + month * pad, pad + year * size + year * pad, pad, size);
                }
                // birthdays
                if (month % 12 == lifeMapData.birthoffset && currentAge != 0) {
                     ctx.font = '10pt Libre Baskerville';
                     ctx.fillStyle = "#ffffff";
                    ctx.fillStyle = mapSettings.thisMonthColor;
                    //ctx.fillRect(pad + month * size + month * pad + 3, pad + year * size + year * pad + 3, size-6, size-6);
                     //ctx.fillText(currentAge, (pad + month * size + month * pad) + 2, (pad + year * size + year * pad) + 14);
                }
                // birth
                if (month == lifeMapData.birthoffset && year == 0) {
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(pad + month * size + month * pad + 3, pad + year * size + year * pad + 3, size-6, size-6);
                }
                // this month
                if (elapsed == thisMonth) {
                    ctx.fillStyle = mapSettings.thisMonthColor;
                    ctx.fillRect(pad + month * size + month * pad + 3, pad + year * size + year * pad + 3, size-6, size-6);
                }
            }
        }
    },
    
    getDateFromClick: function(mapSettings, lmd, mousePos) {
        var lifeMapData = lmd.data;
        var monthSize = mapSettings.monthSize + mapSettings.padSize;
        //console.log( mousePos.x - 1 / monthSize);
        var monthX = Math.floor((mousePos.x-1) / monthSize);
        var monthY = Math.floor((mousePos.y-1) / monthSize);
        var monthsPerRow = mapSettings.yearColumns * 12;
        var monthOffset = monthY * monthsPerRow + monthX;
        var startDate = new Date("January 1, " + lifeMapData.birth.getFullYear());
        return startDate.add(monthOffset).months();    
    },

    getXYFromDate: function(mapSettings, lmd, monthDate) {
        var lifeMapData = lmd.data;
        var startDate = new Date("January 1, " + lifeMapData.birth.getFullYear());
        var offset = DateDiff.inMonths(startDate, monthDate);
        var monthY = Math.floor(offset/(mapSettings.yearColumns * 12));
        var monthX = offset % (mapSettings.yearColumns * 12);
        var x = monthX * (mapSettings.monthSize + 1);
        var y = monthY * (mapSettings.monthSize + 1);
        return {
            x: x,
            y: y
        }
    }
};
