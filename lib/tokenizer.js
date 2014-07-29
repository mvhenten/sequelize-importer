var Lexer = require('lex'),
    util = require('util'),
    fs = require('fs');

var tokendef = [
    {
      match: /--.+/,
      type: 'comment',
      value: function( lexeme ){
        return lexeme;
      }
    },
    {
      match: /\/\*.+/,
      type: 'comment',
      value: function( lexeme ){
        return lexeme;
      }
    },
    {
        match: /DROP TABLE .+\;/,
        type: 'ignore',
        value: function( lexeme ){
            return lexeme;
        }
    },
    {
        match: /.+ KEY .+\)/,
        type: 'attr',
        name: 'primaryKey',
        value: function( lexeme ){
            return lexeme;
        },
    },
    {
        match: /\s+UNIQUE KEY.+/,
        type: 'attr',
        name: 'uniqueKey',
        value: function( lexeme ){
            var match = lexeme.match(/`(.+?)`/g).map(function(str){
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
        type: 'attr',
        name: 'key',
        value: function( lexeme ){
            var match = lexeme.match(/`(.+?)`/g).map(function(str){
                return str.replace(/`/g, '');
            });

            return {
                name: match[0],
                references: [ match[1] ]
            };
        },
    },
    {
        match: /\s+PRIMARY KEY.+/,
        type: 'attr',
        name: 'primaryKey',
        value: function( lexeme ){
            var match = lexeme.match(/`(.+?)`/g).map(function(str){
                return str.replace(/`/g, '');
            });

            return match[0];
        },
    },
    {
        match: /CREATE TABLE `.+?`/,
        type: 'statement',
        name: 'createTable',
        value: function( lexeme, a ){
            return lexeme.match(/`(.+)`/)[1];
        },
    },
    {
        match: /\(/,
        type: 'open'
    },
    {
        match: /\)/,
        type: 'close',
    },
    {
        match: /`(\w+)`/,
        type: 'literal',
        value: function(lexeme){
            return lexeme.replace(/`/g, '');
        },
    },
    {
        match: /(int|varchar|char|decimal|tinyint|longblob|text|timestamp|date|datetime)/,
        type: 'prop',
        name: 'typeDef',
        value: function (lexeme) {
            var hint = String;

            if( /int|decimal/.test(lexeme) ) hint = Number;
            if( /(date|datetime|timestamp)/.test(lexeme) ) hint = Date;

            return {
                type: lexeme,
                typeHint: hint,
                typeHintString: hint.toString().replace(/function (\w+).+/, '$1'),
            };
            return lexeme;
        },
    },
    {
        match: /[set|enum]\(.+?\)/,
        type: 'prop',
        name: 'typeDef',
        value: function (lexeme) {
            return {
                type: 'enum',
                typeHint: Array,
                typeHintString: Array.toString().replace(/function (\w+).+/, '$1'),
                values: lexeme.match(/'(.+?)'/g).map( function(str){ return str.replace(/'/g, ''); } )
            }
        },
    },
    {
        match: /DEFAULT\s+'(.*?)'/i,
        type: 'prop',
        name: 'default',
        value: function( lexeme ){
            return lexeme.replace(/DEFAULT\s+/i, '').replace(/'/g, '');
        },
    },
    {
        match: /NOT NULL/,
        type: 'prop',
        name: 'notNull',
        value: true,
    },
    {
        match: /\([,\d]+\)/,
        type: 'prop',
        name: 'size',
        value: function( lexeme ){
            return parseInt(lexeme.replace(/\((.+)\)/, '$1'));
        }
    }
];

module.exports = function tokenize( source ){
    var tokens = [],
        lexer = new Lexer(function(c){});

    tokendef.forEach(function(def){
        lexer.addRule( def.match, function(lexeme){
            var token = {
                type: def.type,
                value: typeof def.value === 'function' ? def.value(lexeme) : def.value,
                name: def.name,
                lexeme: lexeme,
            };

            token[def.type] = true;

            tokens.push( token );
        });
    });

    //lexer.setInput('CREATE TABLE `item`');
    lexer.setInput(source);
    lexer.lex();

    return tokens;
};
