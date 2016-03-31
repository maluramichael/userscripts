// ==UserScript==
// @name         Socialbit Überstunden Calculator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       michael malura
// @match        http://v2.socialbit.de/acp/zeitverwaltung/monatsuebersicht/*/benutzer/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */

var nettoFactor = 0.6;
var euroPerHour = 15;

var timeCells = $('tr>td:last-child.color');

// filter week and free days
timeCells = timeCells.filter(function(){
    return ($(this).hasClass('green')) || ($(this).hasClass('red'));
});

// extract the times
var timeString = timeCells.text().trim();

// split times into an array and create fancy objects from them
var times = timeString.split(' ').map(function(time){
    var parsedTime = {
        hours: parseInt(time.substring(0, time.indexOf(':'))),
        minutes: parseInt(time.substring(time.indexOf(':')+1))
    };

    var result = {
        hours: parsedTime.hours,
        minutes: parsedTime.minutes,
        brutto: parsedTime.hours * euroPerHour + (euroPerHour / 60 * parsedTime.minutes)
    };

    if (parsedTime.hours >= 8 &&
        parsedTime.minutes > 0){
        result.overWork = {
            hours: parsedTime.hours - 8,
            minutes: parsedTime.minutes,
        }
    } else if (parsedTime.hours === 0 &&
               parsedTime.minutes === 0) {
        // not worked so far
        result.noWork = {
            hours: 8,
            minutes: 0
        }
    } else if (parsedTime.hours < 8) {
        result.lessWork = {
            hours: (8 - parsedTime.hours) - 1,
            minutes: 60 - parsedTime.minutes,
        }

        console.log(parsedTime, result.lessWork);
    }

    return result;
});

// searches the today times
function today(){
    for(var x = times.length - 1; x > 0; x--){
        if (times[x].hours > 0 ||
            times[x].minutes > 0)
            return times[x];
    }
}

var todayWork = today();

var overWork = {
    hours: 0,
    minutes: 0
};

var lessWork = {
    hours: 0,
    minutes: 0
};

var noWork = {
    hours: 0,
    minutes: 0
};

var overallWork = {
    hours: 0,
    minutes: 0,
    brutto: 0
};

function addTime(timeObject, add){
    return {
        hours: timeObject.hours += add.lessWork.hours,
        minutes: timeObject.minutes += add.lessWork.minutes,
    }
}

times.forEach(function(time){
    //console.log(time);
    if (time.overWork){
        overWork.hours += time.overWork.hours;
        overWork.minutes += time.overWork.minutes;
        overWork.brutto += time.overWork.brutto;
    } else if (time.noWork){
        noWork.hours += time.noWork.hours;
        noWork.minutes += time.noWork.minutes;
    } else if (time.lessWork){
        lessWork.hours += time.lessWork.hours;
        lessWork.minutes += time.lessWork.minutes;
    }
    overallWork.hours += time.hours;
    overallWork.minutes += time.minutes;
    overallWork.brutto += time.brutto;
});

function getHoursAndMinutesFromMinutes(timeObject){
    return {
        hours: timeObject.hours + ((timeObject.minutes - (timeObject.minutes%60))/60),
        minutes: timeObject.minutes%60,
        brutto: timeObject.brutto,
        netto: timeObject.brutto * nettoFactor
    }
}

// minutes to hours fix
overWork = getHoursAndMinutesFromMinutes(overWork);
lessWork = getHoursAndMinutesFromMinutes(lessWork);
noWork = getHoursAndMinutesFromMinutes(noWork);
overallWork = getHoursAndMinutesFromMinutes(overallWork);

console.log('over work', 'hours', overWork.hours, 'minutes', overWork.minutes);
console.log('under work', 'hours', lessWork.hours, 'minutes', lessWork.minutes);
console.log('no work', 'hours', noWork.hours, 'minutes', noWork.minutes);
console.log('overall work', 'hours', overallWork.hours, 'minutes', overallWork.minutes, 'brutto', overallWork.brutto, 'netto', overallWork.netto);

document.title = todayWork.hours + ':' + todayWork.minutes + ' (' + overWork.hours + ':' + overWork.minutes + ')';
setTimeout(function(){location.reload()}, 1000 * 60);


var widget = $('#socialbitPanelFloatingContent form')
.children()
.clone();

var header = widget.find('.icon7');
header.text('Zusammenfassung');

var content = widget.find('.widgetContent');
content.empty();
content.append($('<h2>Überstunden</h2>'));
content.append($('<p>' + overWork.hours + ':' + overWork.minutes + '</p>'));
content.append($('<h2>Unterstunden</h2>'));
content.append($('<p>' + lessWork.hours + ':' + lessWork.minutes + '</p>'));
content.append($('<h2>Gesamt</h2>'));
content.append($('<p>' + overallWork.hours + ':' + overallWork.minutes + '</p>'));

$('#socialbitPanelFloatingContent form')
    .append(widget);
