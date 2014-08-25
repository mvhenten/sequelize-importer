'use strict';

var Jack = {};

Jack.Util = {
    Identifier: function(name) {
        return {
            type: 'Identifier',
            name: name,
        };
    },

    Literal: function(value) {
        return {
            type: 'Literal',
            value: value === undefined ? null : value,
        };
    },

    MemberExpression: function(obj, name) {
        var args = Array.prototype.slice.call(arguments, 2);

        return {
            type: 'CallExpression',
            callee: {
                type: 'MemberExpression',
                computed: false,
                object: Jack.Util.Identifier(obj),
                property: Jack.Util.Identifier(name),
            },
            arguments: args,
        };
    },

    ObjectExpression: function() {
        return {
            type: 'ObjectExpression',
            properties: [],
        };
    },

    Property: function(name, value) {
        return {
            type: 'Property',
            kind: 'init',
            key: Jack.Util.Identifier(name),
            value: value
        };
    }
};

Jack.Object = function() {
    this.document = Jack.Util.ObjectExpression();
};

Jack.Object.prototype = {
    attribute: function(name, value) {
        this.document.properties.push(Jack.Util.Property(name, value));
        return this;
    },

    attributes: function(values) {
        for (var key in values) {
            this.attribute(key, values[key]);
        }

        return this;
    }
};

Jack.Var = function() {
    this.document = {
        type: 'VariableDeclaration',
        kind: 'var',
        declarations: [],
    };
};

Jack.Var.prototype = {
    declare: function(name, init) {
        this.document.declarations.push({
            type: 'VariableDeclarator',
            id: Jack.Util.Identifier(name),
            init: init,
        });

        return this;
    }
};

Jack.Program = function() {
    this.document = {
        type: 'Program',
        body: []
    };
};

Jack.Program.prototype = {
    append: function(value) {
        this.document.body.push(value);
        return this;
    }
};

module.exports = Jack;
