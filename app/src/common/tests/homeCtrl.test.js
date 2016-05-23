/**
 * Created by дима on 22.05.2016.
 */
describe('тест контроллера testCtrl', function () {
    var mockScope = {}, that;
    beforeEach(module('testCtrl'));
    beforeEach(inject(function ($controller, $rootScope) {
        mockScope = $rootScope.$new;
        that = $controller('homeCtrl', {$scope: mockScope})
    }));

    it('тест данных submit', function () {

        expect(that.notSubmit).toBeDefined();

    });

});