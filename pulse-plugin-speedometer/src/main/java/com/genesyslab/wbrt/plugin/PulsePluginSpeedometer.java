package com.genesyslab.wbrt.plugin;

import org.springframework.stereotype.Service;

import com.genesyslab.gax.api.base.BaseGaxPlugin;
import com.genesyslab.gax.common.annotation.BaseURL;

@Service
@BaseURL("/pulse-plugin-speedometer")
public class PulsePluginSpeedometer extends BaseGaxPlugin {

    private final static String PLUGIN_NAME = "pulse-plugin-speedometer";

    PulsePluginSpeedometer () {
        super(PLUGIN_NAME);
    }
}