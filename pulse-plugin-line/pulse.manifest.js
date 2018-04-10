(function() {
    function drawLine(element, data, options) {
        if (!options.selectedObjects || !options.selectedObjects.length) {
            return;
        }
        if (!options.selectedStatistics || !options.selectedStatistics.length) {
            return;
        }

        var statId = options.selectedStatistics[0];
        var statIdx = data.statistics.findIndex(function (obj) {
            return obj.id === statId;
        });

        var startTime = Date.now() - 15 * 60 * 1000;
        var series = options.selectedObjects.map(function (objectId, idx) {
            var objectIdx = data.objects.findIndex(function (obj) {
                return obj.id === objectId;
            });
            return {
                name: data.objects[objectIdx].label,
                color: options.theme.chartColors[idx],
                data: data.history.get(statId, objectId, {start: startTime}).map(function(point) {
                    return {
                        x: point.time,
                        y: isFinite(point.value) ? point.value : 0
                    };
                })
            };
        });

        if (series.length === 0 || series[0].data.length === 0) {
            return false;
        }

        Highcharts.chart(element, {
            title: {
                text: data.statistics[statIdx].label
            },
            chart: {
                backgroundColor: options.theme.backgroundColor
            },
            xAxis: {
                type: 'datetime'
            },
            time: {
                useUTC: false
            },
            series: series,
        });

        return true;
    }

    pulse.extension({
        type: 'WIDGET',
        apiVersion: '9.0.0',
        id: 'HistoryExample',
        label: 'History',
        icon: 'icon-graph-line',
        require: [{
            Highcharts: "https://code.highcharts.com/highcharts.js"
        }],
        render: function (element, data, options) {
            return drawLine(element, data, options);
        },
        resize: function (element, data, options) {
            drawLine(element, data, options);
        },
        constraints: {
            size: {
                minX: 2,
                minY: 2,
                maxX: 2,
                maxY: 2
            },
            objects: {
                min: 1,
                max: 5
            },
            statistics: {
                min: 1,
                max: 1
            }
        }
    });

})();
