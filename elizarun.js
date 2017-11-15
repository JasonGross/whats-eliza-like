var eliza = new ElizaBot();
var elizaLines = new Array();

var displayCols = 60;
var displayRows = 20;

function saveSettings() {
    var f = document.forms.e_form;
    var settings = {
	'speak':f.speak.checked,
	'voice':f.voiceselection.value
    };
    localStorage['eliza-whats-that-like-current-settings'] = JSON.stringify(settings);
}

function saveByCopy() {
    copyTextToClipboard(elizaLines.join('\n'));
}

function redisplay_and_save() {
    var f = document.forms.e_form;
    localStorage['eliza-whats-that-like-current-log'] = JSON.stringify(elizaLines);
    saveSettings();
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

function loadSettings() {
    var f = document.forms.e_form;
    try {
	settings = JSON.parse(localStorage['eliza-whats-that-like-current-settings']);
	if (settings['speak']) {
	    f.speak.checked = true;
	}
	if (settings['voice']) {
	    f.voiceselection.value = settings['voice'];
	}
    } catch (err) {
    }
}

function loadLog() {
    try {
	elizaLines = JSON.parse(localStorage['eliza-whats-that-like-current-log']);
    } catch (err) {
    }
}

function elizaReset() {
    eliza.reset();
    elizaLines.length = 0;
    loadSettings();
    elizaStep();
}

function elizaLoad() {
    var f = document.forms.e_form;
    eliza.reset();
    elizaLines.length = 0;
    loadSettings();
    loadLog();
    redisplay_and_save();
    elizaStep();
}

function maybeSpeak(text) {
    var f = document.forms.e_form;
    if (f.speak.checked) {
	responsiveVoice.speak(text, f.voiceselection.value);
    }
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
	var eliza_said = eliza.transform(userinput);
        var rpl ='ELIZA: ' + eliza_said;
        elizaLines.push(usr);
        elizaLines.push(rpl);
        redisplay_and_save();
	maybeSpeak(eliza_said);
    }
    else if (elizaLines.length == 0) {
        // no input and no saved lines -> output initial
	var eliza_said = eliza.getInitial();
        var initial = 'ELIZA: ' + eliza_said;
        elizaLines.push(initial);
        localStorage['eliza-whats-that-like-current-log'] = JSON.stringify(elizaLines);
        f.e_display.value = initial + '\n';
	maybeSpeak(eliza_said);
    }
    else if (elizaLines.length == 1) {
	var eliza_said = elizaLines[0].replace('ELIZA: ', '');
	maybeSpeak(eliza_said);
    }
    f.e_input.value = '';
    f.e_input.focus();
}
