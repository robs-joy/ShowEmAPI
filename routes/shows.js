// MongoDB 2.4 database added.  Please make note of these credentials:
//
//    Root User:     admin
//    Root Password: wnwYzZHckhyS
//    Database Name: showem
//
// Connection URL: mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/

var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure,
    ObjectID = require('mongodb').ObjectID;

var collectionName='shows';
var connectionStr=process.env.OPENSHIFT_MONGODB_DB_HOST||"localhost";


if (process.env.OPENSHIFT_MONGODB_DB_URL) {
     connectionStr = process.env.OPENSHIFT_MONGODB_DB_URL +
         process.env.OPENSHIFT_APP_NAME;
 }

// if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  // connectionStr = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  // process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  // process.env.OPENSHIFT_MONGODB_DB_HOST;
  // + ':' +
  // process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  // process.env.OPENSHIFT_APP_NAME;
// }
var DBport=process.env.OPENSHIFT_MONGODB_DB_PORT||27017;

var server = new Server(connectionStr, DBport, {auto_reconnect: true});
db = new Db('showem', server);


db.open(function(err, db) {
    if(!err)
        console.log("Connected to 'showem' database");
        db.collection(collectionName, {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'shows' collection doesn't exist.");
                populateDB();
            }
        });
    }
);


var populateDB = function() {

    var showslst = [
    {
        name: "Flash",
        year: "2009"
    },
    {
      name: "Castle",
      year: "2009"
    }];

    db.collection(collectionName, function(err, collection) {
        collection.insert(showslst, {safe:true}, function(err, result) {});
        console.log("Created...");
    });

};


exports.findAll = function(req, res) {
    db.collection(collectionName, function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
        if (err) {
            res.send({'error':'An error has occurred :' + err});
        }
    });
    console.log("Listing...");
};

exports.addShow = function(req, res) {
    var newShow = req.body;
    console.log("Insert Request for : " + JSON.stringify(newShow));
    db.collection(collectionName, function(err, collection) {
        collection.insert(newShow,{safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred :' + err});
            } else {
                console.log('Success: ');
                res.send(result[0]);
            }
        });
    });
    console.log("Insert Done...");
};

exports.findById = function(req, res) {
    var obj_id = new ObjectID(req.params.id);
    console.log("Object " + obj_id);
    db.collection(collectionName, function(error, collection) {
           collection.findOne({_id:obj_id},function(err, docs) {
             res.send(docs);
             console.log("Find Id : " + JSON.stringify(docs));
           });
     });

    console.log("Find..." + obj_id);
};


exports.deleteShow = function(req, res) {

    var obj_id = new ObjectID(req.params.id);
    console.log('Deleting Show : ' + obj_id);

    db.collection(collectionName, function(err, collection) {
        collection.remove({_id:obj_id}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + JSON.stringify(result) + ' document(s) deleted');
                res.send("req.body");
            }
        });
    });
};

exports.deleteAllShow = function(req, res) {
    console.log('Deleting All Show : ');

    db.collection(collectionName, function(err, collection) {
        collection.remove({}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('All document(s) deleted');
                res.send("All Deleted");
            }
        });
    });
};
