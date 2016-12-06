var express = require('express'),
    User = require('../models/User');
var router = express.Router();

function needAuth(req, res, next) {
    if (req.user) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/signin');
    }
}

/* GET users listing. */
router.get('/index', needAuth, function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) {
      return next(err);
    }
    res.render('guests/index', {users: users});
    });
  });

// router.get('/new', function(req, res, next) {
//   res.render('posts/new', {messages: req.flash()});
// });

// router.get('/:id/edit', function(req, res, next) {
//   Post.findById(req.params.id, function(err, post) {
//     if (err) {
//       return next(err);
//     }
//     res.render('posts/edit', {post: post});
//   });
// });

// router.put('/:id', function(req, res, next) {
//   var err = validateForm(req.body);
//   if (err) {
//     req.flash('danger', err);
//     return res.redirect('back');
//   }

//   Post.findById({_id: req.params.id}, function(err, post) {
//     if (err) {
//       return next(err);
//     }
//     if (!post) {
//       req.flash('danger', '존재하지 않는 게시물입니다.');
//       return res.redirect('back');
//     }

//     post.title = req.body.title;
//     post.body = req.body.body;
    
//     post.save(function(err) {
//       if (err) {
//         return next(err);
//       }
//       req.flash('success', '게시물 정보가 변경되었습니다.');
//       res.redirect('/posts');
//     });
//   });
// });

// router.delete('/:id', function(req, res, next) {
//   Post.findOneAndRemove({_id: req.params.id}, function(err) {
//     if (err) {
//       return next(err);
//     }
//     req.flash('success', '게시물이 삭제되었습니다.');
//     res.redirect('/posts');
//   });
// });

// router.get('/:id', function(req, res, next) {
//   Post.findById(req.params.id, function(err, post) {
//     if (err) {
//       return next(err);
//     }
//     res.render('posts/show', {post: post});
//   });
// });

module.exports = router;
