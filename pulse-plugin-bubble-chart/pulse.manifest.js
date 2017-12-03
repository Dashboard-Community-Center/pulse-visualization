(function() {

    function getFormat (format) {
    	switch (format) {
		  case 'time':
		    return 's';
		    break;
		  case 'percent':
		    return '%';
		    break;
		  default:
		    return '';
		    break;
		}
		    	

	}

    function drawBubble(element, data, options) {
        if (!options.selectedObjects || !options.selectedObjects.length) {
            return;
        }
        if (!options.selectedStatistics || !options.selectedStatistics.length) {
            return;
        }
        var objectId = data.objects.findIndex((obj) => {
            return obj.id === options.selectedObjects[0];
        });

        var myStats = data.statistics.filter((statistic) => {
            return options.selectedStatistics.includes(statistic.id);
        });

        var myObjects = data.objects;
        myObjects.forEach(function (object, idx) {
			object.xLabel = myStats[0].label;
			object.xValue = myStats[0].values[idx];
			object.xFormat = myStats[0].format;
			object.yLabel = myStats[1].label;
			object.yValue = myStats[1].values[idx];
			object.yFormat = myStats[1].format;
			object.zLabel = myStats[2].label;
			object.zValue = myStats[2].values[idx];
			object.zFormat = myStats[2].format;
			}
        );

        myObjects = myObjects.filter((obj) => {
            return options.selectedObjects.includes(obj.id);
        });

        var seriesData = [];

        for (var i = 0; i < myObjects.length; i++) {
		   // { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' },
		   var o = {};
		   o.x = myObjects[i].xValue;
		   o.y = myObjects[i].yValue;
		   o.z = myObjects[i].zValue;
		   o.name = myObjects[i].label;
		   o.label = myObjects[i].label;
		   // more statements
		   seriesData.push(o);
		}

       

        Highcharts.chart(element, {
            chart: {
                type: 'bubble',
                plotBorderWidth: 0,
                zoomType: 'xy',
                height: options.height
            },

            title:{
		        text:''
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

            xAxis: {
                gridLineWidth: 1,
                title: {
                    text: myObjects[0].xLabel
                },
                labels: {
                    format: '{value} ' + getFormat(myObjects[0].xFormat)
                }
                
            },

            yAxis: {
                startOnTick: false,
                endOnTick: false,
                title: {
                    text: myObjects[0].yLabel
                },
                labels: {
                    format: '{value} ' + getFormat(myObjects[0].yFormat)
                },
                maxPadding: 0.2
        
            },

            tooltip: {
                useHTML: true,
                headerFormat: '<table>',
                pointFormat: '<tr><th colspan="2"><h3>{point.label}</h3></th></tr>' +
                    '<tr><th>'+ myObjects[0].xLabel +':</th><td>{point.x}</td></tr>' +
                    '<tr><th>'+ myObjects[0].yLabel + ':</th><td>{point.y}</td></tr>' +
                    '<tr><th>'+ myObjects[0].zLabel + ':</th><td>{point.z}%</td></tr>',
                footerFormat: '</table>',
                followPointer: true
            },

            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }
            },

            series: [{
                data: seriesData
            }]


        });

        return true;
    }

    pulse.extension({
        type: 'WIDGET',
        apiVersion: '8.5.1',
        id: 'CustomWidgetBubble',
        label: 'Bubble',
        icon: 'icon-filter',
        require: [
            { Highcharts: "https://code.highcharts.com/highcharts.js" },
            "https://code.highcharts.com/highcharts-more.js"
        ],
        render: function(element, data, options) {
            return drawBubble(element, data, options);
        },
        resize: function(element, data, options) {
            drawBubble(element, data, options);
        },
        constraints: {
            size: {
                minX: 2,
                minY: 2,
                maxX: 4,
                maxY: 4
            },
            objects: {
                min: 5,
                max: 100
            },
            statistics: {
                min: 1,
                max: 3
            }
        }
    });

})();
