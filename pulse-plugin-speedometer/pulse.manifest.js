(function() {
    function drawSpeedometer(element, data, options) {
        if (!options.selectedObjects || !options.selectedObjects.length) {
            return;
        }
        if (!options.selectedStatistics || !options.selectedStatistics.length) {
            return;
        }
        var objectId = data.objects.findIndex(function (obj) {
            return obj.id === options.selectedObjects[0];
        });
        var statId = data.statistics.findIndex(function (obj) {
            return obj.id === options.selectedStatistics[0];
        });

        var ranges = [];
        if (data.statistics[statId].ranges) { //process thresholds
            ranges = Object.keys(data.statistics[statId].ranges).map(function (key) {
                return {
                    color: data.statistics[statId].ranges[key].color,
                    from: data.statistics[statId].ranges[key].from  === undefined ?
                        Math.min.apply(this, [0].concat(data.statistics[statId].values)) : data.statistics[statId].ranges[key].from,
                    to: data.statistics[statId].ranges[key].to === undefined ?
                        Math.max.apply(this, [0].concat(data.statistics[statId].values)) : data.statistics[statId].ranges[key].to,
                };
            });
        }

        Highcharts.chart(element, {
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false,
                backgroundColor: options.theme.backgroundColor
            },

            title: {
                text: data.objects[objectId].label
            },

            pane: {
                startAngle: -150,
                endAngle: 150,
                background: [{
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#FFF'],
                            [1, '#333']
                        ]
                    },
                    borderWidth: 0,
                    outerRadius: '109%'
                }, {
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#333'],
                            [1, '#FFF']
                        ]
                    },
                    borderWidth: 1,
                    outerRadius: '107%'
                }, {
                    // default background
                }, {
                    backgroundColor: '#DDD',
                    borderWidth: 0,
                    outerRadius: '105%',
                    innerRadius: '103%'
                }]
            },

            // the value axis
            yAxis: {
                min: 0,
                max: Math.max.apply(this, data.statistics[statId].values),

                minorTickInterval: 'auto',
                minorTickWidth: 1,
                minorTickLength: 10,
                minorTickPosition: 'inside',
                minorTickColor: '#666',

                tickPixelInterval: 30,
                tickWidth: 2,
                tickPosition: 'inside',
                tickLength: 10,
                tickColor: '#666',
                labels: {
                    step: 2,
                    rotation: 'auto'
                },
                title: {
                    text: data.statistics[statId].label
                },
                plotBands: ranges
            },
            series: [{
                name: data.statistics[statId].label,
                data: [data.statistics[statId].values[objectId]],
            }]
        });

        return true;
    }

    pulse.extension({
        type: 'WIDGET',
        apiVersion: '8.5.1',
        id: 'CustomSpeedometer',
        label: 'Speedometer',
        icon: 'icon-status-queue-empty',
        require: [
            {Highcharts: "https://code.highcharts.com/highcharts.js"},
            "https://code.highcharts.com/highcharts-more.js"
        ],
        render: function (element, data, options) {
            return drawSpeedometer(element, data, options);
        },
        resize: function (element, data, options) {
            drawSpeedometer(element, data, options);
        },
        constraints: {
            size: {
                minX: 1,
                minY: 2,
                maxX: 2,
                maxY: 3
            },
            objects: {
                min: 1,
                max: 1
            },
            statistics: {
                min: 1,
                max: 1
            }
        }
    });

})();
