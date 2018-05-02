(function() {
    //put your code here


        function getChartData(data,options,ctx){
        
            // Show the selected statistics by the Pulse user with this widget
            var displayKPIs = data.statistics
                                    .filter((stat) => (options.selectedStatistics.includes(stat.id)));
            //Array[3] [{"id":"Avg_Handle_Time","format":"time","label":"AHT","values":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"id":"Answered","format":"integer","label":"Answered","values":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"id":"Login_Time","format":"time","label":"Login Time","values":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}]
                            
            var displayStatuses = data.statistics
                                    .filter((stat) => (stat.id == "Current_Status"))[0];
            //{"id":"Current_Status","format":"string","label":"Current Status","values":["LoggedOut (1124:22:16)","LoggedOut (1124:22:16)","LoggedOut (1124:22:16)","LoggedOut (95:20:48)","LoggedOut (95:20:48)","LoggedOut (95:20:48)","LoggedOut (95:20:48)","LoggedOut (95:20:48)","LoggedOut (334:39:10)","LoggedOut (334:29:32)","LoggedOut (117:53:15)","LoggedOut (117:53:15)","LoggedOut (117:53:15)","LoggedOut (117:53:15)","LoggedOut (117:53:15)","LoggedOut (117:53:15)","LoggedOut (117:53:15)","LoggedOut (117:53:15)","LoggedOut (117:53:15)","LoggedOut (335:40:07)","LoggedOut (117:53:15)","LoggedOut (117:53:15)","LoggedOut (334:26:55)","LoggedOut (117:53:15)","LoggedOut (117:53:15)","LoggedOut (117:53:15)","LoggedOut (1124:22:16)","LoggedOut (1124:22:16)","LoggedOut (1124:22:16)","LoggedOut (1124:22:16)","LoggedOut (1124:22:16)","LoggedOut (1124:22:16)","LoggedOut (1124:22:16)","LoggedOut (1124:22:16)","LoggedOut (1124:22:16)","LoggedOut (1124:22:16)","LoggedOut (1124:22:16)","LoggedOut (1124:22:16)","LoggedOut (1124:22:16)","LoggedOut (1124:22:16)"]}
            
            // displayData = [{102:{name:"Kristi Sippola", initials:"KSI", status:"WaitForNextCall (1123:52:16)", icon:"grey-color", kpis:"16(Answered) | 00:03:17(AHT)"}},..]
            var displayData = [];

            //For each agent
            for (var i = 0; i < data.objects.length; i++) {             
                var kpis = '';
                displayKPIs.forEach(function(stat){
                    if (stat.format == 'time') {
                        kpis = kpis + seconds2time(stat.values[i]) + '(' + stat.label + ') | ';
                    } else {
                        kpis = kpis + stat.values[i] + '(' + stat.label + ') | ';
                    }
                });
                var _id = data.objects[i].id;
                var input={};

                var initials = getDisplayInfoBy (data,ctx, i);
                input[_id] = {name:data.objects[i].label, status: displayStatuses.values[i], kpis:kpis, initials:initials, icon:getIconColor(displayStatuses.values[i])};
                displayData.push(input);
            }
            if (ctx.hideLoggedOut) {
                    displayData = displayData.filter(filterLoggedOut);
            }

            displayData = getSortedDataBy (displayData, ctx)

            return displayData; 
        }
        
        function getSortedDataBy (displayData, ctx) {

            var res = [];
            switch (ctx.sortBy) {
                case 'name':
                    res = _.sortBy(displayData, function (n) {return _.values(n)[0].name;})
                    break;

                case 'status':
                    res = _.sortBy(displayData, function (n) {return _.values(n)[0].status;})
                    break; 

                default:
                    res = _.sortBy(displayData, function (n) {return _.keys(n)[0] })
                    break; 
            }
            return res;
        }

        // data format: {102:{name:"Kristi Sippola", initials:"KSI", status:"WaitForNextCall (1123:52:16)", icon:"grey-color", kpis:"16(Answered) | 00:03:17(AHT)"}}
        function isLoggedOut(data) {
            var res = false;
            for (var key in data){
                var status = data[key].status;
                res = status.includes('LoggedOut');
            }
            return res;
        }

        function getDisplayInfoBy (data, ctx, i) {
            var initials;
                switch (ctx.displayBy) {
                    case 'name':
                        initials = data.objects[i].label;
                        break;

                    case 'initial':
                        initials = getInitials(data.objects[i].label);
                        break; 

                    default:
                        initials = data.objects[i].id;
                        break; 
                }
            return initials;
        }
        
        function filterLoggedOut(data) {
          return !isLoggedOut(data);
        }
        
        function getStatus (status) {
            if (status.includes('LoggedOut')) {return 'logged_out';}
            if (status.includes('WaitForNextCall')) {return 'ready';}
            if (status.includes('NotReady')) {return 'not_ready';}
            if (status.includes('Ringing') || status.includes('Dialing') || status.includes('Inbound') || status.includes('Outbound') || status.includes('Internal') || status.includes('AfterCall')) {return 'busy';}
        }
        
        function getInitials(name) {
            //name = 'Lejeune, Arnaud'
            return (name.split(',')[1][1] + name.split(',')[0].substring(0,2)).toUpperCase();
        }

        function getIconColor(status) { 
            var res = '';
            switch (getStatus(status)) {
                case 'ready':
                    res = 'green-color';
                    break;
                case 'not_ready':
                    res = 'red-color';
                    break;
                case 'logged_out':
                    res = 'grey-color';
                    break;
                case 'busy':
                    res = 'orange-color';
                    break;
                default:
                    res = 'grey-color';
            }
            return res; 
        }
        
        function removeAgentList(){
            $('#content-dense-status').empty()
        }

        function initializeStatusView(element, data, options) {
        
            var containerDiv = document.createElement('div');
            containerDiv.className = 'dense-status-container';

            var eSortDiv = document.createElement('div');
            eSortDiv.className = 'sort-status-selector';

            var eDisplayDiv = document.createElement('div');
            eDisplayDiv.className = 'display-status-selector';

            var eFilterDiv = document.createElement('div');
            eFilterDiv.className = 'filter-status-toggle';

            var eContentDiv = document.createElement('div');
            eContentDiv.className = 'content-status';
            
            eSortDiv.innerHTML='<span>Sort By</span><select id="sort-status-selector" name="navyOp" class="navyOp">'+
                              '<option value = "id">Id</option>'+
                              '<option value = "name">Name</option>'+
                              '<option value = "status">Status</option>'+
                            '</select>';

            eDisplayDiv.innerHTML='<span>Show</span><select id="display-status-selector" name="displayOp" class="displayOp">'+
                              '<option value = "id">Id</option>'+
                              '<option value = "initial">Initial</option>'+
                              '<option value = "name">Name</option>'
                            '</select>';

            eFilterDiv.innerHTML = '<i class="dense-status fa fa-toggle-on active" id="on" style="display:none;"></i>'+
                            '<i class="dense-status fa fa-toggle-on fa-rotate-180 inactive" id="off" ></i>';
            
            eContentDiv.innerHTML = '<ul id="content-dense-status"></ul>'
            
            element.append(containerDiv);

            element.getElementsByClassName('dense-status-container')[0].append(eDisplayDiv);
            element.getElementsByClassName('dense-status-container')[0].append(eSortDiv);
            element.getElementsByClassName('dense-status-container')[0].append(eFilterDiv);
            element.getElementsByClassName('dense-status-container')[0].append(eContentDiv);

            
            $(document).ready(function(){

               // $(document).on('change', '#display-status-selector', [element, data, options], function(evt, element, data, options){
                 $(document).on('change', '#display-status-selector', function(evt){
                //TODO: Need to call the updateStatusView with parameters
                    removeAgentList();
                });

                $(document).on('change', '#sort-status-selector', function(evt){
                //TODO: Need to call the updateStatusView with parameters
                    removeAgentList();
                }); 


                $('.filter-status-toggle').click(function(){
                    $('.dense-status.inactive, .dense-status.active').toggle();
                    if ($(this)[0].children[1].style.display=='none') {
                            console.log('Filter Logged out agent');
                            removeAgentList();
                            //showAgents(getChartData(data,options,true), element);
                    }
                });
            });

            /*$('#display-status-selector').bind('change', {elt:element, data:data, options:options}, function (evt) {
                console.log('Element data ' + event.data.elt);
            });*/
        }

        function updateStatusView(element, data, options){
            var ctx = {};
            ctx.displayBy = $('#display-status-selector')[0].value;
            ctx.sortBy = $('#sort-status-selector')[0].value;
            ctx.hideLoggedOut = ($('.filter-status-toggle')[0].children[1].style.display == 'none')
            showAgents(getChartData(data,options,ctx),element);
        }

        function drawStatusView(element, data, options) {
          if (element.getElementsByClassName('dense-status-container').length == 0) {
              initializeStatusView(element, data, options);
          } 
          updateStatusView(element, data, options);     
          return true;
        }
        
        function showAgents(displayData,element){
            displayData.forEach (function(data) {
                showAgent(element, data);
            })
        }
        
        // data format: {102:{name:"Kristi Sippola", initials:"KSI", status:"WaitForNextCall (1123:52:16)", icon:"grey-color", kpis:"16(Answered) | 00:03:17(AHT)"}}        
        function isAgentDisplayed(data) {
            var AgentIds = getListElement(document.getElementById('content-dense-status').childNodes);
            var res = false;
            for (var key in data){
                res = AgentIds.includes(key);
            }
            return res;
        }
        
        // data format: {102:{name:"Kristi Sippola", initials:"KSI", status:"WaitForNextCall (1123:52:16)", icon:"grey-color", kpis:"16(Answered) | 00:03:17(AHT)"}}
        function showAgent(element, data) {
            
            if (isAgentDisplayed(data)) {
                // Add a new element if the agent ID is a new one
                for (var key in data) { 
                    var str = '<i class="dense-status fa fa-circle ' + data[key].icon +'"></i><div class="dense-status tooltip">'
                    + data[key].initials + '<span class="dense-status tooltiptext">' + data[key].name + '<br> <i class="dense-status fa fa-circle ' + data[key].icon +'"></i>'+ data[key].status + '<br>'
                    + data[key].kpis + '</span></div>';
                    
                     //update agent status icon
                     element.getElementsByClassName(key)[0].children[0].setAttribute('class','dense-status fa fa-circle ' + data[key].icon)
                     //update agent related information - status and KPIs
                     element.getElementsByClassName(key)[0].getElementsByClassName('tooltiptext')[0].innerHTML = data[key].name + '<br> <i class="dense-status fa fa-circle ' + data[key].icon +'"></i>'+ data[key].status + '<br>'
                    + data[key].kpis;      }           
            
            } else {
                // Add a new element if the agent ID is a new one
                for (var key in data) { 
                    var str = '<i class="dense-status fa fa-circle ' + data[key].icon +'"></i><div class="dense-status tooltip">'
                    + data[key].initials + '<span class="dense-status tooltiptext">' + data[key].name + '<br> <i class="dense-status fa fa-circle ' + data[key].icon +'"></i>'+ data[key].status + '<br>'
                    + data[key].kpis + '</span></div>';
                    var agentLi = document.createElement('li');
                    agentLi.innerHTML = str;
                    agentLi.setAttribute('class', key);
                }           
                $("#content-dense-status").append(agentLi); 
                
            }           
        }

        function seconds2time (seconds) {
            var hours   = Math.floor(seconds / 3600);
            var minutes = Math.floor((seconds - (hours * 3600)) / 60);
            var seconds = seconds - (hours * 3600) - (minutes * 60);
            var time = "";

            if (hours != 0) {
              time = hours+":";
            }
            if (minutes != 0 || time !== "") {
              minutes = (minutes < 10 && time !== "") ? "0"+minutes : String(minutes);
              time += minutes+":";
            }
            if (time === "") {
              time = seconds+"s";
            }
            else {
              time += (seconds < 10) ? "0"+seconds : String(seconds);
            }
            return time;
        }
        
        function getListElement(nodeList){
            var myArray = Array.prototype.map.call( nodeList, function(n){
                return n.className;
            });
            var result = Array.from(new Set(myArray));
            return result;
        }
        

    pulse.extension({
        type: 'WIDGET',
        apiVersion: '8.5.1',
        id: 'CustomWidgetFive',
        label: 'StatusChart',
        icon: 'icon-graph-column',
        require: [
            "https://use.fontawesome.com/64a931f509.js",
            "/pulse-plugin-agent-status/style.css"
        ],
        render: function (element, data, options) {
            //removeStatusChart(element);
            return drawStatusView (element, data, options);
        },
        resize: function (element, data, options) {
            //removeStatusChart(element);
            drawStatusView (element, data, options);
        },

        containerClass: "dense-status",
        constraints: {
            size: {
                minX: 1,
                minY: 2,
                maxX: 4,
                maxY: 4
            },
            objects: {
                min: 1,
                max: 100
            },
            statistics: {
                min: 1,
                max: 4
            },
			groupByObjectsSupport: true
        }
    });


})();
