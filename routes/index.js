var users = require('./users');

var multer = require('multer');

module.exports = function(app) {

	var storage = multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, './public/upload');
		},
		filename: function(req, file, cb) {
			cb(null, file.originalname);
		}
	});

	var uploadImage = multer({
		storage: storage
	});

	var judgeIfTimeOut = function(req, res, callback) {
		if (req.session.username == undefined) {
			req.flash('loginFailed', '登录超时，请重新登录！');
			res.redirect('/myBlog-login');
		}
		else if (req.session.username == '') {
			res.redirect('/myBlog-login')
		}
		else {
			callback();
		}
	};

	var localAllArticlesId, localAllMessageId;

	app.get('/', function(req, res) {
		res.render('myBlog-slide');
	});

	app.get('/myBlog-login', function(req, res) {
		console.log(req.session.username);
		if (req.session.username) {
			res.redirect('/myBlog-index');
		}
		else {
			res.render('myBlog-login', 
				{successMessage: req.flash('success'), 
				 errorMessage: req.flash('loginFailed')
			});
		}
	});
	app.post('/myBlog-login', function(req, res) {
		users.findUsers(req.body.username, function(data) {
			if (data == "") {
				req.flash('loginFailed', '该用户不存在，请重新输入！');
				res.redirect('/myBlog-login');
			}
			else {
				if (data[0].password != req.body.password) {
					req.flash('loginFailed', '密码错误，请重新输入！');
					res.redirect('/myBlog-login');
				}
				else {
					req.session.bloger = req.body.username;
					req.session.username = req.body.username;
					req.session.imageSrc = data[0].imageSrc;
					localAllMessageId = data[0].messageBooks;
					
					var data = {username: req.session.username};
					users.articlesEvent('findAllArticleId', data, function(allArticlesId) {
						localAllArticlesId = allArticlesId;
						console.log('localAllArticlesId:' + localAllArticlesId);
					});

					console.log(data[0]);
					res.redirect('/myBlog-index');
				}
			}
		});
	});

	app.get('/myBlog-logout', function(req, res) {
		req.session.username = undefined;
		res.redirect('/myBlog-login');
	});

	app.get('/myBlog-register', function(req, res) {
		res.render('myBlog-register', {errorMessage: req.flash('registerError')});
	});
	app.post('/myBlog-register', function(req, res) {
		if (req.body.password !== req.body.passwordConfirm) {
			req.flash('registerError', '两次输入的密码不一致，请重新输入！');
			return res.redirect('/myBlog-register');
		}

		else {
			users.saveUsers(req.body.username, req.body.password, function(err) {
				if (err) {
					req.flash('registerError', '用户名已存在，请重新注册！')
					return res.redirect('/myBlog-register');
				}
				else {
					req.flash('success', '注册成功，请登录！');
					return res.redirect('/myBlog-login');
				}
			});
		}
	});

	app.get('/myBlog-index', function(req, res) {
		judgeIfTimeOut(req, res, function() {
			res.render('myBlog-index', 
				{imageSrc: req.session.imageSrc, username: req.session.username});
		});
	});

	app.get('/myBlog-upload-image', function(req, res)  {
		judgeIfTimeOut(req, res, function() {
			res.render('myBlog-upload-image', {imageSrc: req.session.imageSrc});
		});
	});
	app.post('/myBlog-upload-image',uploadImage.single('uploadImage'), function (req, res) {
		if (req.file == undefined) {
			res.redirect('/myBlog-index');
		}
		else {
			var uploadImage = req.file.path.substring(7).replace(/\\/g, '/');
			var update = {$set: {imageSrc: uploadImage}};
			users.updateValue(req.session.username, update, function(data) {
				req.session.imageSrc = uploadImage;
				res.redirect('/myBlog-index');
			});
		}
	});

	app.get('/myBlog-change-password', function(req, res) {
		judgeIfTimeOut(req, res, function() {
			res.render('myBlog-change-password', {errorMessage: req.flash('errorMessage'), value: req.session.username});
		});
	});
	app.post('/myBlog-change-password', function(req, res) {
		users.findUsers(req.session.username, function(data) {
			var oldRealPassword = data[0].password;

			if (oldRealPassword != req.body.oldPassword) {
				req.flash('errorMessage', '原密码输入不正确，请重新输入！');
				res.redirect('/myBlog-change-password');
			}

			else {
				if (req.body.newPassword != req.body.newPasswordConfirm) {
					req.flash('errorMessage', '两次输入的新密码不正确，请重新输入！');
					res.redirect('/myBlog-change-password');
				}

				else {
					var username = data[0]._id;
					var newPassword = req.body.newPassword;
					var update = {$set: {password: newPassword}};
					users.updateValue(username, update, function(data) {
						req.flash('success', '密码更改成功，请重新登录！');
						res.redirect('/myBlog-login');
					});
				}
			}
		});
	});

	app.get('/myBlog-article', function(req, res) {
		judgeIfTimeOut(req, res, function() {
			console.log('localAllArticlesId:' + localAllArticlesId);
			
			var data = {
				username: req.session.username,
				articles: [],
				localAllArticlesId: localAllArticlesId
			};
			users.articlesEvent('findAllArticles', data, function() {
				res.render('myBlog-article', 
					{imageSrc: req.session.imageSrc, username:req.session.username, articles: data.articles});
			});
		});
	});

	app.get('/myBlog-edit-article', function(req, res) {
		judgeIfTimeOut(req, res, function() {
			res.render('myBlog-edit-article');
		});
	});
	app.post('/myBlog-edit-article', uploadImage.array('uploadPicture'), function(req, res) {
		var data = {
			username: req.session.username,
			title: req.body.title,
			pictureArray: [],
			content: req.body.content
		}

		for (var i = 0; i <= req.files.length - 1; i++) {
			var pictureSrc = req.files[i].path.substring(7).replace(/\\/g, '/');
			data.pictureArray[i] = pictureSrc;
		};

		users.articlesEvent('addArticle' ,data, function() {
			users.articlesEvent('findAllArticleId', data, function(allArticlesId) {
				localAllArticlesId = allArticlesId;
				res.redirect('/myBlog-article');
			});
		});
	});

	app.get('/myBlog-readall', function(req, res) {
		var articleId = req.query.id;
		var data = {articleId: articleId};
		users.articlesEvent('findArticle', data, function(article) {
			console.log('article.pictureArray:' + article.pictureArray);
			res.render('myBlog-readall', {article: article});
		});

	});

	app.get('/myBlog-remove-article', function(req, res) {
		var articleId = req.query.id;
		var data = {
			articleId: articleId
		};
		users.articlesEvent('removeArticle', data, function(data) {
			res.redirect('/myBlog-article');
		});
	});

	app.get('/myBlog-album', function(req, res) {
		judgeIfTimeOut(req, res, function() {
			res.render('myBlog-album');
	});
		});

	app.get('/myBlog-message-book', function(req, res) {
		judgeIfTimeOut(req, res, function() {
			var data = {
				allMessage: [], 
				allMessageId: localAllMessageId
			};
			//console.log('localAllMessageId:' + localAllMessageId);
			users.messageBooksEvent('findAllMessage', data, function() {
				console.log('allMessage:' + data.allMessage);
				res.render('myBlog-message-book', {messageBooks: data.allMessage});
			});
		});
	});
	app.post('/myBlog-message-book', function(req, res) {
		var data = {
			bloger: req.session.bloger,
			visitor: req.session.username,
			userImage: req.session.imageSrc,
			content:req.body.message
		}
		users.messageBooksEvent('addMessage', data, function() {
			users.findUsers(req.session.bloger, function(data) {
				console.log('data:' + data);
				localAllMessageId = data[0].messageBooks;
				res.redirect('/myBlog-message-book');
			});
		});
	});
};
