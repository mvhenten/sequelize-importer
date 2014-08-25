'use strict';

var Jack = require('./jack'),
    escodegen = require('escodegen');

var mapping = {
    longblob: 'BLOB',
    int: 'INTEGER',
    varchar: 'STRING',
    char: 'STRING',
    decimal: 'FLOAT',
    tinyint: 'INTEGER',
    text: 'TEXT',
    timestamp: 'DATE',
    date: 'DATE',
    time: 'DATE',
    datetime: 'DATE',
    float: 'FLOAT',
    double: 'BIGINT',
    blob: 'BLOB',
    mediumblob: 'BLOB',
    varbinary: 'STRING.BINARY',
    binary: 'STRING.BINARY',
    enum: 'ENUM',
};

function sequelize(method) {
    var seq = Jack.Util.MemberExpression('Sequelize', method);
    seq.arguments = seq.arguments.concat(Array.prototype.slice.call(arguments, 1));

    return seq;
}

function Generator(name) {
    this.name = name;
}

Generator.prototype = {
    get document() {
        var program = new Jack.Program()
            .append(new Jack.Var().declare(this.name, this.seq).document);

        return program.document;
    },

    get seq() {
        return sequelize('define', Jack.Util.Literal(this.name), this._fields.document);
    },

    get code() {
        return escodegen.generate(this.document);
    },

    toString: function(indent) {
        return JSON.stringify(this.program.document, null, indent || 2);
    },

    fields: function(fields) {
        var attributes = fields.reduce(function(attr, field) {
            attr[field.name] = new Jack.Object().attributes({
                type: sequelize(mapping[field.typeDef.type], Jack.Util.Literal(field.size)),
                allowNull: Jack.Util.Literal(field.notNull),
                defaultValue: Jack.Util.Literal(field.defaultValue)
            }).document;

            return attr;
        }, {});

        this._fields = new Jack.Object().attributes(attributes);

        return this;
    }
};

module.exports = Generator;
