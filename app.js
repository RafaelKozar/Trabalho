/**
 * Module dependencies.
 */

var express = require('express');
var app = require("./server.js");
var  fs = require('fs');
var cv   = require('cloudcv-backend');

app.use(express.errorHandler());

var io = require('socket.io');
var server = require('http').createServer(app);
server.listen(8888, 'localhost');


io = io.listen(server);


var visitas = 0;

/*io.sockets.on('connection', function(socket) {
 // do all of your socket work in here
 console.emit('message', "MSG");
 //    socket.broadcast.emit("funcao", visitas);
 });
 
 */
io.sockets.on('connection', function(socket) {
    visitas++;
    // Envia o total de visitas para o novo usuário.
    socket.emit('visits', visitas);
    // Envia o total de visitas para os demais usuários.
    socket.broadcast.emit('visits', visitas);

    /*socket.on('enviar', function(msg) {
       console.log(msg);
       //sonsole.log("\n");
    });*/
    socket.on('enviar', function(img) {
        data = img.replace(/^data:image\/png;base64,/, '');    
        
        cv.analyzeImage(data, function(error, result) {
            
            if (error) {
                //response.statusCode = 415; // Unsupported Media Type
                //response.end();
                return;
            }
            
            callback(null, result.histogram);
        });
                
        var filePath = __dirname + '/test.png';        
        
        
         fs.writeFile(filePath, data, 'base64', function(err) {
            if (err) {
                console.log('! Error saving PNG: ' + err);
                //res.json(200, { error: 'Error saving PNG: ' + err });
            } else {
                console.log('> PNG file saved to: ' + filePath);
                //res.json(200, { success: 'PNG file saved to: ' + filePath });
            }
        });
    });
    //console.log(socket);
    // Evento disconnect ocorre quando sai um usuário.
    socket.on('disconnect', function() {
        //  visitas--;
        // Atualiza o total de visitas para os demais usuários.
        socket.broadcast.emit('message', visitas);
    });
});


/*io.sockets.on('connection', function(socket){  
 //can.width  = 200;
 //can.height = 200;
 console.log("1");
 socket.on('fvideo', function(stream){
 // can.getContext('2d').drawImage(stream, 0, 0, can.width, can.height); 
 //var dataUrl = can.toDataURL("image/jpeg");             
 console.log("2"); 
 io.sockets.emit('frame', "msg");            
 });
 
 });*/
