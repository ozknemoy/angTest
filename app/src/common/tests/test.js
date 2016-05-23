/**
 * Created by дима on 27.03.2016.
 */
xdescribe('ctrl test', function () {

    var mockScope = {};
    var controller;
    beforeEach(module('test'));
    beforeEach(angular.mock.inject(function ($controller, $rootScope) {
        mockScope = $rootScope.$new;
        controller = $controller('createnewsCtrl', {
            $scope: mockScope
        })
    }));
    it('проба пера', function () {
        expect(mockScope.numOfNews).toEqual(5);
        mockScope.expandNumNews();
        expect(mockScope.numOfNews).toEqual(10);
    });

});
/*describe('backend test', function () {
 var mockScope, controller, backend;
 beforeEach(module('example'));
 beforeEach(inject(function($injector) {
 backend = $injector.get('$httpBackend');
 authRequestHandler = backend.when('GET', '/auth.py')
 .respond({userId: 'userX'}, {'A-Token': 'xxx'});
 $rootScope = $injector.get('$rootScope');
 // The $controller service is used to create instances of controllers
 var $controller = $injector.get('$controller');

 createController = function() {
 return $controller('MyController', {'$scope' : $rootScope });
 };
 }));

 beforeEach(angular.mock.inject(function ($controller, $rootScope, $httpBackend, $http) {
 backend = $httpBackend;
 backend.expect('GET', '/studentlist/admin/news').respond(
 {userId: 'userX'}, {'A-Token': 'xxx'}
 );
 mockScope = $rootScope.$new;
 controller = $controller('createnewsCtrl', {
 $http: $http,
 $scope: mockScope
 });
 backend.flush();
 }));

 it('проверяем что запрос получен', function () {
 $httpBackend.verifyNoOutstandingExpectation();
 });
 });*/
xdescribe('backend createnewsCtrl', function () {

    var mockScope, controller, backend;
    beforeEach(module('test'));
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, $http) {


        backend = $httpBackend;
        backend.expect('GET', '/studentlist/admin/news').respond(
            [{"newsId": "userX", "newsDate": doRandomDate()}]
        );
        mockScope = $rootScope.$new;
        controller = $controller('createnewsCtrl', {
            $http: $http,
            $scope: mockScope
        });
        backend.flush();
    }));
    for (var i = 0; i < 2; i++) {
        it('проверяем что запрос получен и news Defined', function () {
            backend.verifyNoOutstandingExpectation();
            expect(mockScope.news).toBeDefined();
            // expect(mockScope.Date).toBeDefined();
        });
    }
});
xdescribe('backend editNewsCtrl ISOfromRU', function () {
    var mockScope, controller, backend;
    beforeEach(module('test'));
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, $http) {
        backend = $httpBackend;
        backend.expect('GET', '/studentlist/admin/news').respond(
            {}
        );
        mockScope = $rootScope.$new;
        controller = $controller('editNewsCtrl', {
            $http: $http,
            $scope: mockScope
        });
        backend.flush();
    }));

    it('проверяем что запрос получен', function () {
        backend.verifyNoOutstandingExpectation();
        //expect(mockScope.Date).toBeDefined();
    });
});

describe('тест алгоритма фабрики makeFotoUrlForVideo', function () {
    var makeFotoUrlForVideo;
    beforeEach(function () {
        //инжект фабрики с помощью _..._
        module('testFactory');
        inject(function (_makeFotoUrlForVideo_) {
            makeFotoUrlForVideo = _makeFotoUrlForVideo_;
        })
    });
    it('makeFotoUrlForVideo', function () {

        for (var i = 0; i < 1111; i++) {
            var urlCore = randomUTUBE();

            var urlIn = [{
                url: 'https://www.youtube.com/watch?v=' + urlCore,
                fullDescription: urlCore,
                name: urlCore,
                publicationDate: urlCore
            }];
            var urlOut = [{
                id: '0',
                image_url: 'https://img.youtube.com/vi/' + urlCore + '/0.jpg',
                url: 'https://www.youtube.com/watch?v=' + urlCore,
                iframe_video: "<iframe src='http://www.youtube.com/embed/" + urlCore + "' frameborder='0' allowfullscreen='' height=222 width=150></iframe>",
                iframe_video_autoplay: "<iframe src='http://www.youtube.com/embed/" + urlCore + "?autoplay=1' frameborder='0' allowfullscreen='' height=222 width=150></iframe>",
                showMe: true,
                fullDescription: urlCore,
                name: urlCore,
                publicationDate: urlCore/**/
            }];


            //console.log(makeFotoUrlForVideo.test);

            expect(makeFotoUrlForVideo(urlIn, 222, 150)).toEqual(urlOut)
        }
    })
});
var arr = ['a', 'b', 'f', 'u', 'r', 'o', 'p', 'y', 'r', 'z', 't', 'g', 'h', 'v', 'b', 'n', 'm'];
function randomUTUBE() {
    var urlCore = [];

    for (var i = 0; i < 11; i++) {
        var n = Math.floor(Math.random() * 17);
        urlCore.push(arr[n]);
    }
    return t = urlCore.join('')
}