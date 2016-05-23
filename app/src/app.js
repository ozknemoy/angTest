angular.module("test", ['ui.router', 'ngAnimate']);
angular.module('test').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/home');
    $locationProvider.hashPrefix('!');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/src/app/home.html',
            controller: 'homeCtrl',
            controllerAs: "ctrl"
        })
        .state('answers', {
            url: '/answers',
            templateUrl: '/src/app/answers.html',
            controller: 'answersCtrl',
            controllerAs: "ctrl"
        })
    ;
});

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
/**
 * Created by дима on 22.05.2016.
 */
angular.module('test').factory("handleAnswers", handleAnswers);

function handleAnswers() {
    var handleAnswers = {};

    handleAnswers.getPoints = function (answers) {
        var answer = {
            scores: 0,
            allScores: 0,
            wrongAnswers: 0,
            rightAnswers: 0
        };
        for (var k in answers) {
            if (answers[k].user_answer_correct) {
                answer.scores += parseInt(answers[k].score);
                answer.rightAnswers += 1;
            } else {
                answer.wrongAnswers += 1
            }
            answer.allScores += parseInt(answers[k].score);
        }

        return answer
    };
    handleAnswers.rightAnswerView = function (a, arr) {
        var answer = arrayToString(arr);
        var letterValue;
        if (a.answers) {
            for (var i in a.answers) {
                if (a.answers[i].option == answer) {
                    letterValue = a.answers[i].value;
                    return '"' + answer + '. ' + letterValue + '"';
                }
            }
        } else return answer
    };
    handleAnswers.rightAnswerViewArr = function (a, arr) {
        var letterValue = '';
        arr.forEach(function (answer, j, ar) {
            for (var i in a.answers) {
                if (a.answers[i].option == answer) {
                    letterValue += ' ' + answer + '. ' + a.answers[i].value + ' ';
                }
            }
        });
        return '"' + letterValue + '"'
    };
    handleAnswers.dataForSubmit = function (ans) {
        for (var k in ans) {
            if (typeof ans[k] == 'object') {
                ans[k] = objToArr(ans[k]);//преобразую объект в массив
            } else {
                ans[k] = [ans[k]];//преобразую строку в массив
            }
        }
        return ans
    };

    function objToArr(d) {
        var arr = [];
        for (var k in d) {
            if (d[k] == true) {
                arr.push(k)
            }
        }
        return arr
    }

    function arrayToString(arr) {
        var string = '';
        arr.forEach(function (item, i, arr) {
            if (i == 0) string += item;
            else string += ', ' + item;
        });
        return string
    }

    return handleAnswers
}

/**
 * Created by дима on 22.05.2016.
 */
angular.module('test').factory('httpFactory', ['$cacheFactory', '$http',
    function ($cacheFactory, $http) {
        var cache = $cacheFactory.get('$http'),
            httpFactory = {},
            sendedAnswers = {}
            ;

        httpFactory.get = function (url) {
            return [
                {
                    question: '5 + 7 - 4',
                    score: 3, // количество баллов за правильный ответ
                    answers: [ //варианты ответов
                        {option: 'A', value: '7'},
                        {option: 'B', value: '8'},
                        {option: 'C', value: '9'},
                        {option: 'D', value: '10'}
                    ],
                    type: 'radioButton', // тип
                    checksum: 7362919232 // для проверки ответов
                },
                {
                    question: '5 * 4',
                    score: 5,
                    answers: [
                        {option: 'A', value: '15'},
                        {option: 'B', value: '20'},
                        {option: 'C', value: '25'},
                        {option: 'D', value: '30'}
                    ],
                    type: 'radioButton',
                    checksum: 7362919231
                },
                {
                    question: '5 * 4 - 7',
                    score: 5,
                    type: 'textInput',
                    checksum: 7362919233
                },
                {
                    question: '5 + 12 - 7',
                    score: 4,
                    type: 'textInput',
                    checksum: 7362919234
                },
                {
                    question: '5 * 2 и 5 * 3',
                    score: 8,
                    answers: [
                        {option: 'A', value: '10'},
                        {option: 'B', value: '13'},
                        {option: 'C', value: '15'},
                        {option: 'D', value: '17'}
                    ],
                    type: 'checkboxInput',
                    checksum: 7362919235
                }
            ];

        };

        httpFactory.getWithCache = function (url, cache) {
            return $http.get(url, cache)
        };

        httpFactory.getSendedAnswers = function () {
            return sendedAnswers
        };
        httpFactory.postAnswers = function (content) {
            sendedAnswers = content
        };

        httpFactory.getCheckedAnswers = function (url) {
            return [
                {
                    question: '5 + 7 - 4', // Вопрос
                    score: 3, // количество баллов за правильный ответ
                    answers: [ //варианты ответов
                        {option: 'A', value: '7', correct: false},
                        {option: 'B', value: '8', correct: true},
                        {option: 'C', value: '9', correct: false},
                        {option: 'D', value: '10', correct: false}
                    ],
                    correct_answers: ['B'],
                    user_answer_correct: {option: 'B', value: '8', correct: true},
                    type: 'radioButton', // тип
                    checksum: 7362919232 // для проверки ответов

                },
                {
                    question: '5 * 4',
                    score: '5',
                    answers: [
                        {option: 'A', value: '15', correct: false},
                        {option: 'B', value: '20', correct: true},
                        {option: 'C', value: '25', correct: false},
                        {option: 'D', value: '30', correct: false}
                    ],
                    correct_answers: ['B'],
                    user_answer: {option: 'C', value: '25', correct: false},
                    type: 'radioButton',
                    checksum: 7362919231
                },
                {
                    question: '5 * 4 - 7',
                    score: 5,
                    correct_answers: ['13'],
                    user_answer: {option: 'C', value: '15', correct: false},
                    type: 'textInput',
                    checksum: 7362919233
                },
                {
                    question: '5 + 12 - 7',
                    score: 4,
                    correct_answers: ['1'],
                    user_answer: {option: 'B', value: '10', correct: true},
                    type: 'textInput',
                    checksum: 7362919234
                },
                {
                    question: '5 * 2 и 5 * 3',
                    score: 8,
                    correct_answers: ['A', 'B'],
                    user_answer: {
                        value: [{option: 'A', value: '10'},
                            {option: 'B', value: '13'}],
                        correct: false
                    },
                    answers: [
                        {option: 'A', value: '10'},
                        {option: 'B', value: '13'},
                        {option: 'C', value: '15'},
                        {option: 'D', value: '17'}],
                    type: 'checkboxInput',
                    checksum: 7362919235
                }
            ]
        };

        return httpFactory
    }]);


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4tcm91dGVzLmpzIiwiYW5zd2Vyc0N0cmwuanMiLCJob21lQ3RybC5qcyIsImZhY3Rvcmllcy9oYW5kbGVBbnN3ZXJzLmpzIiwiZmFjdG9yaWVzL2h0dHBGYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKFwidGVzdFwiLCBbJ3VpLnJvdXRlcicsICduZ0FuaW1hdGUnXSk7XHJcbmFuZ3VsYXIubW9kdWxlKCd0ZXN0JykuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xyXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2hvbWUnKTtcclxuICAgICRsb2NhdGlvblByb3ZpZGVyLmhhc2hQcmVmaXgoJyEnKTtcclxuICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCdob21lJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvaG9tZScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3NyYy9hcHAvaG9tZS5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ2hvbWVDdHJsJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiBcImN0cmxcIlxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnN0YXRlKCdhbnN3ZXJzJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvYW5zd2VycycsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3NyYy9hcHAvYW5zd2Vycy5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ2Fuc3dlcnNDdHJsJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiBcImN0cmxcIlxyXG4gICAgICAgIH0pXHJcbiAgICA7XHJcbn0pO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSDQtNC40LzQsCBvbiAyMi4wNS4yMDE2LlxyXG4gKi9cclxuYW5ndWxhci5tb2R1bGUoJ3Rlc3QnKS5jb250cm9sbGVyKFwiYW5zd2Vyc0N0cmxcIiwgWydodHRwRmFjdG9yeScsICdoYW5kbGVBbnN3ZXJzJywgYW5zd2Vyc0N0cmxdKTtcclxuXHJcbmZ1bmN0aW9uIGFuc3dlcnNDdHJsKGh0dHBGYWN0b3J5LGhhbmRsZUFuc3dlcnMpIHtcclxuXHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGF0LmFuc3dlcnMgPSBodHRwRmFjdG9yeS5nZXRDaGVja2VkQW5zd2VycygpO1xyXG4gICAgdGhhdC5wb2ludHMgPSBoYW5kbGVBbnN3ZXJzLmdldFBvaW50cyh0aGF0LmFuc3dlcnMpO1xyXG5cclxuICAgIHRoYXQucmlnaHRBbnN3ZXJWaWV3ID0gZnVuY3Rpb24gKGEsYXJyKSB7XHJcbiAgICAgICAgIHJldHVybiBoYW5kbGVBbnN3ZXJzLnJpZ2h0QW5zd2VyVmlldyhhLGFycilcclxuICAgIH07XHJcbiAgICB0aGF0LnJpZ2h0QW5zd2VyVmlld0FyciA9IGZ1bmN0aW9uIChhLGFycikge1xyXG4gICAgICAgIHJldHVybiBoYW5kbGVBbnN3ZXJzLnJpZ2h0QW5zd2VyVmlld0FycihhLGFycilcclxuICAgIH07XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSDQtNC40LzQsCBvbiAyMi4wNS4yMDE2LlxyXG4gKi9cclxuYW5ndWxhci5tb2R1bGUoJ3Rlc3QnKS5jb250cm9sbGVyKFwiaG9tZUN0cmxcIiwgW1wiaHR0cEZhY3RvcnlcIiwgXCJoYW5kbGVBbnN3ZXJzXCIsIGhvbWVDdHJsXSk7XHJcblxyXG5mdW5jdGlvbiBob21lQ3RybChodHRwRmFjdG9yeSxoYW5kbGVBbnN3ZXJzKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGF0Lm5vdFN1Ym1pdD0wO1xyXG4gICAgdGhhdC5hbnMgPSB7fTtcclxuICAgIC8v0LfQsNC/0YDQvtGBINCy0L7Qv9GA0L7RgdC+0LIg0L3QsCDRgdC10YDQstC10YBcclxuICAgIHRoYXQucXVlc3Rpb25zID0gaHR0cEZhY3RvcnkuZ2V0KCcnKTtcclxuICAgIHRoYXQuc3VibWl0ID0gZnVuY3Rpb24gKGFucykge1xyXG5cclxuICAgICAgICAvL9C80L7QttC90L4g0LTQstC+0Y/QutC+INC+0LHRgNCw0LHQsNGC0YvQstCw0YLRjCDQutC90L7Qv9C60YMg0L7RgtC/0YDQsNCy0LrQuC4g0LvQuNCx0L4gZGF0YS11aS1zcmVmPVwiYW5zd2Vyc1wiINC60LDQuiDQsiDQv9GA0LjQvNC10YDQtVxyXG4gICAgICAgIC8v0LvQuNCx0L4g0LrQvtC80LDQvdC00L7QuSAkc3RhdGUuZ28oJ2Fuc3dlcnMnKSDQv9C+0YHQu9C1INC+0YLQv9GA0LDQstC60Lgg0L7RgtCy0LXRgtC+0LIg0L3QsCDRgdC10YDQstC10YAsINC90L4g0YLQvtCz0LTQsCDQtNC+0LHQsNCy0LvRj9C10YLRgdGPINC30LDQstC40YHQuNC80L7RgdGC0YwgJHN0YXRlXHJcbiAgICAgICAgdmFyIGFuc3dlcnMgPSBoYW5kbGVBbnN3ZXJzLmRhdGFGb3JTdWJtaXQoYW5zKTtcclxuICAgICAgICAvL9C+0YLQv9GA0LDQstC60LAg0L7RgtCy0LXRgtC+0LIg0L3QsCDRgdC10YDQstC10YBcclxuICAgICAgICBodHRwRmFjdG9yeS5wb3N0QW5zd2VycyhhbnN3ZXJzKTtcclxuICAgICAgICAvLyRzdGF0ZS5nbygnYW5zd2VycycpO1xyXG4gICAgfTtcclxufSIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5INC00LjQvNCwIG9uIDIyLjA1LjIwMTYuXHJcbiAqL1xyXG5hbmd1bGFyLm1vZHVsZSgndGVzdCcpLmZhY3RvcnkoXCJoYW5kbGVBbnN3ZXJzXCIsICBoYW5kbGVBbnN3ZXJzKTtcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUFuc3dlcnMgKCkge1xyXG4gICAgdmFyIGhhbmRsZUFuc3dlcnMgPSB7fTtcclxuXHJcbiAgICBoYW5kbGVBbnN3ZXJzLmdldFBvaW50cyA9IGZ1bmN0aW9uIChhbnN3ZXJzKSB7XHJcbiAgICAgICAgdmFyIGFuc3dlciA9e1xyXG4gICAgICAgICAgICBzY29yZXM6IDAsXHJcbiAgICAgICAgICAgIGFsbFNjb3JlczogMCxcclxuICAgICAgICAgICAgd3JvbmdBbnN3ZXJzOiAwLFxyXG4gICAgICAgICAgICByaWdodEFuc3dlcnM6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGZvcih2YXIgayBpbiBhbnN3ZXJzKSB7XHJcbiAgICAgICAgICAgIGlmKGFuc3dlcnNba10udXNlcl9hbnN3ZXJfY29ycmVjdCkge1xyXG4gICAgICAgICAgICAgICAgYW5zd2VyLnNjb3Jlcys9cGFyc2VJbnQoYW5zd2Vyc1trXS5zY29yZSk7XHJcbiAgICAgICAgICAgICAgICBhbnN3ZXIucmlnaHRBbnN3ZXJzKz0xO1xyXG4gICAgICAgICAgICB9ZWxzZSB7YW5zd2VyLndyb25nQW5zd2Vycys9MX1cclxuICAgICAgICAgICAgYW5zd2VyLmFsbFNjb3Jlcys9cGFyc2VJbnQoYW5zd2Vyc1trXS5zY29yZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYW5zd2VyXHJcbiAgICB9O1xyXG4gICAgaGFuZGxlQW5zd2Vycy5yaWdodEFuc3dlclZpZXcgPSBmdW5jdGlvbiAoYSxhcnIpIHtcclxuICAgICAgICB2YXIgYW5zd2VyID0gYXJyYXlUb1N0cmluZyhhcnIpO1xyXG4gICAgICAgIHZhciBsZXR0ZXJWYWx1ZTtcclxuICAgICAgICBpZiAoYS5hbnN3ZXJzKSB7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSBpbiBhLmFuc3dlcnMpIHtcclxuICAgICAgICAgICAgICAgIGlmKGEuYW5zd2Vyc1tpXS5vcHRpb249PWFuc3dlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldHRlclZhbHVlPWEuYW5zd2Vyc1tpXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ1wiJyArIGFuc3dlciArICcuICcrIGxldHRlclZhbHVlICsgJ1wiJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSByZXR1cm4gYW5zd2VyXHJcbiAgICB9O1xyXG4gICAgaGFuZGxlQW5zd2Vycy5yaWdodEFuc3dlclZpZXdBcnIgPSBmdW5jdGlvbiAoYSxhcnIpIHtcclxuICAgICAgICB2YXIgbGV0dGVyVmFsdWUgPScnO1xyXG4gICAgICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uIChhbnN3ZXIsIGosIGFyKSB7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSBpbiBhLmFuc3dlcnMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhLmFuc3dlcnNbaV0ub3B0aW9uPT1hbnN3ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXR0ZXJWYWx1ZSs9JyAnK2Fuc3dlciArICcuICcrIGEuYW5zd2Vyc1tpXS52YWx1ZSArICcgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiAnXCInICsgbGV0dGVyVmFsdWUgKyAnXCInXHJcbiAgICB9O1xyXG4gICAgaGFuZGxlQW5zd2Vycy5kYXRhRm9yU3VibWl0ID0gZnVuY3Rpb24gKGFucykge1xyXG4gICAgICAgIGZvcih2YXIgayBpbiBhbnMpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhbnNba109PSdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBhbnNba109b2JqVG9BcnIoYW5zW2tdKTsvL9C/0YDQtdC+0LHRgNCw0LfRg9GOINC+0LHRitC10LrRgiDQsiDQvNCw0YHRgdC40LJcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFuc1trXT1bYW5zW2tdXTsvL9C/0YDQtdC+0LHRgNCw0LfRg9GOINGB0YLRgNC+0LrRgyDQsiDQvNCw0YHRgdC40LJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYW5zXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIG9ialRvQXJyIChkKSB7XHJcbiAgICAgICAgdmFyIGFyciA9IFtdO1xyXG4gICAgICAgIGZvcih2YXIgayBpbiBkKSB7XHJcbiAgICAgICAgICAgIGlmIChkW2tdPT10cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBhcnIucHVzaChrKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGFycmF5VG9TdHJpbmcgKGFycikge1xyXG4gICAgICAgIHZhciBzdHJpbmcgPSAnJztcclxuICAgICAgICBhcnIuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpLCBhcnIpIHtcclxuICAgICAgICAgICAgaWYgKGk9PTApIHN0cmluZys9aXRlbTtcclxuICAgICAgICAgICAgZWxzZSBzdHJpbmcrPScsICcraXRlbTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc3RyaW5nXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGhhbmRsZUFuc3dlcnNcclxufVxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSDQtNC40LzQsCBvbiAyMi4wNS4yMDE2LlxyXG4gKi9cclxuYW5ndWxhci5tb2R1bGUoJ3Rlc3QnKS5mYWN0b3J5KCdodHRwRmFjdG9yeScsIFsnJGNhY2hlRmFjdG9yeScsICckaHR0cCcsXHJcbiAgICBmdW5jdGlvbiAoJGNhY2hlRmFjdG9yeSwgJGh0dHApIHtcclxuICAgICAgICB2YXIgY2FjaGUgPSAkY2FjaGVGYWN0b3J5LmdldCgnJGh0dHAnKSxcclxuICAgICAgICAgICAgaHR0cEZhY3RvcnkgPSB7fSxcclxuICAgICAgICAgICAgc2VuZGVkQW5zd2VycyA9IHt9XHJcbiAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgaHR0cEZhY3RvcnkuZ2V0ID0gZnVuY3Rpb24gKHVybCkge1xyXG4gICAgICAgICAgICByZXR1cm4gIFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbjogJzUgKyA3IC0gNCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcmU6IDMsIC8vINC60L7Qu9C40YfQtdGB0YLQstC+INCx0LDQu9C70L7QsiDQt9CwINC/0YDQsNCy0LjQu9GM0L3Ri9C5INC+0YLQstC10YJcclxuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJzOiBbIC8v0LLQsNGA0LjQsNC90YLRiyDQvtGC0LLQtdGC0L7QslxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7b3B0aW9uOiAnQScsIHZhbHVlOiAnNyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7b3B0aW9uOiAnQicsIHZhbHVlOiAnOCd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7b3B0aW9uOiAnQycsIHZhbHVlOiAnOSd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7b3B0aW9uOiAnRCcsIHZhbHVlOiAnMTAnfVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3JhZGlvQnV0dG9uJywgLy8g0YLQuNC/XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tzdW06IDczNjI5MTkyMzIgLy8g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L7RgtCy0LXRgtC+0LJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb246ICc1ICogNCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcmU6IDUsXHJcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7b3B0aW9uOiAnQScsIHZhbHVlOiAnMTUnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge29wdGlvbjogJ0InLCB2YWx1ZTogJzIwJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtvcHRpb246ICdDJywgdmFsdWU6ICcyNSd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7b3B0aW9uOiAnRCcsIHZhbHVlOiAnMzAnfVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3JhZGlvQnV0dG9uJyxcclxuICAgICAgICAgICAgICAgICAgICBjaGVja3N1bTogNzM2MjkxOTIzMVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbjogJzUgKiA0IC0gNycsXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcmU6IDUsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHRJbnB1dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tzdW06IDczNjI5MTkyMzNcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb246ICc1ICsgMTIgLSA3JyxcclxuICAgICAgICAgICAgICAgICAgICBzY29yZTogNCxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dElucHV0JyxcclxuICAgICAgICAgICAgICAgICAgICBjaGVja3N1bTogNzM2MjkxOTIzNFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbjogJzUgKiAyINC4IDUgKiAzJyxcclxuICAgICAgICAgICAgICAgICAgICBzY29yZTogOCxcclxuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtvcHRpb246ICdBJywgdmFsdWU6ICcxMCd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7b3B0aW9uOiAnQicsIHZhbHVlOiAnMTMnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge29wdGlvbjogJ0MnLCB2YWx1ZTogJzE1J30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtvcHRpb246ICdEJywgdmFsdWU6ICcxNyd9XHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2hlY2tib3hJbnB1dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tzdW06IDczNjI5MTkyMzVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaHR0cEZhY3RvcnkuZ2V0V2l0aENhY2hlID0gZnVuY3Rpb24gKHVybCxjYWNoZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHVybCxjYWNoZSlcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBodHRwRmFjdG9yeS5nZXRTZW5kZWRBbnN3ZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VuZGVkQW5zd2Vyc1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaHR0cEZhY3RvcnkucG9zdEFuc3dlcnMgPSBmdW5jdGlvbiAoY29udGVudCkge1xyXG4gICAgICAgICAgICBzZW5kZWRBbnN3ZXJzID0gY29udGVudFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGh0dHBGYWN0b3J5LmdldENoZWNrZWRBbnN3ZXJzID0gZnVuY3Rpb24gKHVybCkge1xyXG4gICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uOiAnNSArIDcgLSA0JywgLy8g0JLQvtC/0YDQvtGBXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcmU6IDMsIC8vINC60L7Qu9C40YfQtdGB0YLQstC+INCx0LDQu9C70L7QsiDQt9CwINC/0YDQsNCy0LjQu9GM0L3Ri9C5INC+0YLQstC10YJcclxuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJzOiBbIC8v0LLQsNGA0LjQsNC90YLRiyDQvtGC0LLQtdGC0L7QslxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7b3B0aW9uOiAnQScsIHZhbHVlOiAnNycsIGNvcnJlY3Q6IGZhbHNlfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge29wdGlvbjogJ0InLCB2YWx1ZTogJzgnLCBjb3JyZWN0OiB0cnVlfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge29wdGlvbjogJ0MnLCB2YWx1ZTogJzknLCBjb3JyZWN0OiBmYWxzZX0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtvcHRpb246ICdEJywgdmFsdWU6ICcxMCcsIGNvcnJlY3Q6IGZhbHNlfVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgY29ycmVjdF9hbnN3ZXJzOiBbJ0InXSxcclxuICAgICAgICAgICAgICAgICAgICB1c2VyX2Fuc3dlcl9jb3JyZWN0OiB7b3B0aW9uOiAnQicsIHZhbHVlOiAnOCcsIGNvcnJlY3Q6IHRydWV9LFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdyYWRpb0J1dHRvbicsIC8vINGC0LjQv1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrc3VtOiA3MzYyOTE5MjMyIC8vINC00LvRjyDQv9GA0L7QstC10YDQutC4INC+0YLQstC10YLQvtCyXHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbjogJzUgKiA0JyxcclxuICAgICAgICAgICAgICAgICAgICBzY29yZTogJzUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuc3dlcnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge29wdGlvbjogJ0EnLCB2YWx1ZTogJzE1JywgY29ycmVjdDogZmFsc2V9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7b3B0aW9uOiAnQicsIHZhbHVlOiAnMjAnLCBjb3JyZWN0OiB0cnVlfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge29wdGlvbjogJ0MnLCB2YWx1ZTogJzI1JywgY29ycmVjdDogZmFsc2V9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7b3B0aW9uOiAnRCcsIHZhbHVlOiAnMzAnLCBjb3JyZWN0OiBmYWxzZX1cclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvcnJlY3RfYW5zd2VyczogWydCJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcl9hbnN3ZXI6IHtvcHRpb246ICdDJywgdmFsdWU6ICcyNScsIGNvcnJlY3Q6IGZhbHNlfSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncmFkaW9CdXR0b24nLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrc3VtOiA3MzYyOTE5MjMxXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uOiAnNSAqIDQgLSA3JyxcclxuICAgICAgICAgICAgICAgICAgICBzY29yZTogNSxcclxuICAgICAgICAgICAgICAgICAgICBjb3JyZWN0X2Fuc3dlcnM6IFsnMTMnXSxcclxuICAgICAgICAgICAgICAgICAgICB1c2VyX2Fuc3dlcjoge29wdGlvbjogJ0MnLCB2YWx1ZTogJzE1JywgY29ycmVjdDogZmFsc2V9LFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0SW5wdXQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrc3VtOiA3MzYyOTE5MjMzXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uOiAnNSArIDEyIC0gNycsXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcmU6IDQsXHJcbiAgICAgICAgICAgICAgICAgICAgY29ycmVjdF9hbnN3ZXJzOiBbJzEnXSxcclxuICAgICAgICAgICAgICAgICAgICB1c2VyX2Fuc3dlcjoge29wdGlvbjogJ0InLCB2YWx1ZTogJzEwJywgY29ycmVjdDogdHJ1ZX0sXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHRJbnB1dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tzdW06IDczNjI5MTkyMzRcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb246ICc1ICogMiDQuCA1ICogMycsXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcmU6IDgsXHJcbiAgICAgICAgICAgICAgICAgICAgY29ycmVjdF9hbnN3ZXJzOiBbJ0EnLCAnQiddLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJfYW5zd2VyOiB7dmFsdWU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFt7b3B0aW9uOiAnQScsIHZhbHVlOiAnMTAnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgIHtvcHRpb246ICdCJywgdmFsdWU6ICcxMyd9XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29ycmVjdDogZmFsc2V9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFuc3dlcnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge29wdGlvbjogJ0EnLCB2YWx1ZTogJzEwJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtvcHRpb246ICdCJywgdmFsdWU6ICcxMyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7b3B0aW9uOiAnQycsIHZhbHVlOiAnMTUnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge29wdGlvbjogJ0QnLCB2YWx1ZTogJzE3J31dLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjaGVja2JveElucHV0JyxcclxuICAgICAgICAgICAgICAgICAgICBjaGVja3N1bTogNzM2MjkxOTIzNVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGh0dHBGYWN0b3J5XHJcbiAgICB9XSk7XHJcblxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
