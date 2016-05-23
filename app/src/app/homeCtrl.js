/**
 * Created by дима on 22.05.2016.
 */
angular.module('test').controller("homeCtrl", ["httpFactory", "handleAnswers", homeCtrl]);

function homeCtrl(httpFactory, handleAnswers) {
    var that = this;
    that.notSubmit = 0;
    that.ans = {};
    //запрос вопросов на сервер
    that.questions = httpFactory.get('');
    that.submit = function (ans) {

        //можно двояко обрабатывать кнопку отправки. либо data-ui-sref="answers" как в примере
        //либо командой $state.go('answers') после отправки ответов на сервер, но тогда добавляется зависимость $state
        var answers = handleAnswers.dataForSubmit(ans);
        //отправка ответов на сервер
        httpFactory.postAnswers(answers);
        //$state.go('answers');
    };
}