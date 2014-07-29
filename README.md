sequelize-importer
==================

Create sequelize defentions from a mysql dump.

## Installation

    npm install sequelize-importer

## Usage

    mysqldump --no-data my_database  | sequelize-importer -

## Options

  Usage: sequelize-importer [options] [command]

  Commands:

    *
       Parse mysql and output the AST


  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -a, --ast            Just render the AST
    -o, --output [file]  Output file

## Status

This software is currently in *ALPHA* status. I've tested the tokenizer and parser against
a large dataset, so I'm fairly confident in the AST output. However, the generated sequelize
may need some more work.

Most notably, TESTS are lacking completely. Unfortunately I am not in the position to disclose
my test suite at the moment.

## Contributing

I'm writing this to automate the migration from a legacy project, and because of the lack
of a decent importer for `sequelize`. I haven't even decided yet on `sequelize`, but the AST
should now make it possible to port this code to other solutions (if any).

Help is much appreciated; especially the renderer needs a lot of work - currently the outputted
`define` code is very basic at the least.


