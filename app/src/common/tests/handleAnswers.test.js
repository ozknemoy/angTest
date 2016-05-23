/**
 * Created by дима on 22.05.2016.
 */

describe('тест алгоритма фабрики handleAnswers', function () {
    var handleAnswers;
    beforeEach(function () {
        module('testFactory');
        inject(function (_handleAnswers_) {
            handleAnswers = _handleAnswers_;
        })
    });

    it('метод getPoints', function () {

        var inObj = [
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
        ];
        var outObj = {
            scores: 3,
            allScores: 25,
            wrongAnswers: 4,
            rightAnswers: 1
        };

        expect(handleAnswers.getPoints(inObj)).toEqual(outObj)
    });
    it('метод rightAnswerView', function () {

        var inObj =
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

        };

        expect(handleAnswers.rightAnswerView(inObj, ["B"])).toEqual('"B. 8"')
    });
    it('метод rightAnswerViewArr', function () {

        var inObj =
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
        };

        expect(handleAnswers.rightAnswerViewArr(inObj, ["A", "B"])).toEqual('" A. 10  B. 13 "')
    });

    it('метод формата отправки ответов на сервер dataForSubmit', function () {

        var inObj = {
            "7362919232": "B",
            "7362919231": "A",
            "7362919233": "1",
            "7362919234": "1",
            "7362919235": {"A": true, "B": true}
        };
        var outObj = {
            7362919232: ["B"],
            7362919231: ["A"],
            7362919233: ["1"],
            7362919234: ["1"],
            7362919235: ["A", "B"]
        };

        expect(handleAnswers.dataForSubmit(inObj)).toEqual(outObj)
    });
});
