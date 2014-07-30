'use strict';

var sprintf = require('sprintf'),
    camelize = require('change-case').pascalCase;


var mapping = {
    longblob: 'BLOB',
    int: 'INTEGER',
    varchar: 'STRING',
    char: 'STRING',
    decimal: 'FLOAT',
    tinyint: 'INT',
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

function renderField(field) {
    var collect = [],
        type = sprintf('type: Sequelize.%s', mapping[field.typeDef.type]);

    if (field.size) {
        type = sprintf('%s(%s)', type, field.size);
    }

    if (field.typeDef.type == 'enum') {

        type = sprintf('%s(%s)', type, field.typeDef.values.map(function(v) {
            return sprintf('"%s"', v);
        }).join(','));
    }

    collect.push(type);

    if (!field.allowNull) {
        collect.push('allowNull: false');
    }

    if (field.default !== undefined) {
        if (typeof field.default === 'string')
            field.default = sprintf('"%s"', field.default);

        collect.push(sprintf('defaultValue: %s', field.default));
    }

    return sprintf('%s: {%s}', field.name, collect.join(', '));
}


function fields(children) {
    return sprintf('{\n%s\n}', children.map(renderField).join(',\n'));
}

function define(stm) {
    var name = camelize(stm.value),
        config = sprintf('{ tableName: "%s", timestamps: false }', stm.value),
        str = sprintf('var %s = Sequelize.define( "%s", %s, %s );\n', name, name, fields(stm.children), config);

    return str;

}

module.exports = function render(ast) {
    var js = ast.body.reduce(function(tables, stm) {
        return tables.concat(define(stm));
    }, []);

    return js.join('\n');
};
