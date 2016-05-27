# angTest
Front-End разработчик
Разработать приложение на AngularJS, позволяющее пройти простое тестирование
из 5 различных вопросов. 2 вопроса на ввод ответа в поле(textInput), 2 вопроса на
выбор одного варианта ответа(radioButton). и один вопрос с выбором нескольких
вариантов(checkboxInput).
При загрузке приложение подгружает вопросы(пример будет ниже), после нажатие
пользователем отправить, приложение отправляет ответы на сервер, и получает
JSON с проверенными вопросам.
Запрос правильных ответов формируется вида:
{
'checksum': ['answer', 'answer']
...
7362919232: ['A'],
7362919235: ['D', 'C'],
}
Вопросы на странице с вопросам должна выглядеть примерно так:
__________________________________________________
1. 5 + 7 4
() A. 7
() B. 8
() C. 9
() D. 10
__________________________________________________
2. 5 * 4
() A. 7
() B. 8
() C. 9
() D. 10
__________________________________________________
Страница с результатами, примерно так:
Вы набрали N баллов.
3 правильных ответа.
2 не правильных.
__________________________________________________
1. 5 + 7 4
Ваш ответ: "A. 7" не
правильно
Правильный ответ: "B. 8" правильно
__________________________________________________
2. 5 * 4
Ваш ответ: "A. 7" не
правильно
Правильный ответ: "B. 8" правильно
__________________________________________________
Важные части:
1. Запросы и ответы сервера просто имитируем в скрипте с помощью какихнибудь
factory.
2. Неправильные и правильные ответы какнибудь
визуально разделять(например
цветом, зеленый и красный)
3. Ответы на все вопросы Обязательны, нельзя отправить форму без введенных
ответов.
4. Страница результатов это отдельная страница.
5. Можно использовать разные модули и библиотеки на свое усмотрение.
6. Покрытие тестами обязательно.
7. Учтёте мелочи которые не указаны в задании, плюс.
8. Если будет сделано помощью сборщика(gulp, grunt) это плюс.
9. Если будут использованы прекомпиляторы CoffeeScript, Jade это плюс.
10. Верстку, делаем как угодно сами, главное чтобы выглядело более менее
прилично.
Ответ сервера на получение вопросов:
[
{
question: '5 + 7 4',
// Вопрос
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
question: '5 * 4 7',
score: 5,
type: 'textInput',
checksum: 7362919233
},
{
question: '5 + 12 7',
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
]
Ответ сервера, на отправку ответов пользователя:
[
{
question: '5 + 7 4',
// Вопрос
score: 3, // количество баллов за правильный ответ
answers: [ //варианты ответов
{option: 'A', value: '7', correct: false},
{option: 'B', value: '8', correct: true},
{option: 'C', value: '9', correct: false},
{option: 'D', value: '10', correct: false}
],
correct_answers: [‘B’],
user_answer_correct: {option: 'B', value: '8', correct: true},
type: 'radioButton', // тип
checksum: 7362919232 // для проверки ответов
},
{
question: '5 * 4',
score: 5,
answers: [
{option: 'A', value: '15', correct: false},
{option: 'B', value: '20', correct: true},
{option: 'C', value: '25', correct: false},
{option: 'D', value: '30', correct: false}
],
correct_answers: [‘B’],
user_answer: {option: 'C', value: '25', correct: false},
type: 'radioButton',
checksum: 7362919231
},
{
question: '5 * 4 7',
score: 5,
correct_answers: [‘13’],
user_answer: {value: '15', correct: false},
type: 'textInput',
checksum: 7362919233
},
{
question: '5 + 12 7',
score: 4,
correct_answers: [‘10’],
user_answer: {value: '10', correct: true},
type: 'textInput',
checksum: 7362919234
},
{
question: '5 * 2 и 5 * 3',
score: 8,
correct_answers: [‘A’, ‘B’],
user_answer: {value: [{option: 'A', value: '10'}, {option: 'B', value: '13'}],
correct: false},
answers: [
{option: 'A', value: '10'},
{option: 'B', value: '13'},
{option: 'C', value: '15'},
{option: 'D', value: '17'}
],
type: 'checkboxInput',
checksum: 7362919235
}
]
