// ==UserScript==
// @name         Pull-Request opener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://bitbucket.org/dashboard/pullrequests*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const config = {
        maxApproves: 3,
        ignore: 'WIP'
    }


    // BUTTON
    var button          = '<button id="prButton" class="aui-button aui-alignment-target aui-button-primary"><span>Open all</span></button>';
    var filterContainer = $('.filter-container');
    filterContainer.append(button);

    function parse(items) {
        var x = [];
        for (var i = 0; i < items.length; i++) {
            var item = $(items[i]);
            var pullRequest = {
                item:       item,
                name:       item.find('a.execute').text(),
                wip:        item.find('a.execute').text().indexOf(config.ingore) >= 0,
                approves:   parseInt(item.find('.approval-link').parent().find('.count').text()),
                author:     item.find('.user').text(),
                updated:    item.find('time').text(),
                comments:   item.find('.comments-link').parent().find('.count').text(),
                url:        item.find('a.execute').attr('href'),
                repository: item.find('.repo span').text(),
                approved:   item.find('.approval-link.approved').length > 0,
                hide:       false
            };
            if(pullRequest.approved || pullRequest.approves >= config.maxApproves || pullRequest.wip) {
                pullRequest.hide = true;
                item.hide();
            }
            x.push(pullRequest);
        }
        return x;
    }

    var openPrs = $('a.execute').parents('.iterable-item');
    var prs     = parse(openPrs);

    $('#prButton').on('click', function() {
        openMultipleLinks(prs);
    });

    function openMultipleLinks(links) {
        for (var i=0;i<links.length;i++){
            if(!links[i].hide) {
                setTimeout('window.open(links[i].url)',i*200);
            }
        }
    }
})();
