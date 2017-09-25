# pulse-visualization
This repository contains Pulse visualizations to share on the Dashboard Community Center

I am often asked by Genesys customers if they can add their own visualization into Pulse and so far we were limited to expose external visualization into a Pulse iframe widget. Usually, the user experience is not great and requires the customer to host its own application on different servers.
Today, Pulse team came up with a powerful plugin mechanism to extend the native library of widget type and can be really handy for many use cases.
See below an example of widget used by customers to monitor the # agents by status across several teams with a customized heatmap visualization. It helps supervisors to visualize at a glance if his teams are properly staffed or not to handle the customer inquiries.

It is really powerful plugin mechanism but it requires a little bit of practice to get used to it so I will try to describe it as best as I can.
It is not easy to debug your application because you don't have the code source in the dev console, mainly for optimization purpose, so I suggest to write the plugin step by step to minimize errors and log as much information as possible into the dev console (don't forget to remove them once deployed in production).
 
## High Level Summary

1. STEP 1 - Create your own plugin with the utility script provided in your Pulse package - plugin-generator.js
2. STEP 2 - Implement the new visualization with your own front-end library. In our case, we are using an existing library - Highcharts Treemap (https://www.highcharts.com/demo/heatmap) but it is open to any library.
3. STEP 3 - Update the pulse.manifest.js file to render the customized visualization
4. STEP 4 - Generate plugin .jar file with maven.
5. STEP 5 - Deploy the new plugin .jar file into Pulse application folders

This repository helps onboarding users to quickly learn how to implement Pulse visualization with examples and existin visualizations.

