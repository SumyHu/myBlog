var mongoose = require('./mongodb');

var Schema = mongoose.Schema;

var messageBooksSchema = new Schema ({
	username: String,
	userImage: String,
	content: String,
	date: String
});

var messageBooks = mongoose.model('messageBooks', messageBooksSchema);

messageBooks.findMessage = function(messageId, callback) {
	messageBooks.find({_id: messageId}, function(err, data) {
		if (err) {
			throw Error('something error happened');
		}
		return callback(data[0]);
	});
};

messageBooks.findAllMessage = function(allMessage, allMessageId, callback) {
	if (allMessageId.length == 0) {
		console.log(allMessage);
		return callback();
	}

	for (var i = 0; i <= allMessageId.length - 1; i++) {
		messageBooks.findMessage(allMessageId[i], function(message) {
			console.log('message'+message);
			allMessage[allMessage.length] = message;
			console.log('allMessage'+allMessage);

			if (allMessage.length == allMessageId.length) {
				return callback();
			}
		});
	};
};

messageBooks.addMessage = function(username, userImage, content, callback) {
	var newMessage = new messageBooks ({
		username: username,
		userImage: userImage,
		content: content,
		date: new Date().toLocaleString()
	});

	newMessage.save(function(err) {
		if (err) {
			throw Error('something error happened');
		}

		return callback(newMessage._id);
	});
}

module.exports = messageBooks;