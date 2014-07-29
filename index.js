'use strict';

var parser = require('./lib/ast'),
    stdin = require('stdin'),
    tokenize = require('./lib/tokenizer');


//var source = "\
//CREATE TABLE `item` (\
//  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
//  `slug` varchar(64) NOT NULL DEFAULT '',\
//  `type` varchar(255) NOT NULL DEFAULT '',\
//  `priority` int(10) unsigned NOT NULL DEFAULT '0',\
//  `parent` int(10) unsigned NOT NULL DEFAULT '0',\
//  `visible` tinyint(2) unsigned NOT NULL DEFAULT '0',\
//  `name` varchar(255) NOT NULL DEFAULT '',\
//  `description` text,\
//  `appendix` longblob NOT NULL,\
//  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',\
//  `inserted` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',\
//  PRIMARY KEY (`id`)\
//) ENGINE=MyISAM AUTO_INCREMENT=102 DEFAULT CHARSET=latin1;\
//";

stdin(function(source) {
    console.log(JSON.stringify(parser(tokenize(source)), null, 4));
});
