var mongoose = require('./mongodb');

var Schema = mongoose.Schema;

var articlesSchema = new Schema ({
	title: String,
	pictureArray: [String],
	content: String,
	date: String
});

var articles = mongoose.model('articles', articlesSchema);

articles.findArticle = function(articleId, callback) {
	articles.find({_id: articleId}, function(err, data) {
		if (err) {
			throw Error('something error happened');
		}
		return callback(data[0]);
	});
};

articles.findAllArticles = function(username, sendArticles, localAllArticlesId, updateValue, callback) {
	for (var i = 0; i <= localAllArticlesId.length - 1; i++) {
		console.log('localAllArticlesId[i]'+localAllArticlesId[i]);
		articles.findArticle(localAllArticlesId[i], function(article) {
			console.log(article);
			if (article == undefined) {
				localAllArticlesId.splice(i, 1);
				var update = {$pull: {articles: localAllArticlesId[i]}};
				updateValue(username, update, function(data) {});
			}
			else {
				sendArticles[sendArticles.length] = article;
				console.log('article[0]' + article);
			}
		});
	};

	if (localAllArticlesId.length == 0 || (localAllArticlesId.length>0 && 
				sendArticles.length == localAllArticlesId.length && 
				sendArticles[sendArticles.length-1] != '')) {
		return callback();
	}
};

articles.saveArticle = function(title, pictureArray, content, callback) {
	var newArticle = new articles ({
		title: title,
		pictureArray: pictureArray,
		content: content,
		date: new Date().toLocaleString()
	});
	newArticle.save(function(err) {
		if (err) {
			throw Error('something error happened');
		}

		return callback(newArticle._id);
	});
};

articles.removeArticle = function(articleId, callback) {
	articles.remove({_id: articleId}, function(err, data) {
		if (err) {
			throw Error('something error happened');
		}
		console.log(data);
		callback(data);
	})
};

module.exports = articles;