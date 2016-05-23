/**
 * Created by дима on 22.05.2016.
 */
angular.module('test').controller("answersCtrl", ['httpFactory', 'handleAnswers', answersCtrl]);

function answersCtrl(httpFactory, handleAnswers) {

    var that = this;
    that.answers = httpFactory.getCheckedAnswers();
    that.points = handleAnswers.getPoints(that.answers);

    that.rightAnswerView = function (a, arr) {
        return handleAnswers.rightAnswerView(a, arr)
    };
    that.rightAnswerViewArr = function (a, arr) {
        return handleAnswers.rightAnswerViewArr(a, arr)
    };
}





