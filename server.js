var express = require('express');
var mongoose = require('mongoose');
var GitHubApi = require("github");

var app = express();
var gh = new GitHubApi({Promise: Promise});

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/github');
if (process.env.GITHUB_TOKEN) {
  gh.authenticate({
    type: "token",
    token: process.env.GITHUB_TOKEN
  });
}

/* DB Entry Schema */
var HistorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  type: String,
  value: String,
  ip: String
});
var History = mongoose.model('History', HistorySchema);

/* Serve static content and set port */
app.use('/', express.static('build'));
app.set('port', (process.env.PORT || 5000));


app.get('/api/history/:onlyIP?', function (req, res) {
  var filter = {};
  if(req.params.onlyIP && req.params.onlyIP == 'mine') {
    filter.ip = getClientIp(req);
  }

  History.find(filter).sort({date: -1}).limit(25).then(function(data){
    res.json(data);
  }, function(e){
    console.log(e);
  });
});

app.get('/api/repo/:user/:repo', function (req, res) {
  var histEntry = new History({
    type: 'Repo',
    value: req.params.user + '/' + req.params.repo,
    ip: getClientIp(req)
  });


  var pCommits = new Promise(getCommits);
  var pStats = new Promise(getStats);
  var pLanguages = new Promise(getLanguages);
  var pContributors = new Promise(getContributors);

  Promise.all([pCommits, pStats, pLanguages, pContributors])
    .then(function(results){
      var summary = {};

      summary.commits = results[0];
      summary.stats = results[1];
      summary.languages = results[2];
      summary.contributors = results[3];
      summary.stats.contributors = results[3].length;

      // Save in The DB and send response
      saveEntrySendRes(histEntry, res, summary);

    }, function(e) {
      res.status(e.code).send({ error: e.status });
  });

  function getCommits(resolve, reject) {
    gh.repos.getStatsParticipation({owner: req.params.user, repo: req.params.repo})
      .then(function(data){
        var result = [];

        var date = new Date();
        date.setDate(date.getDate() - 7 * (data.all.length - 1));
        var month = date.toLocaleString("en-us", { month: "short" });
        var all = 0;
        var owner = 0;

        for(i=1; i<data.all.length; i++) {
         // Get the month name of the week
         date.setDate(date.getDate() + 7);
         if(month != date.toLocaleString("en-us", { month: "short" })) {
           result.push({month: month, all: all, owner: owner});

           month = date.toLocaleString("en-us", { month: "short" });
           all = 0;
           owner = 0;
         }

         all += data.all[i];
         owner += data.owner[i];
        }

        result.push({month: month, all: all, owner: owner});
        resolve(result);
      }, function(e){
        reject(e);
    });
  }

  function getStats(resolve, reject) {
    gh.repos.get({owner: req.params.user, repo: req.params.repo})
      .then(function(data){
        var result = {};

        result.forks = data.forks_count;
        result.stars = data.stargazers_count;
        result.watchers = data.watchers_count;
        result.size = data.size + ' kb';
        result.issues = data.open_issues_count;
        result.updated = new Date(data.pushed_at).toLocaleString("en-us");

        resolve(result);
      }, function(e){
      reject(e);
    });
  }

  function getLanguages(resolve, reject) {
    gh.repos.getLanguages({owner: req.params.user, repo: req.params.repo})
      .then(function(data){
        delete data.meta;
        resolve(data);
      }, function(e){
        reject(e);
    });
  }

  function getContributors(resolve, reject) {
    getAllPages(gh.repos.getStatsContributors, {owner: req.params.user, repo: req.params.repo})
      .then(function(data) {
        var result = [];

        data.forEach(function(contr){
          var contributor = {};
          // commits
          contributor.commit = contr.total;
          // lines added
          contributor.add = 0;
          // lines deleted
          contributor.delete = 0;
          if(contr.weeks) {
            contr.weeks.forEach(function(week){
              contributor.add += week.a;
              contributor.delete += week.d;
            });
          }
          if(contr.author){
            contributor.name = contr.author.login;
            contributor.avatar = contr.author.avatar_url;
          }

          result.push(contributor);
        });
        resolve(result);
      }, function(e){
      reject(e);
    });
  }

});

app.get('/api/user/:username', function (req, res) {
  var histEntry = new History({
    type: 'User',
    value: req.params.username,
    ip: getClientIp(req)
  });

  var pInfos = new Promise(getInfos);
  var pLanguages = new Promise(getLanguagesOfRepos);

  Promise.all([pInfos, pLanguages])
    .then(function(results){
      var summary = {};

      summary.type = results[0].type;
      summary.infos = results[0].result;
      summary.languages = results[1];

      if(results[0].type != 'Organization') {
        // Save in The DB and send response
        saveEntrySendRes(histEntry, res, summary);
      }
      else {
        var pMembers = new Promise(getMembers);
        pMembers.then(function(result){
          summary.members = result;
          summary.infos.members = result.length;

          histEntry.type = 'Organization';
          // Save in The DB and send response
          saveEntrySendRes(histEntry, res, summary);
        }, function(e) {
          res.status(e.code).send({ error: e.status });
        });
      }
    }, function(e) {
      res.status(e.code).send({ error: e.status });
    });

  function getInfos(resolve, reject) {
    gh.users.getForUser({username: req.params.username})
      .then(function(data){
        var result = {};

        if(data.name)
          result.name = data.name;
        if(data.company)
          result.company = data.company;
        if(data.location)
          result.location = data.location;
        if(data.email)
          result.email = data.email;
        result.repos = data.public_repos;
        if(data.type == 'User') {
          result.followers = data.followers;
          result.following = data.following;
        }
        result.inscription = new Date(data.created_at).toLocaleString("en-us");

        resolve({type: data.type, result: result});
      }, function(e) {
        reject(e);
    });
  }

  function getLanguagesOfRepos(resolve, reject) {
    var result = {};
    var pArray = [];

    getAllPages(gh.repos.getForUser, {username: req.params.username})
    .then(function(data){
      data.forEach(function(repo){
        pArray.push(gh.repos.getLanguages({owner: repo.owner.login, repo: repo.name}));
      });

      // Wait for all the languages requests
      Promise.all(pArray)
        .then(function(results){
          results.forEach(function(data){
            mergeLanguages(data);
          });
          resolve(result);
      }, function(err){});

    }, function(e) {
        reject(e);
    });;

    function mergeLanguages(data){
      delete data.meta;

      // Merge data
      for(var lang in data) {
        if(result[lang]) {
          result[lang] += data[lang];
        }
        else {
          result[lang] = data[lang];
        }
      }
    }
  }

  function getMembers(resolve, reject) {
    var result = [];
    gh.orgs.getMembers({org: req.params.username})
      .then(function(data){
        data.forEach(function(user){
          result.push({name: user.login, avatar: user.avatar_url});
        });
        resolve(result);
      }, function(e) {
        reject(e);
    });;
  }

});

/* Start server and bind port */
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});


function getClientIp(req) {
  return (req.headers["X-Forwarded-For"] ||
          req.headers["x-forwarded-for"] ||
          '').split(',')[0]              ||
          req.client.remoteAddress;
};

function getAllPages(func, params) {
  var result = [];

  function pager(res) {
    result = result.concat(res);
    if (gh.hasNextPage(res)) {
      return gh.getNextPage(res)
        .then(pager);
    }
    return result;
  }

  return func(params)
    .then(pager);
}

function saveEntrySendRes(entry, res, data) {
  entry.save().then(function(){
    res.json(data);
  }, function(e){
    console.log(e);
    res.status('500').send({ error: 'DB error' });
  });
}
