var mongoose = require('./mongodb');

var Schema = mongoose.Schema;

var albumSchema = new Schema ({
	albumId: Number,
	pictureSrc: String
});

var albums = mongoose.model('albums', albumSchema);

albums.findAll = function(callback) {
	albums.find(function(err, data) {
		if (err) {
			throw Error('something error happened');
		}
		return callback(err, data);
	});
};

module.exports = albums;