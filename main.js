let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let app = express();
let fs = require('fs');
let path = require('path');

let port = process.env.PORT || 3000;
let root = './';

app.use(cors());
app.use(bodyParser.json());

function isFile(fileName) {
  return fileName.indexOf('.') !== 0 && fileName.indexOf('.') !== -1;
}

function transform(breadcrumb, list) {
  return list.map((item) => {
    return {
      name: item,
      breadcrumb: breadcrumb,
      fullPath: path.join(breadcrumb, item),
      type: isFile(item) ? 'file' : 'directory'
    }
  });
}

app.get('/children', function(req, res, next) {
  let dir = req.query.path ? path.join(root, req.query.path) : root;
  fs.lstat(dir, function(err, result) {
    let isFile = result.isFile();
    let action = isFile ? 'readFile' : 'readdir';
    fs[action](dir, 'utf-8', function(err, result) {
      if(err) { return res.json({ error: err.message }) }
      let finalResult = isFile ? { content: result } : transform(dir, result);
      res.json(finalResult);
    });
  });
});

app.listen(port, () => console.log('listening on port ' + port));