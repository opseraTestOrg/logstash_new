const uuidv4 = require('uuid/v4');
var es = require('elasticsearch');

module.exports.processData = function(req, res){
    var length = 0;
    if(req.body["_index"] == 'junit'){
        if(req.body["data"]["case"]){
            length = req.body["data"]["case"].length
        }
        var string = req.body["log"]["file"]["path"];
        var str = string.split('/');
        var buildNumber = 0;
        for(let i=0;i<str.length;i++){
            if(parseInt(str[i])>0){
                buildNumber = parseInt(str[i])
            }
        }      
        for(let i=0; i<length; i++){
            let body = {
                timestamp : req.body["@timestamp"],
                host : req.body["host"],
                junit : req.body["data"]["case"][i],
                jenkins : {
                    buildNumber : buildNumber, 
                    jobName : 'release-pipeline'
                }
            } 
            var client = new es.Client({
                host: 'http://3.19.123.154:9200', //change to http://localhost:9200
                log : 'trace'
            })
            client.create({
                index : 'junit', 
                type: 'junit', 
                id : uuidv4(), 
                body : body
            }, function(createErr, createRes){
                if(createErr){
                    console.log('Error in creating logs', createErr)
                }
                else{
                    console.log('log created:', createRes)
                }
            })
        }
    }
    else if(req.body["_index"] == 'jmeter'){
        //yet to add codes for jmeter logs..
    }
    res.json(req.body).status(200)
}