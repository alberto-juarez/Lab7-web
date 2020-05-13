const {TOKEN} = require( './../config' );

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
    if (authKey !== `Bearer ${TOKEN}`){
      res.statusMessage = "The key provided is not valid";
      return res.status(401).end();
    }
  }


  if (bookapiKey){
    if(bookapiKey !== TOKEN){
      res.statusMessage = "The key provided is not valid";
      return res.status(401).end();
    }
  }


  if (queryKey){
    if (queryKey !== TOKEN){
      res.statusMessage = "The key provided is not valid";
      return res.status(401).end();
    }
  }



  next();
};

module.exports = keyManager;
