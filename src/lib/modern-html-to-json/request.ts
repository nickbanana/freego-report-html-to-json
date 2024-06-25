import parse from './parse';

function createParser = (filter) => {
    return new Parser(filter);
}

function createMethod = (filter) => {
    return method(filter);
}

export {
    ParseContext,
    Parser,
    parse as Parse,
    request,
    batch,
    createParser,
    createMethod,
}