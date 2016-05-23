/**
 * Created by дима on 22.05.2016.
 */

angular.module('testCtrl', []).controller("homeCtrl", homeCtrl);

function homeCtrl() {
    var that = this;
    that.notSubmit = 0;
    that.ans = {};
    that.submit = function (ans) {
        var answers = handleAnswers.dataForSubmit(ans);
    };
}