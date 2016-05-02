// ==UserScript==
// @name         Workload Calc
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://socialbitde.atlassian.net/issues/*
// @grant        none
// ==/UserScript==

function parseMinutes(minutes){
    var m = minutes;
    var days = 0;
    var hours = 0;
    if (m>=1440){
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

    var times = $('.timeoriginalestimate').map(function(i, e){ var t = $(e).text().split(' '); return {time: parseInt(t[0]), type: t[1]}; });
    var minutes = 0;
    times.each(function time(i, t){
        switch(t.type){
            case 'minutes':
                minutes+=t.time;
                break;
            case 'hours':
                minutes+=t.time*60;
                break;
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
