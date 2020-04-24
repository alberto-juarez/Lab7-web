const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const jsonParser = bodyParser.json();
const apiKey = "2abbf7c3-245b-404f-9473-ade729ed4653";


function keyManager(req, res, next){
  console.log("imsiode");
  let authKey = req.headers.authorization;
  let bookapiKey = req.headers['book-api-key'];
  let queryKey = req.query.apiKey;

  if (!authKey && !bookapiKey && !queryKey){
    res.statusMessage = "No key was provided";
    return res.status(401).end();
  }



  if (authKey ){
    if (authKey !== `Bearer ${apiKey}`){
      res.statusMessage = "The key provided is not valid";
      return res.status(401).end();
    }
  }


  if (bookapiKey){
    if(bookapiKey !== apiKey){
      res.statusMessage = "The key provided is not valid";
      return res.status(401).end();
    }
  }


  if (queryKey){
    if (queryKey !== apiKey){
      res.statusMessage = "The key provided is not valid";
      return res.status(401).end();
    }
  }



  next();
};

const app = express();

app.use( morgan('dev'));
app.use(keyManager);

let bookmarks = [
  {
    id : uuid.v4(),
    title : "Best song ever",
    description : "One of my favorite songs at the moment",
    url : 'https://www.youtube.com/watch?v=btIQvYcLNoI',
    rating : 10
  },
  {
    id : uuid.v4(),
    title : "Apple",
    description : "Main website for Apple",
    url : 'https://apple.com',
    rating : 7
  },
  {
    id : uuid.v4(),
    title : "Gmail",
    description : "Email service by Google",
    url : 'https://gmail.com',
    rating : 9
  },
  {
    id : uuid.v4(),
    title : "Apple",
    description : "Main website for the Apple store in Mexico",
    url : 'https://www.macstoreonline.com.mx/',
    rating : 6
  }


];

app.get('/bookmarks', (req,res)=> {
  // console.log("Returning all the bookmarks");
  return res.status(200).json(bookmarks);
});

app.get('/bookmark', (req,res)=> {
  let title = req.query.title;
  if (! title){
    res.statusMessage = "No title has been provided";
    return res.status(406).end();
  }
  let arreglo = [];
  for(var i in bookmarks){
    if(bookmarks[i].title === title){
      arreglo.push(bookmarks[i]);
    }
  }
  if (arreglo.length === 0){
    res.statusMessage = "The title wasnt found";
    return res.status(404).end();
  }
  return res.status(200).json(arreglo);
});

app.post('/bookmarks', jsonParser ,(req,res)=> {
  console.log("body", req.body);
  if(!req.body) {
    res.statusMessage = "No parameters were provided";
    return res.status(406).end();
  }
  if(!req.body.title || !req.body.description || !req.body.url || !req.body.rating){
    res.statusMessage = "One or more parameters were missing";
    return res.status(406).end();
  }
  let id = uuid.v4();
  let title = req.body.title;
  let description = req.body.description;
  let url = req.body.url;
  let rating = req.body.rating;

  let bookmarkNew = {id,title,description,url,rating};

  bookmarks.push(bookmarkNew);



  // console.log("New bookmark added");
  return res.status(201).json(bookmarkNew);
});

app.patch('/bookmark/:id', jsonParser , (req,res) => {

  if (! req.body.id){
    res.statusMessage = "No body was sent";
    return res.status(406).end();
  }

  if (req.params.id !== req.body.id){
    res.statusMessage = "The IDs dont match";
    return res.status(409).end();
  }
  let index = -1;

  for(var i in bookmarks){
    if(bookmarks[i].id === req.body.id){
      index = i;
    }
  }

  if (index === -1){
    res.statusMessage = "The ID didnt matched any bookmark";
    return res.status(404).end();
  }

  if(req.body.title){
    bookmarks[index].title = req.body.title;
  }
  if(req.body.description){
    bookmarks[index].description = req.body.description;
  }
  if(req.body.url){
    bookmarks[index].url = req.body.url;
  }
  if(req.body.rating){
    bookmarks[index].rating = req.body.rating;
  }

  return res.status(202).json(bookmarks[index]);
});

app.delete('/bookmark/:id', (req,res) => {
  // console.log(req.params);
  for(var i in bookmarks){
    if(bookmarks[i].id === req.params.id){
      bookmarks.splice(i, 1);
      // console.log("Bookmark deleted");
      return res.status(200).json([]);
    }
  }
  res.statusMessage = "ID not found";
  return res.status(404).end();
});



app.listen(8080, () => {
  console.log("Listening on port 8080");
});
