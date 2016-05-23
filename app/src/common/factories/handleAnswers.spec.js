/**
 * Created by дима on 22.05.2016.
 */
angular.module('testFactory', []).factory("handleAnswers", handleAnswers);

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

