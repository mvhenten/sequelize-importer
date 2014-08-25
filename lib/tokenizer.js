'use strict';

var Lexer = require('lex');

var tokendef = [
    {
        match: /--.+/,
        kind: 'comment',
        value: function(lexeme) {
            return lexeme;
        }
    },
    {
        match: /\/\*.+/,
        kind: 'comment',
        value: function(lexeme) {
            return lexeme;
        }
    },
    {
        match: /DROP TABLE .+\;/,
        kind: 'ignore',
        value: function(lexeme) {
            return lexeme;
        }
    },
    {
        match: /INSERT .+\;/,
        kind: 'ignore',
        value: function(lexeme) {
            return lexeme;
        }
    },
    {
        match: /LOCK .+\;/,
        kind: 'ignore',
        value: function(lexeme) {
            return lexeme;
        }
    },
    {
        match: /.+ KEY .+\)/,
        kind: 'attr',
        name: 'primaryKey',
        value: function(lexeme) {
            return lexeme;
        },
    },
    {
        match: /\s+UNIQUE KEY.+/,
        kind: 'attr',
        name: 'uniqueKey',
        value: function(lexeme) {
            var match = lexeme.match(/`(.+?)`/g).map(function(str) {
                return str.replace(/`/g, '');
            });

            return {
                name: match[0],
                references: match.slice(1),
            };
        },
    },
    {
        match: /\s+KEY.+/,
        kind: 'attr',
        name: 'key',
        value: function(lexeme) {
            var match = lexeme.match(/`(.+?)`/g).map(function(str) {
                return str.replace(/`/g, '');
            });

            return {
                name: match[0],
                references: [match[1]]
            };
        },
    },
    {
        match: /\s+PRIMARY KEY.+/,
        kind: 'attr',
        name: 'primaryKey',
        value: function(lexeme) {
            var match = lexeme.match(/`(.+?)`/g).map(function(str) {
                return str.replace(/`/g, '');
            });

            return match[0];
        },
    },
    {
        match: /CREATE TABLE `.+?`/,
        kind: 'statement',
        name: 'createTable',
        value: function(lexeme) {
            return lexeme.match(/`(.+)`/)[1];
        },
    },
    {
        match: /\(/,
        kind: 'open'
    },
    {
        match: /\)/,
        kind: 'close',
    },
    {
        match: /`(\w+)`/,
        kind: 'literal',
        value: function(lexeme) {
            return lexeme.replace(/`/g, '');
        },
    },
    {
        match: /(int|float|double|varchar|varbinary|binary|char|decimal|tinyint|blob|\w+blob|text|time|timestamp|date|datetime)(\([,\d]+\))?/,
        kind: 'prop',
        name: 'type',
        value: function(lexeme) {
            var m = lexeme.match(/(\w+).?([,\d]+)?/);


            return {
                type: m[1],
                size: m[2]
            };
        },
    },
    {
        match: /[set|enum]\(.+?\)/,
        kind: 'prop',
        name: 'type',
        value: function(lexeme) {
            return {
                type: 'enum',
                values: lexeme.match(/'(.+?)'/g).map(function(str) {
                    return str.replace(/'/g, '');
                })
            };
        },
    },
    {
        match: /DEFAULT\s+'(.*?)'/i,
        kind: 'prop',
        name: 'defaultValue',
        value: function(lexeme) {
            var value = lexeme.replace(/DEFAULT\s+/i, '').replace(/'/g, '');

            if (/\d+/.test(value)) {
                return parseInt(value);
            }

            if (/[,\d]+/.test(value)) {
                return parseFloat(value);
            }

            return value;
        },
    },
    {
        match: /NOT NULL/,
        kind: 'prop',
        name: 'allowNull',
        value: true,
    }
];

module.exports = function tokenize(source) {
    var tokens = [],
        lexer = new Lexer(function() {});

    tokendef.forEach(function(def) {
        lexer.addRule(def.match, function(lexeme) {
            var token = {
                kind: def.kind,
                value: typeof def.value === 'function' ? def.value(lexeme) : def.value,
                name: def.name,
                lexeme: lexeme,
            };

            token[def.kind] = true;

            tokens.push(token);
        });
    });

    //lexer.setInput('CREATE TABLE `item`');
    lexer.setInput(source);
    lexer.lex();

    return tokens;
};
