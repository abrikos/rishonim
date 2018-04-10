const log   = require('logat');
const Page =require('../models/Page');
const Article =require('../models/Article');
//const im = require('imagemagick');
const translit = require('../libs/translit');

module.exports.controller = function(app) {

	app.get('/',function (req, res) {
		Page.find({title:{$ne:null}})
			.exec((e,pages)=>{
				res.render('index',{pages:pages})
			})

	});


	app.get('/page/:id',function (req, res) {
		Page.findOne({link:req.params.id})
			.populate({path:'articles', options:{sort:{order:1}}})
			.exec((e,page)=>{
				if(!page) return res.redirect('/');
				res.render('page',{page:page})
			})

	});

	app.get('/admin',function (req, res) {
		Page.find()
			.select({title:1})
			.sort({date:-1})
			.exec((e,pages)=>{
				res.render('admin-index',{pages:pages})
			})
	});

	app.get('/admin/page/view/:id',function (req, res) {
		Page.findById(req.params.id)
			.populate({path:'articles', options:{sort:{order:1}}})
			.exec(function (e,page) {
				res.render('admin-page',page)
			})
	});

	app.get('/admin/article/view/:id',function (req, res) {
		Article.findById(req.params.id)
			.populate('page')
			.exec(function (e,article) {
				res.render('admin-article',article)
			})
	});


	app.post('/admin/page/view/:id',function (req, res) {
		Page.findById(req.params.id)
			.exec(function (e,page) {
				if(!page) return res.redirect('/admin');
				log.info(req.files.photo)
				if(req.files.photo){
					let photo = req.files.photo;
					let file ='public'+page.img;

					photo.mv(file,(e)=>{
						if(e) return log.error(e);
						/*
						im.crop({
							srcPath: file,
							dstPath: file,
							width: 360,
							height: 360,
							quality: 1,
							gravity: 'Center'
						},function (err,so,se) {
							if (err) log.error( err);
						})
						*/
					});
				}

				for (let p in req.body){
					page[p] = req.body[p];
				}
				if(!page.link) page.link = translit(page.title+'-'+page.topic)
				page.save((e)=>{

					res.redirect('/admin/page/view/'+page.id)
				})
			})
	});

	app.post('/admin/article/view/:id',function (req, res) {
		Article.findById(req.params.id)
			.exec(function (e,article) {
				if(!article) return res.redirect('/admin');
				if(req.files.photo){
					let photo = req.files.photo;
					let file ='public'+article.img;

					photo.mv(file,(e)=>{
						if(e) return log.error(e);
						/*
						im.crop({
							srcPath: file,
							dstPath: file,
							width: 360,
							height: 360,
							quality: 1,
							gravity: 'Center'
						},function (err,so,se) {
							if (err) log.error( err);
						})
						*/
					});
				}

				for (let p in req.body){
					article[p] = req.body[p];
				}
				if(!article.link) article.link = translit(article.title+'-'+article.topic)
				article.save((e)=>{

					res.redirect('/admin/article/view/'+article.id)
				})
			})
	});



	app.get('/admin/page/add',function (req, res) {
		let page = new Page();
		page.save(()=>{
			let article = new Article({page:page})
			article.save(()=>{
				res.redirect('/admin/page/view/'+page.id)
			})

		})

	});

	app.get('/admin/article/add/:page',function (req, res) {
		let article = new Article({page:req.params.page})
		article.save(()=>{
			res.redirect('/admin/article/view/'+article.id)
		})

	});


};
