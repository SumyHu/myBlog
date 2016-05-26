var mongoose = require('./mongodb');

var articles = require('./articles');

var albums = require('./albums');

var messageBooks = require('./messageBooks');

var Schema = mongoose.Schema;

var albumsSchema = new Schema ({
	title: String,
	picture: [],
	date: String
});

var usersSchema = new Schema ({
	_id: String,
	password: String,
	imageSrc: String,
	articles: [],
	albums: [albumsSchema],
	messageBooks: []
});

var users = mongoose.model('users', usersSchema);

users.findUsers = function(usersId, callback) {
	users.find({_id: usersId}, function(err, data) {
		if (err) {
			throw Error('something error happened');
		}
		return callback(data);
	});
};

users.saveUsers = function(usersId, password, callback) {
	var newUser = new users({
		_id: usersId,
		password: password,
		imageSrc: 'upload/girl.jpg',
		articles: [],
		messageBooks: []
	});
	//users.markModified('articles');
	newUser.save(function(err) {
		if (err) {
			throw Error('something error happened');
		}

		return callback(err);
	});
};

users.updateValue = function(usersId, update, callback) {
	users.update({_id:usersId}, update, function(err, data) {
		if (err) {
			throw Error('something error happened');
		}
		callback(data);
	});
};

users.articlesEvent = function(func, data, callback) {
	switch(func) {
		case 'findAllArticleId':
			users.findUsers(data.username, function(result) {
				console.log('data[0]' + result[0]);
				callback(result[0].articles);
			});
			break;

		case 'findAllArticles': 
			articles.findAllArticles(data.username, data.articles, data.localAllArticlesId, users.updateValue, callback);

		case 'findArticle':
			articles.findArticle(data.articleId, function(article) {
				callback(article);
			});
			break;

		case 'addArticle':
			articles.saveArticle(data.title, data.pictureArray, data.content, function(articleId) {
				var update = {$addToSet: {articles: articleId}};
				users.updateValue(data.username, update, function(data) {
					callback();
				});
			});
			break;

		case 'removeArticle':
			articles.removeArticle(data.articleId, callback);
	}
};

users.messageBooksEvent = function(func, data, callback) {
	switch(func) {
		case 'findMessage':
			messageBooks.findMessage(data.messageId, callback);
			break;

		case 'findAllMessage':
			messageBooks.findAllMessage(data.allMessage, data.allMessageId, callback);
			break;

		case 'addMessage':
			messageBooks.addMessage(data.visitor, data.userImage, data.content, function(messageId) {
				console.log('messageId:' + messageId);
				var update = {$addToSet: {messageBooks: messageId}};
				users.updateValue(data.bloger, update, function(data) {
					callback();
				});
			});
	}
}

users.removeUsers = function(usersId, callback) {
	users.remove({_id: usersId}, function(err, data) {
		if (err) {
			console.log('删除失败');
		}
		callback(err, data);
	})
};

module.exports = users;

