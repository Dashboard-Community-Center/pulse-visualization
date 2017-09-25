# pulse-visualization
This repository contains Pulse visualizations to share on the Dashboard Community Center

I am often asked by Genesys customers if they can add their own visualization into Pulse and so far we were limited to expose external visualization into a Pulse iframe widget. Usually, the user experience is not great and requires the customer to host its own application on different servers.

It is really powerful plugin mechanism but it requires a little bit of practice to get used to it so I will try to describe it as best as I can.
 
## High Level Summary

1. Create your own plugin with the utility script provided in your Pulse package - plugin-generator.js
2. Implement the new visualization with your own front-end library. In our case, we are using an existing library - Highcharts Treemap (https://www.highcharts.com/demo/heatmap) but it is open to any library.
3. Update the pulse.manifest.js file to render the customized visualization
4. Generate plugin .jar file with maven.
5. Deploy the new plugin .jar file into Pulse application folders

This repository helps onboarding users to quickly learn how to implement Pulse visualization with examples and existing visualizations published on the [Genesys Dashboard Community Center](http://community.demo.genesys.com/pulse/visualizations/).

