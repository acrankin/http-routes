const request = require('supertest');

const bodyParser = require('../lib/body-parser');
const http = require('http');

describe('body parser', () => {
    let request;
    beforeEach(() => {
        request = new http.ClientRequest();
        request.method = 'POST';
        request.setHeader('Content-Type', 'text/html');
    });

    it('errors if content-type is not JSON', () => {
        request.setHeader('Content-Type', 'text/html');

        const promise = bodyParser(request).catch(err => {
            expect(err).toEqual('Only supports JSON!');
        });

        request.emit('data', '<html></html>');
        request.emit('end');

        return promise;
    });

    it('parses a json request', () => {
        request.setHeader('Content-Type', 'application/json');

        const promise = bodyParser(request).then(body => {
            expect(body).toEqual({ name: 'Capybara'});
        });

        request.emit('data', '{ "name": "Capybara" }');
        request.emit('end');

        return promise;
    });
});
