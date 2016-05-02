// ==UserScript==
// @name         Workload Calc
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://socialbitde.atlassian.net/issues/*
// @grant        none
// ==/UserScript==
var oneDayMinutes = 480;
function parseMinutes(minutes){ // 7450
    var m = minutes;
    var days = 0;
    var hours = 0;
    if (m>=oneDayMinutes){ // >= 1day
        days = Math.floor(m/oneDayMinutes);
        m-= days*oneDayMinutes;
    }
    if (m>=60){
        hours = Math.floor(m/60);
        m-= hours*60;
    }
    return {
        days: days,
        hours: hours,
        minutes: m
    };
}

(function() {
    'use strict';
    var times = [];
    $('.timeoriginalestimate').each(function(i, e){
        var text = $(e).text();
        var textSplitted = text.split(',');
        textSplitted.forEach(function(element){
            var elements = element.trim().split(' ');
            if (elements.length === 0) return;
            if (elements[0] === "") elements.shift();
            times.push({time: parseInt(elements[0]), type: elements[1]});
        });
    });
    var minutes = 0;
    times.forEach(function time(t, index){
        switch(t.type){
            case 'minute':
            case 'minutes':
                minutes+=t.time;
                break;
            case 'hour':
            case 'hours':
                minutes+=t.time*60;
                break;
            case 'day':
            case 'days':
                minutes+=t.time*60*8;
                break;
        }
    });
    var parsed = parseMinutes(minutes);
    console.log(parsed);
   var overlay = $('<div style="background-color: #3b7fc4; color: white; border-radius: 0; box-shadow: none; float: left; padding: 11px 20px 0 20px; height: 30px; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;">').html(parsed.days + ' days ' + parsed.hours + ' hours ' + parsed.minutes + ' minutes');
    overlay.appendTo('#quicksearch');

})();
