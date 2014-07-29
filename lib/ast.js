'use strict';

function literal(ast, token) {
    ast.children.push({
        type: 'literal',
        name: token.value
    });
}

function property(ast, token) {
    var parent = ast.children.slice(-1).shift();
    parent[token.name] = token.value;
}

function traverse(tokens, ast) {
    var token = tokens.shift();

    if (!token) return ast;
    if (token.close) return ast;
    if (token.literal) literal(ast, token);
    if (token.prop) property(ast, token);
    if (token.attr) ast.attributes.push(token);

    if (token.statement) {
        ast.body = ast.body || [];

        ast.body.push({
            type: 'statement',
            name: token.name,
            value: token.value,
            children: [],
            attributes: [],
        });

        tokens.shift(); // removes 'open' token
        traverse(tokens, ast.body.slice(-1).pop());
    }


    return traverse(tokens, ast);
}

module.exports = function parser(tokens) {

    return traverse(tokens, {});
};
