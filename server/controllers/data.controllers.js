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
                host: 'http://localhost:9200', //change to http://localhost:9200
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
    //if(req.body["_index"] == 'jmeter')
    else{
        if(req.body["data"]["httpSample"]){
            length = req.body["data"]["httpSample"].length
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
                jenkins : {
                    buildNumber : buildNumber,
                    jobName : 'release-pipeline'
                },
                jmeter : {
                    testResults : req.body["data"]["httpSample"][i], 
                }   
            } 
            body.jmeter.testResults["_t"] = parseInt(body.jmeter.testResults["_t"])
            body.jmeter.testResults["_it"] = parseInt(body.jmeter.testResults["_it"])
            body.jmeter.testResults["_lt"] = parseInt(body.jmeter.testResults["_lt"])
            body.jmeter.testResults["_ct"] = parseInt(body.jmeter.testResults["_ct"])
            body.jmeter.testResults["_by"] = parseInt(body.jmeter.testResults["_by"])
            body.jmeter.testResults["_sby"] = parseInt(body.jmeter.testResults["_sby"])
            body.jmeter.testResults["_ng"] = parseInt(body.jmeter.testResults["_ng"])
            body.jmeter.testResults["_na"] = parseInt(body.jmeter.testResults["_na"])
            var client = new es.Client({
                host: 'http://localhost:9200', //change to http://localhost:9200 http://3.19.123.154:9200
                log : 'trace'
            })
            client.create({
                index : 'jmeter', 
                type: 'jmeter', 
                id : uuidv4(), 
                body : body
            }, function(createErr, createRes){
                if(createErr){
                    console.log('Error in creating logs', createErr)
                    // res.status(400).json({msg: 'ERROR IN CREATING LOGS'})
                }
                else{
                    console.log('log created:', createRes)
                }
            })
        }
    }
    res.json(req.body).status(200)
}