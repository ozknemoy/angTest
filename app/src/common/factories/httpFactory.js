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

