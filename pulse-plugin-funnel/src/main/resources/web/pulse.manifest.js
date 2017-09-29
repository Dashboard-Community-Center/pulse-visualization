(function() {
    function drawFunnel(element, data, options) {
        if (!options.selectedObjects || !options.selectedObjects.length) {
            return;
        }
        if (!options.selectedStatistics || !options.selectedStatistics.length) {
            return;
        }
        var objectId = data.objects.findIndex(function (obj) {
            return obj.id === options.selectedObjects[0];
        });

        // Set color theme
        Highcharts.theme = {
             colors: options.theme.chartColors,
             chart: {
                 backgroundColor: options.theme.backgroundColor
             }
         };
        Highcharts.setOptions(Highcharts.theme);

        Highcharts.chart(element, {
            chart: {
                type: 'funnel',
                backgroundColor: options.theme.backgroundColor
            },
            title: {
                text: data.objects[objectId].label,
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b> ({point.y:,.0f})',
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        softConnector: true
                    },
                    center: ['40%', '50%'],
                    neckWidth: '30%',
                    neckHeight: '25%',
                    width: '80%'
                }
            },
            legend: {
                enabled: false
            },
            series: [{
                name: data.objects[objectId].label,
                data: data.statistics.filter(function (statistic) {
                    return options.selectedStatistics.includes(statistic.id);
                }).map(function (statistic) {
                    return [statistic.label, statistic.values[objectId]];
                })
            }]
        });

        return true;
    }

    pulse.extension({
        type: 'WIDGET',
        apiVersion: '8.5.1',
        id: 'CustomFunnel',
        label: 'Funnel',
        icon: 'icon-filter',
        require: [
            {Highcharts: "https://code.highcharts.com/highcharts.js"},
            "https://code.highcharts.com/modules/funnel.js"
        ],
        render: function (element, data, options) {
            return drawFunnel(element, data, options);
        },
        resize: function (element, data, options) {
            drawFunnel(element, data, options);
        },
        constraints: {
            size: {
                minX: 2,
                minY: 2,
                maxX: 4,
                maxY: 4
            },
            objects: {
                min: 1,
                max: 1
            },
            statistics: {
                min: 1,
                max: 10
            }
        }
    });
})();
