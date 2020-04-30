const express = require('express');
const mongoose = require( 'mongoose' );
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const jsonParser = bodyParser.json();
const apiKey = "2abbf7c3-245b-404f-9473-ade729ed4653";
const { Bookmarks } = require( './models/bookmarksModel' );

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
    Bookmarks
      .getAllBookmarks().then( result => {
          return res.status( 200 ).json( result );
      })
      .catch( err => {
        res.statusMessage = "Something is wrong with the Database. Try again later.";
        return res.status( 500 ).end();
      })
  // console.log("Returning all the bookmarks");
  // return res.status(200).json(bookmarks);
});

app.get('/bookmark', (req,res)=> {
  let title = req.query.title;
  if (! title){
    res.statusMessage = "No title has been provided";
    return res.status(406).end();
  }
  Bookmarks
    .getBookmark(title)
    .then( result => {
      if (!result.length){
        res.statusMessage = "Title not found";
        return res.status(404).end();
      } else {
        return res.status( 200 ).json( result );
      }

    })
    .catch( err => {
      res.statusMessage = "Something is wrong with the Database. Try again later.";
      return res.status( 500 ).end();
    })
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

  Bookmarks
    .createBookmark( bookmarkNew )
    .then( result => {
        return res.status( 201 ).json( result );
    })
    .catch( err => {
        res.statusMessage = "Something is wrong with the Database. Try again later. " +
                             err.message;
        return res.status( 500 ).end();
    });
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
  let changes = {};

  if(req.body.title){
    changes['title'] = req.body.title;
  }
  if(req.body.description){
    changes['description'] = req.body.description;
  }
  if(req.body.url){
    changes['url'] = req.body.url;
  }
  if(req.body.rating){
    changes['rating'] = req.body.rating;
  }

  Bookmarks
    .updateBookmark(req.params.id,changes)
    .then( result => {
      if (!result.length){
        res.statusMessage = "ID not found";
        return res.status(404).end();
      } else {
        return res.status( 200 ).json( result );
      }
    })
    .catch( err => {
      res.statusMessage = "Something is wrong with the Database. Try again later.";
      return res.status( 500 ).end();
    })
});

app.delete('/bookmark/:id', (req,res) => {
  Bookmarks
    .deleteBookmark(req.params.id)
    .then( result => {
      res.statusMessage = "Deleted correctly";
      return res.status( 200 ).end();
    })
    .catch( err => {
      res.statusMessage = "Something is wrong with the Database. Try again later.";
      return res.status( 500 ).end();
    })
  // console.log(req.params);
  // for(var i in bookmarks){
  //   if(bookmarks[i].id === req.params.id){
  //     bookmarks.splice(i, 1);
  //     // console.log("Bookmark deleted");
  //     return res.status(200).json([]);
  //   }
  // }
  // res.statusMessage = "ID not found";
  // return res.status(404).end();
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
  new Promise( ( resolve, reject ) => {

        const settings = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        };
        mongoose.connect( 'mongodb://localhost/bookmarksdb', settings, ( err ) => {
            if( err ){
                return reject( err );
            }
            else{
                console.log( "Database connected successfully." );
                return resolve();
            }
        })
    })
    .catch( err => {
        console.log( err );
    });
});
