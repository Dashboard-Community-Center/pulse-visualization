(function() {
    
    // Respective to highcharts visualization 
    // http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/heatmap/

    function drawHeatMap(element, data, options) {

        if (!options.selectedObjects || !options.selectedObjects.length) {
            return;
        }
        if (!options.selectedStatistics || !options.selectedStatistics.length) {
            return;
        }

        /*console.log('data: '); 
        console.log (data);
        console.log('options: '); 
        console.log (options);*/

        // Show the selected objects by the Pulse user with this widget
        var displayObjects = data.objects
                                .filter((object) => options.selectedObjects.includes(object.id));
        
        // Show the selected statistics by the Pulse user with this widget
        var displayStats = data.statistics
                                .filter((stat) => options.selectedStatistics.includes(stat.id));
                                
        // Generate the data structure to be displayed in highcharts
        //[[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96], [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30], [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84], [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]],

        var displayData = [];

        for (var i = 0; i < displayObjects.length; i++) {
            for (var j = 0; j < displayStats.length; j++) {
                displayData.push([i,j,displayStats[j].values[i]]);
            }    
        }
    

        var xObjectScale = displayObjects.map((object) => object.label);
        var yStatScale = displayStats.map((stat) => stat.label);

        //console.log(xObjectScale);
        //console.log(yStatScale);

        //Show generated data to be displayed in the chart based on snapshot data
        //console.log('displayed data');
        //console.log(displayData);

    	Highcharts.chart(element, {

		    chart: {
		        type: 'heatmap',
		        height: options.height,
                marginTop: 10,
		        marginBottom: 100,
		        plotBorderWidth: 1
		    },

		    title: {
                text: '',
            },

		    xAxis: {
		        categories: xObjectScale
		    },

		    yAxis: {
		        categories: yStatScale,
		        title: null
		    },

		    colorAxis: {
		        min: 0,
		        minColor: '#FFFFFF',
		        maxColor: Highcharts.getOptions().colors[0]
		    },

		    legend: {
		        align: 'right',
		        layout: 'vertical',
		        margin: 0,
		        verticalAlign: 'top',
		        y: 25,
		        symbolHeight: 280
		    },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> has <br><b>' +
                        this.point.value + '</b> agents in the <br><b>' + this.series.yAxis.categories[this.point.y] + ' status </b>';
                }
            },

		    series: [{
		        name: 'Sales per employee',
		        borderWidth: 1,
		        data: displayData,
		        dataLabels: {
		            enabled: true,
		            color: '#000000'
		        }
		    }]

        });

        return true;

    }


    pulse.extension({
        type: 'WIDGET',
        apiVersion: '8.5.1',
        id: 'CustomHeatMap',    // must be unique across your custom widget type
        label: 'TreeMap',       // label displayed in the options
        icon: 'icon-dialpad',   // icons displayed in the options http://ark.genesys.com/#/iconography
        
        // external libraries used. Use object when your library exposes global variable
        require: [
            {Highcharts: "https://code.highcharts.com/highcharts.js"},
            "https://code.highcharts.com/modules/heatmap.js"
        ],
        
        // function called to render the new visualization
        render: function (element, data, options) {
            return drawHeatMap(element, data, options);
        },
        
        // function called when widget is being moved or resized
        resize: function (element, data, options) {
            drawHeatMap(element, data, options);
        },
        constraints: {
        
            // define min and max size allowed by your visualization
            size: {
                minX: 2,
                minY: 2,
                maxX: 4,
                maxY: 4
            },
            // define the min and max objects which can be selected by the users to adjust the real-state of the visualization
            objects: {
                min: 1,
                max: 10
            },
            // define the min and max stats which can be selected by the users to adjust the real-state of the visualization
            statistics: {
                min: 1,
                max: 10
            }
        }
    });

})();
