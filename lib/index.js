/*
 * etfs
 *
 * Copyright 2026, Qumundo e.K.
 * Author: Qumundo e.K. <https://www.qumundo.com>
 */

"use strict";

let example = require("../res/example.json");

let url_base = "https://api.qumundo.com/v1/";
let url_path = "etfs/search?";

let options = {
  method: "POST",
  headers: {
    "Accept": "*/*",
    "Content-Type": "application/json",
  }
};


/**
 * ETFs
 * @class
 * @classdesc  Instanciates a ETFs object
 */
let ETFs = function() {
  this.email = '';
  this.password = '';
};


/**
 * ETFs.prototype.getLogin
 * @public
 * @param  {object} [body]
 * @return {object} Promise object
 */
ETFs.prototype.getLogin = async function( body ) {

	try {

    if(body){
      options.body = JSON.stringify(body);
    } else {
      options.body = JSON.stringify({});
    }

    let response = await fetch(url_base + 'login', options)
      .then((response) => response.json())
      .then((data) => data)
      .catch(error => console.error(error));

    return response;

  } catch(error) {
    console.log(error);
    return false;
  }

};


/**
 * ETFs.prototype.getExample
 * @public
 * @param  {boolean} [request]
 * @param  {boolean} [response]
 * @return {object} Promise object
 */
 ETFs.prototype.getExample = async function( request, response ) {

 	try {

    if( request === undefined && response === undefined ){
      request = true;
      response = true;
    }

     request = ( request || false );
     response = ( response || false );

     let obj = {};

     if(request && response){
       if(request.path || response.path){
         if(request.path && example[request.path]){
           if(!obj[request.path]){
             obj[request.path] = {};
           }
           obj[request.path]["items"] = example[request.path]['items'];
         }
         if(response.path && example[response.path]){
           if(!obj[response.path]){
             obj[response.path] = {};
           }
           obj[response.path]["200"] = example[response.path]['200'];
         }
       } else {
         obj = example;
       }
     } else if (request){
       if(request.path && example[request.path]){
         obj = example[request.path]['items'];
       } else {
         for (var el in example) {
           obj[el] = { "items": example[el]['items'] };
         }
       }
     } else if (response){
        if(response.path && example[response.path]){
           obj = example[response.path]['200'];
         } else {
           for (var el in example) {
             obj[el] = { "200": example[el]['200'] };
           }
         }
     } else {
       obj = {};
     }

     return Promise.resolve(obj);

   } catch(error) {
     console.log(error);
     return false;
   }

 };


/**
 * ETFs.prototype.getData
 * @public
 * @param  {string} [url]
 * @param  {string} [token]
 * @return {object} Promise object
 */
ETFs.prototype.getData = async function( url, token ) {

	try {

    if(token && typeof token === 'string'){
      options.headers['authorization'] = 'Bearer ' + token;
    }

    let url_fetch = url_base + url_path;

    if(url && url.path){
      url_fetch = url_base + url.path;
    }

    if(url && url.items && Array.isArray(url.items) && url.items.length){
      let items = url.items;
      for (var i = 0; i < items.length; i++) {
        if(items[i] && items[i].key && items[i].value){
          if(url && url.path && url.path.includes('db=')){
            url_fetch += '&';
          } else if(i > 0){
            url_fetch += '&';
          }
          if(items[i].filter){
            url_fetch += items[i].key + items[i].filter + items[i].value;
          } else {
            url_fetch += items[i].key + '=' + items[i].value;
          }
          if(items[i].value.includes(',') && items[i].operator && ['and', 'or'].includes(items[i].operator)){
            url_fetch += '[' + items[i].operator + ']';
          }
        }
      }
    }

    if(url && url.items && Array.isArray(url.items) && url.items.length > 0 && url.operator && ['and', 'or'].includes(url.operator)){
      url_fetch += '&operator=' + url.operator;
    }

    let response = await fetch(url_fetch, options)
      .then((response) => response.json())
      .then((data) => data)
      .catch(error => console.error(error));

    return response;

  } catch(error) {
    console.log(error);
    return false;
  }

};


module.exports = new ETFs();
