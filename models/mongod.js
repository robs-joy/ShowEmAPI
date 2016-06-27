var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/showemDB');
// create instance of Schema
var mongoSchema =   mongoose.Schema;
// create schema
var showSchema  = {
    "showID" : String,
    "showName" : String
};
// create model if not exists.
module.exports = mongoose.model('showDetail',showSchema);
