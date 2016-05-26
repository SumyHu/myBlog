var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodejs');
module.exports = mongoose;