var express = require('express'),
    Post = require('../models/Post'),
    User = require('../models/User');
var router = express.Router();

function needAuth(req, res, next) {
    if (req.isAuthenticated) {
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
  var cities = ["서울특별시"
  ,"부산광역시"
  ,"인천광역시"
  ,"대구광역시"
  ,"대전광역시"
  ,"광주광역시"
  ,"경기도 수원시"
  ,"울산광역시"
  ,"경상남도 창원시"
  ,"경기도 고양시"
  ,"경기도 용인시"
  ,"경기도 성남시"
  ,"경기도 부천시"
  ,"충청북도 청주시"
  ,"경기도 안산시"
  ,"전라북도 전주시"
  ,"충청남도 천안시"
  ,"경기도 남양주시"
  ,"경기도 화성시"
  ,"경기도 안양시"
  ,"경상남도 김해시"
  ,"경상북도 포항시"
  ,"경기도 평택시"
  ,"제주특별자치도 제주시"
  ,"경기도 시흥시"
  ,"경기도 의정부시"
  ,"경상북도 구미시"
  ,"경기도 파주시"
  ,"경기도 김포시"
  ,"경상남도 진주시"
  ,"경기도 광명시"
  ,"강원도 원주시"
  ,"충청남도 아산시"
  ,"경기도 광주시"
  ,"전라북도 익산시"
  ,"경상남도 양산시"
  ,"경기도 군포시"
  ,"강원도 춘천시"
  ,"경상북도 경산시"
  ,"전라북도 군산시"
  ,"전라남도 여수시"
  ,"전라남도 순천시"
  ,"경상북도 경주시"
  ,"경상남도 거제시"
  ,"전라남도 목포시"
  ,"강원도 강릉시"
  ,"경기도 오산시"
  ,"충청북도 충주시"
  ,"경기도 이천시"
  ,"경기도 양주시"
  ,"세종특별자치시"
  ,"경기도 안성시"
  ,"경기도 구리시"
  ,"충청남도 서산시"
  ,"경상북도 안동시"
  ,"충청남도 당진시"
  ,"경기도 포천시"
  ,"경기도 의왕시"
  ,"경기도 하남시"
  ,"제주특별자치도 서귀포시"
  ,"전라남도 광양시"
  ,"경상북도 김천시"
  ,"경상남도 통영시"
  ,"충청북도 제천시"
  ,"충청남도 논산시"
  ,"충청남도 공주시"
  ,"경상남도 사천시"
  ,"전라북도 정읍시"
  ,"경기도 여주시"
  ,"경상북도 영주시"
  ,"경상남도 밀양시"
  ,"충청남도 보령시"
  ,"경상북도 상주시"
  ,"경상북도 영천시"
  ,"경기도 동두천시"
  ,"전라남도 나주시"
  ,"강원도 동해시"
  ,"전라북도 김제시"
  ,"전라북도 남원시"
  ,"강원도 속초시"
  ,"경상북도 문경시"
  ,"강원도 삼척시"
  ,"경기도 과천시"
  ,"강원도 태백시"
  ,"충청남도 계룡시"];
  res.render('posts/new', {messages: req.flash(), cities: cities});
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
      _id: req.user._id,
      username: req.user.name
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
