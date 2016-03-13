var YAML = require('yamljs');
var config = require("./configbuilder").getConfig()
var color = require('./colors').color;

var config_mapping = config.mappings;

var allMappings = [];

var defaultConfig = config_mapping.default;

for(var i in config_mapping.requests){
    var req_mapping = config_mapping.requests[i];
    try{
        var mappings = YAML.parseFile(req_mapping);
    }catch(e){
        console.log(color("Problem in loading " + req_mapping, 'Red'))
    }

    if(!mappings || mappings.length == 0){
        console.log(req_mapping + " is an empty file.");
        continue;
    }
    console.log("Loading "+ mappings.length +" mappings from " + req_mapping);

    for(var i=0;i<mappings.length;i++){
        var entry = mappings[i];

        if(typeof entry.response == 'string'){
            entry.response = {
                body: entry.response,
                status: 200,
                latency: 0
            }
        }

        if(typeof entry.request == 'string'){
            entry.request = {
                url: entry.request,
                method: 'GET'
            }
        }


        if(!entry.response.status){
            if(defaultConfig.response.status){
                entry.response['status'] = defaultConfig.response.status;
            }else{
                entry.response['status'] = 200;
            }
        }

        if(!entry.response.latency){
            if(defaultConfig.response.latency){
                entry.response['latency'] = defaultConfig.response.latency;
            }else{
                entry.response['latency'] = 0;
            }
        }

        if(!entry.response.strategy){
            if(defaultConfig.response.strategy){
                entry.response['strategy'] = defaultConfig.response.strategy;
            }else if(entry.response.files){
                entry.response['strategy'] = 'not-found';
            }
        }

        if(!entry.request.method){
            entry.request['method'] = 'GET';
        }

    }

    allMappings = allMappings.concat(mappings);
}
exports.mappings = allMappings;