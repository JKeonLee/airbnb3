var express = require('express'),
    Post = require('../models/Post'),
    User = require('../models/User');
var router = express.Router();

function needAuth(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/signin');
    }
}

function validateForm(form, options) {
  var title = form.title || "";
  var body = form.body || "";
  title = title.trim();

  if (!title) {
    return '제목을 입력해주세요.';
  }

  if (!body) {
    return '내용을 입력해주세요.';
  }

  return null;
}

/* GET users listing. */
router.get('/', needAuth, function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) {
      return next(err);
    }
    Post.find({}, function(err, posts) {
    if (err) {
      return next(err);
    }
    res.render('posts/index', {users: users, posts: posts});
    });
  });
    
});

router.get('/new', function(req, res, next) {
  res.render('posts/new', {messages: req.flash()});
});

router.get('/:id/edit', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('posts/edit', {post: post});
  });
});

router.put('/:id', function(req, res, next) {
  var err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }

  Post.findById({_id: req.params.id}, function(err, post) {
    if (err) {
      return next(err);
    }
    if (!post) {
      req.flash('danger', '존재하지 않는 게시물입니다.');
      return res.redirect('back');
    }

    post.title = req.body.title;
    post.body = req.body.body;
    
    post.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', '게시물 정보가 변경되었습니다.');
      res.redirect('/posts');
    });
  });
});

router.delete('/:id', function(req, res, next) {
  Post.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    req.flash('success', '게시물이 삭제되었습니다.');
    res.redirect('/posts');
  });
});

router.get('/:id', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('posts/show', {post: post});
  });
});

router.post('/', function(req, res, next) {
  var err = validateForm(req.body, {needPassword: true});
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  var newPost = new Post({
    title: req.body.title,
    body: req.body.body,
    owner: {
      _id: req.session.user._id,
      username: req.session.user.name
    }
  });
  
  newPost.save(function(err) {
    if (err) {
      return next(err);
    } else {
      req.flash('success', '작성이 완료되었습니다.');
      res.redirect('/posts');
    }
  });
});


module.exports = router;