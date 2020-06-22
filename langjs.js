/*
- put it on the internet!

- more options about the random inputs
- sending to friends
- slight style upgrade

- listening
*/

let contentdiv = document.getElementById("content");

let inputPhrase = "bang";
let unrefinedPhrase = "asdf";
let bpm = 0;


let cup = ["c","d","v","f","m","l","b"];
let cdown = ["h","t","w","r","n","p","s"];
let fup = ["a","e","i","o","u","y","x"];
let fdown = ["","","g","j","q","k","z"];

let majorScale = ["B3","C4","D4","E4","F4","G4","A4","B4","C5"];
let oneChord = ["C3","E3","G3"];
let fourChord = ["F3","A3","C4"];
let fiveChord = ["G3","B3","D4"];

function run() {
	reset();

	bpm = document.getElementById("bpmText").value;
	//console.log(bpm);
	if (document.getElementById("randInputType").checked) {
		let rando = Math.floor(Math.random() * wordsandnames.length);
		inputPhrase = wordsandnames[rando];
		unrefinedPhrase = inputPhrase;
		document.getElementById("guessdiv").removeAttribute("hidden");
	}
	else {
		inputPhrase = document.getElementById("manualinput").value;
		unrefinedPhrase = inputPhrase;
		inputPhrase = inputPhrase.replace(/[^ a-z]/gi, "");
		inputPhrase = inputPhrase.toLowerCase();
		document.getElementById("manualanswer").removeAttribute("hidden");
		document.getElementById("content").removeAttribute("hidden");		
	}

	document.getElementById("replay").removeAttribute("hidden");

	let submitButton = document.getElementById("submitbutton");

	disableAndEnable();

	//submitButton.removeAttribute("disabled");

	wordappear(unrefinedPhrase);
	//wordentry(inputPhrase);
	//console.log(inputPhrase);

	playmusic();

}

function reset() {
	contentdiv.innerHTML = "";
	document.getElementById("correct").setAttribute("hidden",true);
	document.getElementById("incorrect").setAttribute("hidden",true);	
	document.getElementById("content").setAttribute("hidden",true);		
	document.getElementById("manualanswer").setAttribute("hidden",true);
	document.getElementById("guessdiv").setAttribute("hidden",true);
	document.getElementById("replay").setAttribute("hidden",true);
	document.getElementById("reveal").setAttribute("hidden",true);
	//document.getElementById("manualinput").value = "";
	document.getElementById("guess").value = "";
}

function disableAndEnable() {
	document.getElementById("randInputType").setAttribute("disabled",true);
	document.getElementById("customInputType").setAttribute("disabled",true);
	document.getElementById("manualinput").setAttribute("disabled",true);
	document.getElementById("bpmSlider").setAttribute("disabled",true);
	document.getElementById("bpmText").setAttribute("disabled",true);
	document.getElementById("submitbutton").setAttribute("disabled",true);
	document.getElementById("replay").setAttribute("disabled",true);

	let time = (((inputPhrase.length + 2)*4)/bpm)*60000
	setTimeout(function() { enableEverything() }, time);
}

function enableEverything() {
	document.getElementById("randInputType").removeAttribute("disabled");
	document.getElementById("customInputType").removeAttribute("disabled");
	document.getElementById("manualinput").removeAttribute("disabled");
	document.getElementById("bpmSlider").removeAttribute("disabled");
	document.getElementById("bpmText").removeAttribute("disabled");
	document.getElementById("submitbutton").removeAttribute("disabled");
	document.getElementById("replay").removeAttribute("disabled");	
}

function guessMade() {
	guess = document.getElementById("guess").value;
	guess = guess.replace(/[^ a-z]/gi, "");
	guess = guess.toLowerCase();

	if (guess == inputPhrase) {
		document.getElementById("correct").removeAttribute("hidden");
	}
	else {
		document.getElementById("incorrect").removeAttribute("hidden");	
		document.getElementById("reveal").removeAttribute("hidden");	
	}
}

function reveal() {
	document.getElementById("reveal").setAttribute("hidden",true);
	document.getElementById("content").removeAttribute("hidden");
}

function replay() {
	disableAndEnable();
	playmusic();
}

function wordappear(inputword) {
	let wordDiv = document.createElement("div");
	wordDiv.innerHTML = inputword;
	contentdiv.appendChild(wordDiv);
}

function updateBPMtext(val) {
	document.getElementById("bpmText").value = val;
}

function updateBPMslider(val) {
	document.getElementById("bpmSlider").value = val;
}

window.onload = function () {
	MIDI.loadPlugin({
		soundfontUrl: "midijs/examples/soundfont/",
		instrument: "acoustic_grand_piano", // or multiple instruments
		onprogress: function(state, progress) {
			//console.log(state + ", " + progress);
		}
	});
};

function playmusic() {
	for (i = 0; i < inputPhrase.length; i++) {
		let character = inputPhrase[i];
		if (character == " ") {
			addNote(bpm,"G4",i+1,1,1);
			addNote(bpm,"F4",i+1,2,1);
			addNote(bpm,"E4",i+1,3,1);
			addNote(bpm,"D4",i+1,4,1);


			addchordNote(bpm,"G3",i+1,1,4);
			addchordNote(bpm,"B3",i+1,1,4);
			addchordNote(bpm,"D4",i+1,1,4);
		}
		else {
			let noteSet = translate(character);		
			//console.log(noteSet[0] + " / " + noteSet[1]);
			addNote(bpm,noteSet[1][0],i+1,1,1);
			addNote(bpm,noteSet[1][1],i+1,2,2);
			
			addchordNote(bpm,noteSet[0][0],i+1,1,4);
			addchordNote(bpm,noteSet[0][1],i+1,1,4);
			addchordNote(bpm,noteSet[0][2],i+1,1,4);

			let rando = Math.floor(Math.random() * majorScale.length);
			randomNote = majorScale[rando];
			addNote(bpm,randomNote,i+1,4,1);
		}	
	}
	addNote(bpm,"G4",(inputPhrase.length)+1,1,1);
	addNote(bpm,"A4",(inputPhrase.length)+1,2,1);
	addNote(bpm,"B4",(inputPhrase.length)+1,3,1);
	addNote(bpm,"G4",(inputPhrase.length)+1,4,1);
	addNote(bpm,"C5",(inputPhrase.length)+2,1,4);

	addchordNote(bpm,"G3",(inputPhrase.length)+1,1,4);
	addchordNote(bpm,"B3",(inputPhrase.length)+1,1,4);
	addchordNote(bpm,"D4",(inputPhrase.length)+1,1,4);
	addchordNote(bpm,"C3",(inputPhrase.length)+2,1,4);
	addchordNote(bpm,"E3",(inputPhrase.length)+2,1,4);
	addchordNote(bpm,"G4",(inputPhrase.length)+2,1,4);
}

function addNote(bpm,note,measure,beat,length) {
	let noteNum = MIDI.keyToNote[note];
	let startingBeat = ((measure-1)*4)+beat;
	MIDI.noteOn(0, noteNum, 60, b2s(bpm,startingBeat));
	MIDI.noteOff(0, noteNum, b2s(bpm,startingBeat+length));
}

function addchordNote(bpm,note,measure,beat,length) {
	let noteNum = MIDI.keyToNote[note];
	let startingBeat = ((measure-1)*4)+beat;
	MIDI.noteOn(0, noteNum, 30, b2s(bpm,startingBeat));
	MIDI.noteOff(0, noteNum, b2s(bpm,startingBeat+length));
}

//not currently working
function addChordFake(bpm,noteSet,measure,beat,length) {
	let chordTones = [];
	for (i = 0; i < noteSet.length; i++) {
		let note = noteSet[i];
		note = MIDI.keyToNote[note];
		chordTones.push(note);
	}
	let startingBeat = ((measure-1)*4)+beat;
	MIDI.chordOn(0, chordTones, 50, b2s(bpm,startingBeat));
	MIDI.chordOff(0, chordTones, b2s(bpm,startingBeat+length));
}

function b2s(bpm, beats) {
	let secs = (60 * beats) / bpm;
	return secs;
}

function translate(character) {
	let chord = null;
	let melody = null;
	switch (character){
		case "c":
			chord = oneChord;
			melody = [majorScale[1],majorScale[2]];
			break;
		case "d":
			chord = oneChord;
			melody = [majorScale[2],majorScale[3]];
			break;
		case "v":
			chord = oneChord;
			melody = [majorScale[3],majorScale[4]];
			break;
		case "f":
			chord = oneChord;
			melody = [majorScale[4],majorScale[5]];
			break;
		case "m":
			chord = oneChord;
			melody = [majorScale[5],majorScale[6]];
			break;
		case "l":
			chord = oneChord;
			melody = [majorScale[6],majorScale[7]];
			break;
		case "b":
			chord = oneChord;
			melody = [majorScale[7],majorScale[8]];
			break;
		case "h":
			chord = oneChord;
			melody = [majorScale[1],majorScale[0]];
			break;
		case "t":
			chord = oneChord;
			melody = [majorScale[2],majorScale[1]];
			break;
		case "w":
			chord = oneChord;
			melody = [majorScale[3],majorScale[2]];
			break;
		case "r":
			chord = oneChord;
			melody = [majorScale[4],majorScale[3]];
			break;
		case "n":
			chord = oneChord;
			melody = [majorScale[5],majorScale[4]];
			break;
		case "p":
			chord = oneChord;
			melody = [majorScale[6],majorScale[5]];
			break;
		case "s":
			chord = oneChord;
			melody = [majorScale[7],majorScale[6]];
			break;
		case "a":
			chord = fourChord;
			melody = [majorScale[1],majorScale[2]];
			break;
		case "e":
			chord = fourChord;
			melody = [majorScale[2],majorScale[3]];
			break;
		case "i":
			chord = fourChord;
			melody = [majorScale[3],majorScale[4]];
			break;
		case "o":
			chord = fourChord;
			melody = [majorScale[4],majorScale[5]];
			break;
		case "u":
			chord = fourChord;
			melody = [majorScale[5],majorScale[6]];
			break;
		case "y":
			chord = fourChord;
			melody = [majorScale[6],majorScale[7]];
			break;
		case "x":
			chord = fourChord;
			melody = [majorScale[7],majorScale[8]];
			break;
		case "g":
			chord = fourChord;
			melody = [majorScale[3],majorScale[2]];
			break;
		case "j":
			chord = fourChord;
			melody = [majorScale[4],majorScale[3]];
			break;
		case "q":
			chord = fourChord;
			melody = [majorScale[5],majorScale[4]];
			break;
		case "k":
			chord = fourChord;
			melody = [majorScale[6],majorScale[5]];
			break;
		case "z":
			chord = fourChord;
			melody = [majorScale[7],majorScale[6]];
			break;
		case " ":
			chord = fiveChord;
			melody = [majorScale[5],majorScale[4],majorScale[3],majorScale[2]];
			break;
		default:
			lettercode = "ERROR"
	}
	let noteSet = [chord,melody];
	return noteSet;
}

/*
function wordentry (unrefinedInput) {
	let inputword = unrefinedInput.toLowerCase();
	for (i = 0; i < inputword.length; i++) {
		let letter = inputword[i];
		let lettercode = null;
		switch (letter){
			case "c":
				lettercode = "1-1up";
				break;
			case "d":
				lettercode = "1-2up";
				break;
			case "v":
				lettercode = "1-3up";
				break;
			case "f":
				lettercode = "1-4up";
				break;
			case "m":
				lettercode = "1-5up";
				break;
			case "l":
				lettercode = "1-6up";
				break;
			case "b":
				lettercode = "1-7up";
				break;
			case "h":
				lettercode = "1-1down";
				break;
			case "t":
				lettercode = "1-2down";
				break;
			case "w":
				lettercode = "1-3down";
				break;
			case "r":
				lettercode = "1-4down";
				break;
			case "n":
				lettercode = "1-5down";
				break;
			case "p":
				lettercode = "1-6down";
				break;
			case "s":
				lettercode = "1-7down";
				break;
			case "a":
				lettercode = "4-1up";
				break;
			case "e":
				lettercode = "4-2up";
				break;
			case "i":
				lettercode = "4-3up";
				break;
			case "o":
				lettercode = "4-4up";
				break;
			case "u":
				lettercode = "4-5up";
				break;
			case "y":
				lettercode = "4-6up";
				break;
			case "x":
				lettercode = "4-7up";
				break;
			case "g":
				lettercode = "4-3down";
				break;
			case "j":
				lettercode = "4-4down";
				break;
			case "q":
				lettercode = "4-5down";
				break;
			case "k":
				lettercode = "4-6down";
				break;
			case "z":
				lettercode = "4-7down";
				break;
			case " ":
				lettercode = "5 walkdown"
				break;
			default:
				lettercode = "ERROR"
		}
		wordappear(lettercode);

	}
}
*/


