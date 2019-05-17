angular.module('app', ['ngAnimate', 'monospaced.qrcode'])

    .run(function () {
        console.log("RUNNING!");

    })

    .service('timelines', function ($timeout) {

        var framerate = 15;
        var timelines = [];

        this.setFramerate = function (_f) {
            console.log("Framerate set", _f);
            framerate = _f;
        };

        this.animate = function () {
            timelines.forEach(function (_timeline) {
                _timeline.animate();
            })
        };

        this.new = function (cb, time) {

            var _timeline = new function() {
                var frame = 0;
                this.animate = function () {
                    frame++;
                    if((frame / framerate) >= time / 1000) {
                        $timeout(cb, 0);
                        frame = 0;
                    }
                }
            };

            timelines.push(_timeline);

            return _timeline;
        };


    })

    .controller('main', function ($scope, $http, timelines, $interval, $location, preloader) {

        $scope.currentArticleIndex = 0;
        $scope.articles = [];

        window.timelines = timelines;

        $http.get('https://newsapi.org/v2/top-headlines?country=' + $location.search().country + '&apiKey=8181f47651974090ac1e58a28cff835a').then(function(response) {

            $scope.articles = response.data.articles;

            timelines.new(function () {

                if($scope.currentArticleIndex === $scope.articles.length - 1)
                    return $scope.currentArticleIndex = 0;

                $scope.currentArticleIndex++;

            }, 10050);

            var images = response.data.articles.map(function (el) { return el.urlToImage; }).filter(function (el) { return el }).slice(0,10);

            preloader.preloadImages(images).then(function () {
                console.log("All images preloaded!");
                notifyPhantom();
            }, function (e) {
                console.log("ERR, calling Phantom anyway", e);
                notifyPhantom();
            });

        });

        function notifyPhantom() {
            if (typeof window.callPhantom === 'function')
                window.callPhantom(sha1(JSON.stringify($scope.articles)));
            else {
                $interval(timelines.animate, 1000/15);
            }
        }

    });