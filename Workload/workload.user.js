// ==UserScript==
// @name         Workload Calc
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://socialbitde.atlassian.net/issues/*
// @grant        none
// ==/UserScript==

function parseMinutes(minutes){ // 7450
    var m = minutes;
    var days = 0;
    var hours = 0;
    if (m>=1440){ // >= 1day
        days = Math.floor(m/1440);
        m-= days*1440;
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
                minutes+=t.time*60*24;
                break;
        }
    });
    var parsed = parseMinutes(minutes);
    console.log(parsed);
    var overlay = $('<div  style="position: fixed; top: 41px; left: 0; background-color: rgba(0,0,0,0.5); color: white; padding: 4px">').html(parsed.days + ' days ' + parsed.hours + ' hours ' + parsed.minutes + ' minutes');
    $('body').prepend(overlay);
})();
