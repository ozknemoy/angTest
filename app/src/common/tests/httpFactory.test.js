/**
 * Created by дима on 22.05.2016.
 */
describe('backend httpFactory', function () {

    var httpFactory, injector, backend;
    beforeEach(module('http'));
    beforeEach(inject(function (_httpFactory_, $httpBackend) {

        httpFactory = _httpFactory_;
        backend = $httpBackend;
        var response = [
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
        backend.when('GET', '/ans').respond(response);
    }));
    afterEach(function () {
        //backend.verifyNoOutstandingExpectation();
        //backend.verifyNoOutstandingRequest();
    });

    it('httpFactory', function () {
        var response = [
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

        backend.expect('GET', '/ans').respond(1);

        expect(httpFactory.get('/ans')).toEqual(response);
        backend.expectGET('/ans');
    });
});
