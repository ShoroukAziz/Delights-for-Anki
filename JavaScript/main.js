/*jshint esversion: 8 */

config = {
  "defaultHighlightingSelection": "highlightNone",
  "defaultExtraSelection": "noteOnly",
  "interestInArabic": true,
  "defaultIPA": true,
  "defaultPOS": true,
  "defaultExtraExamples": true,
  "defaultmaturityState": true
};

/******************************************/

String.prototype.removeAt = function (index) {
  return this.substr(0, index) + this.substr(index + 1, );
};
String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + 1, );
};
String.prototype.replaceAll = function (strReplace, strWith) {
  // See http://stackoverflow.com/a/3561711/556609
  var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  var reg = new RegExp(esc, 'ig');
  return this.replace(reg, strWith);
};

/******************************************/


Utils = class {
  /**
   * takes the id of an HTML element and returns the inner HTML of that element
  */
  HTMLId(id) {
    return document.getElementById(id).innerHTML.trim();
  }
  /**
   * takes the class name of an HTML element and returns the inner HTML of that element
  */
  HTMLClass(className) {
    return document.getElementsByClassName(className)[0].innerHTML.trim();
  }
  /**
   * takes the id of an HTML element and returns the inner text of that element
  */
  textId(id) {
    return document.getElementById(id).innerText.trim();
  }
  /**
   * takes the class name of an HTML element and returns the inner text of that element
  */
  textClass(className) {
    return document.getElementsByClassName(className)[0].innerText.trim();
  }
  disableMenuOption(id) {
    document.getElementById(id).disabled = true;
    document.getElementById(id).parentElement.style.color = '#4f5154';
  }

};
utils = new Utils();

Note = class {
  constructor() {
    this.html_word = utils.HTMLId('word');
    this.word = utils.textId('word');
    this.html_translation = utils.HTMLClass('translationText');
    this.translation = utils.textClass('translationText');
    this.translationWords = this.translation.split(',');
    this.example = utils.HTMLId('example');
    this.exampelsTranslation = utils.HTMLId('exampelsTranslation');
    try {
      this.type = utils.textClass('type');
      if (this.type == "") this.type = "na";
    } catch (error) {
      this.translationNote = "na";
    }
    try {
      this.translationNote = utils.textClass('translation-note');
      if (this.translationNote == "") this.translationNote = null;
    } catch (error) {
      this.translationNote = null;
    }
    try {
      this.wordNote = utils.textClass('word-note');
      if (this.wordNote == "") this.wordNote = null;
    } catch (error) {
      this.wordNote = null;
    }
    
    try {
      this.ipa = utils.textClass('ipa');
      if (this.ipa == "") this.ipa = null;
    } catch (error) {
      this.ipa = null;
    }
    try {
      this.ivl = utils.HTMLId('ivl');
      if (this.ivl == "") this.ivl = null;
    } catch (error) {
      this.ivl = null;
    }
    try {
      this.bank = utils.textId('exBank');
      this.bank = this.bank.split("'").join("\"");
      this.bank = JSON.parse(this.bank);
      this.bank_length = this.bank.length;
    } catch (error) {
      this.bank = null;
    }

  }


};

note = new Note();


NoteStyleManipulator = class {

  constructor(note) {
    this.note = note;
  }
  /**
   * Highlits the word in the French example and the translation in the E nglish example
  */
  markWordInTheExample(example, translatedEx) {
    document.querySelector('#example').innerHTML = example.replaceAll(note.word,`<span class='example__higlighted-word'> ${ note.word }</span>` );
    document.querySelector('#exampelsTranslation').innerHTML = translatedEx;

    let parts = this.note.translationWords;
    parts.forEach((part, i) => {
      part = part.trim();
        if (translatedEx.toLowerCase().includes(part.toLowerCase())) {
          document.querySelector('#exampelsTranslation').innerHTML = translatedEx.replaceAll(part, `<span class='example__higlighted-word'>${ part }</span>`);
        }
    });

  }

  /**
   *  Remove the extra new line tag that Anki adds at the end of the audio fields
   */
  removeExtraNewLineTagInSoundFields() {

    let soundFieldsIds = ['wordSound', 'exampleSound', 'femeSound', 'pSound'];
    soundFieldsIds.forEach(function (item) {
      if (document.querySelector("#"+item)) {
        if (document.getElementById(item).innerHTML.endsWith('<br>'))
          document.getElementById(item).innerHTML = document.getElementById(item).innerHTML.slice(0, -4);
      }
    });

  }
  prebBackGround() {
    /*Change the card's background color according to its type*/

    function changeBackGroundColor(containerClassName, imgClassName) {
      document.querySelector("#container").className = containerClassName;
      document.querySelector("#imgcontainer").className = imgClassName;
    }


    if (note.type.includes('feminine') && note.type.includes('masculine')) {
      changeBackGroundColor("both__background", "both__image");
    } else if (note.type.trim().includes('feminine')) {
      changeBackGroundColor("feminine__background", "feminine__image");
    } else if (note.type.trim().includes('masculine')) {
      changeBackGroundColor("masculine__background", "masculine__image");}
    else if (note.type.trim().includes('noun')) {
      changeBackGroundColor("noun__background", "noun__image");
    } else if (note.type.trim().includes('adjective')) {
      changeBackGroundColor("adjective__background", "adjective__image");
    } else if (note.type.trim().includes('adverb')) {
      changeBackGroundColor("adverb__background", "adverb__image");
    } else if (note.type.trim().includes('verb')) {
      changeBackGroundColor("verb__background", "verb__image");  
    } else if (note.type.trim().includes('phrase')) {
      changeBackGroundColor("phrase__background", "phrase__image");
    } else {
      changeBackGroundColor("other__background", "other__image");
    }

  }


  splitTranslation() {

    let parts = note.translationWords;
    document.querySelector('.translation').innerHTML = "";
    parts.forEach((part, i) => {
      part = `<span class=' translation__word'>${ part }<span/>`;
      document.querySelector('.translation').innerHTML += part;
      document.querySelector('.translation').classList.add('translationText');
    });


  }


  changeReplaybutton() {
    let elements = document.querySelectorAll('.playImage');
    for (var i = 0; i < elements.length; i++) {
      elements[i].innerHTML = `

    <svg version="1.1"id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 480 480" style="enable-background:new 0 0 480 480;" xml:space="preserve">
    <path style="fill:#455A64;" d="M278.944,17.577c-5.568-2.656-12.128-1.952-16.928,1.92L106.368,144.009H32
    	c-17.632,0-32,14.368-32,32v128c0,17.664,14.368,32,32,32h74.368l155.616,124.512c2.912,2.304,6.464,3.488,10.016,3.488
    	c2.368,0,4.736-0.544,6.944-1.6c5.536-2.656,9.056-8.256,9.056-14.4v-416C288,25.865,284.48,20.265,278.944,17.577z"></path>
    <g>
    	<path style="fill:#FFC107;" d="M368.992,126.857c-6.304-6.208-16.416-6.112-22.624,0.128c-6.208,6.304-6.144,16.416,0.128,22.656
    		C370.688,173.513,384,205.609,384,240.009s-13.312,66.496-37.504,90.368c-6.272,6.176-6.336,16.32-0.128,22.624
    		c3.136,3.168,7.264,4.736,11.36,4.736c4.064,0,8.128-1.536,11.264-4.64C399.328,323.241,416,283.049,416,240.009
    		S399.328,156.777,368.992,126.857z"></path>
    	<path style="fill:#FFC107;" d="M414.144,81.769c-6.304-6.24-16.416-6.176-22.656,0.096c-6.208,6.272-6.144,16.416,0.096,22.624
    		C427.968,140.553,448,188.681,448,240.009s-20.032,99.424-56.416,135.488c-6.24,6.24-6.304,16.384-0.096,22.656
    		c3.168,3.136,7.264,4.704,11.36,4.704c4.064,0,8.16-1.536,11.296-4.64C456.64,356.137,480,299.945,480,240.009
    		S456.64,123.881,414.144,81.769z"></path>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    </svg>
    `;
    }

  }



};


styleManipulator = new NoteStyleManipulator(note);
styleManipulator.markWordInTheExample(note.example, note.exampelsTranslation);
styleManipulator.removeExtraNewLineTagInSoundFields();
styleManipulator.prebBackGround();
styleManipulator.splitTranslation();
styleManipulator.changeReplaybutton();




/********************************/


NoteExtras = class {
  constructor(note) {
    this.note = note;
  }




  dispalyOption(id) {
    let extraOptions = document.getElementsByName('extraOptions');

    for (var i = 0, max = options.length; i < max; i++) {
      options[i].style.backgroundColor = '#f3dcf500';
    }
    for (i = 0, max = extraOptions.length; i < max; i++) {
      extraOptions[i].style.display = 'none';
    }

    document.getElementById(id).style.backgroundColor = '#60f0ad';
    if (id == 'root') {
      document.querySelector("#extraDiv").style.display = "block";
    } else if (id == "brain") {
      document.querySelector("#mnemonicDiv").style.display = "block";
    } else if (id == "tagsico") {
      document.querySelector("#tagsDiv").style.display = "block";
    }

  }



  checkIPABox(checker) {
    if (checker == true) {
      document.getElementsByClassName("ipa")[0].style.display = "block";
    } else if (checker == false) {
      document.getElementsByClassName("ipa")[0].style.display = "none";
    }
  }


  checkMaturity(checker) {
    if (checker == true) {
      document.getElementsByClassName("card-maturity")[0].style.display = "block";
    } else if (checker == false) {
      document.getElementsByClassName("card-maturity")[0].style.display = "none";
    }

  }



  checkPOSBox(checker) {

    if (checker == true) {
      document.getElementsByClassName("type-corner")[0].style.display = "block";
    } else if (checker == false) {
      document.getElementsByClassName("type-corner")[0].style.display = "none";
    }
  }


  checkExtraExamplesBox(checker) {
    let checkEX = document.querySelector('#oEX');
    if (checker == true) {
      if (note.bank == null || note.bank_length == 1) {
        checkEX.checked = false;
        utils.disableMenuOption("oEX");
        document.querySelector("#previousIcon").style.display = "none";
        document.querySelector("#nxtIcon").style.display = "none";
        document.querySelector("#noOfEx").style.display = "none";
        document.querySelector("#example").style.display = "block";
      } else {
        checkEX.checked = true;
        document.querySelector("#previousIcon").style.display = "inline-block";
        document.querySelector("#nxtIcon").style.display = "inline-block";
        document.querySelector("#noOfEx").style.display = "block";
        document.querySelector("#example").style.display = "inline-block";

      }

    } else if (checker == false) {
      checkEX.checked = false;
      document.querySelector("#previousIcon").style.display = "none";
      document.querySelector("#nxtIcon").style.display = "none";
      document.querySelector("#noOfEx").style.display = "none";
      document.querySelector("#example").style.display = "block";
    }

  }




  dispalymenu(status) {

    if (status == 'close') {

      document.querySelector('.menus').style.backgroundColor = "#f3dcf500";
      document.querySelector('.menu_hidable').style.display = "none";
      document.querySelector(".menu__head__icon--open").style.display = "block";
      window.menuStatus = 'open';
    } else {

      document.querySelector('.menus').style.backgroundColor = "#f1f1f1";
      document.querySelector('.menu_hidable').style.display = "block";
      document.querySelector(".menu__head__icon--open").style.display = "none";
      window.menuStatus = 'close';
    }

  }







  prepMaturityStatus() {
    let stars = ['star1', 'star2', 'star3', 'nostar1', 'nostar2', 'nostar3'];
    if (note.ivl == null) {
      stars.forEach(star => document.getElementById(star).style.display = 'none');
    } else if (note.ivl == 0) {
      [stars[1], stars[2], stars[3]].forEach(star => document.getElementById(star).style.display = 'none');
    } else if (note.ivl < 21) {
      [stars[2], stars[3], stars[4]].forEach(star => document.getElementById(star).style.display = 'none');
    } else {
      [stars[3], stars[4], stars[5]].forEach(star => document.getElementById(star).style.display = 'none');
    }
  }



  prepOptionsMenu() {
    let current_index = -1;

    if (note.bank == null || note.bank_length == 1) {
      /* utils.disableMenuOption("oEX") ;  document.querySelector("#previousIcon").style.display = "none";document.querySelector("#nxtIcon").style.display = "none"; */
    } else {
      var indexOnScreen = 1;
      document.querySelector('#noOfEx').innerHTML = "<br> example " + indexOnScreen + " of " + note.bank_length;
      let current_example = utils.textId('example');
      for (var i = 0; i < note.bank_length; i++) {
        if (current_example.toLowerCase() == note.bank[i].example.toLowerCase()) {
          current_index = i;
          break;
        }
      }

    }

    return [current_index, indexOnScreen];
  }




  prepAttatchmentsMenu() {
    var _this = this;
    let extraOptions = document.getElementsByName('extraOptions');


    if (document.querySelector("#extra")) {
      let extra = document.querySelector("#extra").innerHTML;
      if (config.interestInArabic == true && extra.includes("rabic")) {
        window.optionId = 'root';
      } else {
        window.optionId = config.defaultExtraSelection;
      }
    }



    window.optionId = window.optionId || configdefaultExtraSelection;
    if (window.optionId != 0) {
      let option = document.getElementById(window.optionId);
      option.style.backgroundColor = '#60f0ad';
      _this.dispalyOption(window.optionId);

    }

    for (var i = 0, max = options.length; i < max; i++) {

      options[i].onclick = function () {
        window.optionId = this.id;
        _this.dispalyOption(window.optionId);

      };
    }
  }


  prepExtraOptionsMenu() {
    var _this = this;
    let checkIPA = document.querySelector('#oIPA');
    if(this.note.ipa == null){
      utils.disableMenuOption("oIPA");
    }
    else{
      if (window.checkedIPA === undefined) {
        window.checkedIPA = config.defaultIPA;
        checkIPA.checked = config.defaultIPA;
      }
      _this.checkIPABox(window.checkedIPA);
      checkIPA.checked = window.checkedIPA;
      checkIPA.addEventListener('change', function () {
        window.checkedIPA = checkIPA.checked;
        _this.checkIPABox(checkIPA.checked);
      });
  
    }

    let checkPOS = document.querySelector('#oPOS');
    if(this.note.type == "na"){
      utils.disableMenuOption("oPOS");
    }
    else{
      if (window.checkedPOS === undefined) {
        window.checkedPOS = config.defaultPOS;
        checkPOS.checked = config.defaultPOS;
      }
      _this.checkPOSBox(window.checkedPOS);
      checkPOS.checked = window.checkedPOS;
      checkPOS.addEventListener('change', function () {
        window.checkedPOS = checkPOS.checked;
        _this.checkPOSBox(checkPOS.checked);
      });
    }
    


    let checkEX = document.querySelector('#oEX');
    if (window.checkedEX === undefined) {
      window.checkedEX = config.defaultExtraExamples;
      _this.checkExtraExamplesBox(window.checkedEX);

    } else {
      _this.checkExtraExamplesBox(window.checkedEX);
    }

    checkEX.addEventListener('change', function () {
      window.checkedEX = checkEX.checked;
      _this.checkExtraExamplesBox(checkEX.checked);
    });




    let checkMut = document.querySelector('#oMut');
    if (window.checkedMut === undefined) {
      window.checkedMut = config.defaultmaturityState;
      checkMut.checked = config.defaultmaturityState;
    }
    _this.checkMaturity(window.checkedMut);
    checkMut.checked = window.checkedMut;

    checkMut.addEventListener('change', function () {
      window.checkedMut = checkMut.checked;
      _this.checkMaturity(checkMut.checked);
    });

  }

  prepMainMenu() {
    var _this = this;
    if (window.menuStatus == undefined) {
      window.menuStatus = 'close';
      document.getElementsByClassName("menu__head__icon--open")[0].style.display = "none";
    } else if (window.menuStatus == 'open') {
      _this.dispalymenu('close');
    } else {
      _this.dispalymenu('open');
    }


    document.getElementsByClassName("menu__head__icon")[0].addEventListener("click", function () {
      _this.dispalymenu(window.menuStatus);
    });

    document.getElementsByClassName("menu__head__icon--open")[0].addEventListener("click", function () {
      _this.dispalymenu(window.menuStatus);
    });

  }


};
noteExtras = new NoteExtras(note);
noteExtras.prepMaturityStatus();
current_index = noteExtras.prepOptionsMenu()[0];
indexOnScreen = noteExtras.prepOptionsMenu()[1];
noteExtras.prepAttatchmentsMenu();
noteExtras.prepExtraOptionsMenu();
noteExtras.prepMainMenu();

/***************************************************************************************/




function addAPlayButton(src) {
  return `
  <audio  autoplay id="player" src="${src}"></audio>

       <a class="replay-button" onclick="document.querySelector('#player').play()">
         <svg width="40px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 480 480" style="enable-background:new 0 0 480 480;" xml:space="preserve">
         <path style="fill:#455A64;" d="M278.944,17.577c-5.568-2.656-12.128-1.952-16.928,1.92L106.368,144.009H32
           c-17.632,0-32,14.368-32,32v128c0,17.664,14.368,32,32,32h74.368l155.616,124.512c2.912,2.304,6.464,3.488,10.016,3.488
           c2.368,0,4.736-0.544,6.944-1.6c5.536-2.656,9.056-8.256,9.056-14.4v-416C288,25.865,284.48,20.265,278.944,17.577z"></path>
         <g>
           <path style="fill:#FFC107;" d="M368.992,126.857c-6.304-6.208-16.416-6.112-22.624,0.128c-6.208,6.304-6.144,16.416,0.128,22.656
             C370.688,173.513,384,205.609,384,240.009s-13.312,66.496-37.504,90.368c-6.272,6.176-6.336,16.32-0.128,22.624
             c3.136,3.168,7.264,4.736,11.36,4.736c4.064,0,8.128-1.536,11.264-4.64C399.328,323.241,416,283.049,416,240.009
             S399.328,156.777,368.992,126.857z"></path>
           <path style="fill:#FFC107;" d="M414.144,81.769c-6.304-6.24-16.416-6.176-22.656,0.096c-6.208,6.272-6.144,16.416,0.096,22.624
             C427.968,140.553,448,188.681,448,240.009s-20.032,99.424-56.416,135.488c-6.24,6.24-6.304,16.384-0.096,22.656
             c3.168,3.136,7.264,4.704,11.36,4.704c4.064,0,8.16-1.536,11.296-4.64C456.64,356.137,480,299.945,480,240.009
             S456.64,123.881,414.144,81.769z"></path>
         </g>
         <g>
         </g>
         <g>
         </g>
         <g>
         </g>
         <g>
         </g>
         <g>
         </g>
         <g>
         </g>
         <g>
         </g>
         <g>
         </g>
         <g>
         </g>
         <g>
         </g>
         <g>
         </g>
         <g>
         </g>
         <g>
         </g>
         <g>
         </g>
         <g>
         </g>
         </svg>

       </a>

  `;

}

function anotherExample(next) {
  current_index += next;
  indexOnScreen += next;
  if (indexOnScreen > note.bank_length) {
    indexOnScreen = 1;
  } else if (indexOnScreen <= 0) {
    indexOnScreen = note.bank_length;
  }
  document.querySelector('#noOfEx').innerHTML = "<br> example " + indexOnScreen + " of " + note.bank_length;
  if (current_index == note.bank_length) {
    current_index = 0;
  } else if (current_index == (-1)) {
    current_index = note.bank_length - 1;
  }

  styleManipulator.markWordInTheExample(note.bank[current_index].example, note.bank[current_index].translation);
  document.querySelector('#exampleSound').innerHTML = addAPlayButton(note.bank[current_index].audio);

}