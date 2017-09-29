package com.genesyslab.wbrt.plugin;

import org.springframework.stereotype.Service;

import com.genesyslab.gax.api.base.BaseGaxPlugin;
import com.genesyslab.gax.common.annotation.BaseURL;

@Service
@BaseURL("/pulse-plugin-funnel")
public class PulsePluginFunnel extends BaseGaxPlugin {

    private final static String PLUGIN_NAME = "pulse-plugin-funnel";

    PulsePluginFunnel () {
        super(PLUGIN_NAME);
    }
}