let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let app = express();
let fs = require('fs');

let port = process.env.PORT || 3000;
let root = './';

app.use(cors());
app.use(bodyParser.json());

function isFile(fileName) {
  return fileName.indexOf('.') !== 0 && fileName.indexOf('.') !== -1;
}

function transform(list) {
  return list.map((item) => {
    return {
      name: item,
      type: isFile ? 'file' : 'directory'
    }
  });
}

app.get('/directory', function(req, res, next) {
  if(!req.query.root) { return next(); }
  fs.readdir(root, function(err, result) {
    if(err) { return res.json({ error: err.message }) }
    res.json(result);
  });
});

app.all('*', function(req, res) {
  res.status(404);
});

app.listen(port, () => console.log('listening on port ' + port));
