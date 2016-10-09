let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let app = express();
let fs = require('fs');


app.use(cors(), bodyParser());

app.get('/',function (req, res){
  fs.readdir("../", function(err, files){
    let transformed = files.map(fileName => {
        return {
          name: fileName,
          type: fileName.indexOf('.') !== -1 ? 'file' : 'directory',
          bc: ''
        };
  });
    if (err) {
      return console.error(err);
    }
    return res.json(transformed);
  });
});

app.get('/read/:bc', function (req, res) {
  object = JSON.parse(req.params.bc);
  name = object.name;
  bc = object.bc;
  fs.readFile('../' + bc + name, function (err, data){
    if (err) {
      return console.error(err);
    }
    return res.end(data)
  });
});

app.get('/directory/:bc', function(req, res){
  object = JSON.parse(req.params.bc);
  name = object.name;
  bc = object.bc;
  fs.readdir('../' + bc + name , function(err, files){
    let transformed = files.map(fileName => {
        return {
          name: fileName,
          type: fileName.indexOf('.') !== -1 ? 'file' : 'directory',
          bc: bc + name,
        };
  });
    if (err) {
      return console.error(err);
    }
    return res.json(transformed);
  });
});


app.listen(3001, console.log('listening'));
