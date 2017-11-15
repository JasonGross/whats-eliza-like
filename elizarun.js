var eliza = new ElizaBot();
var elizaLines = new Array();

var displayCols = 60;
var displayRows = 20;

function elizaReset() {
    eliza.reset();
    elizaLines.length = 0;
    elizaStep();
}

function redisplay_and_save() {
    var f = document.forms.e_form;
    localStorage['eliza-whats-that-like-current-log'] = JSON.stringify(elizaLines);
    // display nicely
    // (fit to textarea with last line free - reserved for extra line caused by word wrap)
    var temp  = new Array();
    var l = 0;
    for (var i=elizaLines.length-1; i>=0; i--) {
        l += 1 + Math.floor(elizaLines[i].length/displayCols);
        if (l >= displayRows) break
        else temp.push(elizaLines[i]);
    }
    f.e_display.value = temp.reverse().join('\n');
}

function elizaLoad() {
    var storedLines;
    eliza.reset();
    elizaLines.length = 0;
    try {
	elizaLines = JSON.parse(localStorage['eliza-whats-that-like-current-log']);
    } catch (err) {
    }
    redisplay_and_save();
    elizaStep();
}

function elizaStep() {
    var f = document.forms.e_form;
    var userinput = f.e_input.value;
    if (eliza.quit) {
        f.e_input.value = '';
        if (confirm("This session is over.\nStart over?")) elizaReset();
        f.e_input.focus();
        return;
    }
    else if (userinput != '') {
        var usr = 'YOU:   ' + userinput;
        var rpl ='ELIZA: ' + eliza.transform(userinput);
        elizaLines.push(usr);
        elizaLines.push(rpl);
        redisplay_and_save();
    }
    else if (elizaLines.length == 0) {
        // no input and no saved lines -> output initial
        var initial = 'ELIZA: ' + eliza.getInitial();
        elizaLines.push(initial);
        localStorage['eliza-whats-that-like-current-log'] = JSON.stringify(elizaLines);
        f.e_display.value = initial + '\n';
    }
    f.e_input.value = '';
    f.e_input.focus();
}
