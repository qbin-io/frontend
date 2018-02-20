function CodeFlask(indent) {
    this.indent = indent || "    ";
    this.docroot = document;
}

CodeFlask.isString = function(x) {
    return Object.prototype.toString.call(x) === "[object String]";
}

CodeFlask.prototype.run = function(selector, opts) {
    var target = CodeFlask.isString(selector) ? this.docroot.querySelectorAll(selector) : [selector];

    if(target.length > 1) {
        throw 'CodeFlask.js ERROR: run() expects only one element, ' +
        target.length + ' given. Use .runAll() instead.';
    } else {
        this.scaffold(target[0], false, opts);
    }
}

CodeFlask.prototype.runAll = function(selector, opts) {
    // Remove update API for bulk rendering
    this.update = null;
    this.onUpdate = null;

    var target = CodeFlask.isString(selector) ? this.docroot.querySelectorAll(selector) : selector;

    var i;
    for(i=0; i < target.length; i++) {
        this.scaffold(target[i], true, opts);
    }
    
    // Add the MutationObserver below for each one of the textAreas so we can listen
    // to when the dir attribute has been changed and also return the placeholder
    // dir attribute with it so it reflects the changes made to the textarea.
    var textAreas = this.docroot.getElementsByClassName("CodeFlask__textarea");
    for(var i = 0; i < textAreas.length; i++)
    {
      window.MutationObserver = window.MutationObserver
         || window.WebKitMutationObserver
         || window.MozMutationObserver;

      var target = textAreas[i];

      observer = new MutationObserver(function(mutation) {
        var textAreas = this.docroot.getElementsByClassName("CodeFlask__textarea");
          for(var i = 0; i < textAreas.length; i++)
           {
            // If the text direction values are different set them
            if(textAreas[i].nextSibling.getAttribute("dir") != textAreas[i].getAttribute("dir")){
                textAreas[i].nextSibling.setAttribute("dir", textAreas[i].getAttribute("dir"));
            }
           }
      }),
      config = {
         attributes: true,
         attributeFilter : ['dir']
      };
      observer.observe(target, config);
    }
}

CodeFlask.prototype.scaffold = function(target, isMultiple, opts) {
    var textarea = target.getElementsByTagName("textarea")[0] || document.createElement('TEXTAREA'),
        highlightPre = document.createElement('PRE'),
        highlightCode = document.createElement('CODE'),
        initialCode = textarea.value,
        lang;

    if(opts && !opts.enableAutocorrect)
    {
        // disable autocorrect and spellcheck features
        textarea.setAttribute('spellcheck', 'false');
        textarea.setAttribute('autocapitalize', 'off');
        textarea.setAttribute('autocomplete', 'off');
        textarea.setAttribute('autocorrect', 'off');
    }
  
    if(opts)
    {
      lang = this.lang = this.handleLanguage(opts.language);
    }

    this.defaultLanguage = target.dataset.language || lang || 'markup';


    // Prevent these vars from being refreshed when rendering multiple
    // instances
    if(!isMultiple) {
        this.textarea = textarea;
        this.highlightCode = highlightCode;
    }

    target.classList.add('CodeFlask');
    textarea.classList.add('CodeFlask__textarea');
    highlightPre.classList.add('CodeFlask__pre');
    highlightCode.classList.add('CodeFlask__code');
    highlightCode.classList.add('language-' + this.defaultLanguage);

    // Fixing iOS "drunk-text" issue
    if(/iPad|iPhone|iPod/.test(navigator.platform)) {
        highlightCode.style.paddingLeft = '3px';
    }
    
    // If RTL add the text-align attribute
    if(opts.rtl == true){
        textarea.setAttribute("dir", "rtl")
        highlightPre.setAttribute("dir", "rtl")
    }

    if(opts.lineNumbers) {
        highlightPre.classList.add('line-numbers');
        highlightPre.classList.add('CodeFlask__pre_line-numbers');
        textarea.classList.add('CodeFlask__textarea_line-numbers')
    }
    
    // Appending editor elements to DOM
    var placeholder = null;
    if (target.getElementsByClassName("placeholder").length) placeholder = target.getElementsByClassName("placeholder")[0];
    target.innerHTML = '';
    target.appendChild(textarea);
    target.appendChild(highlightPre);
    highlightPre.appendChild(highlightCode);
    if (placeholder) target.appendChild(placeholder);

    // Render initial code inside tag
    textarea.value = initialCode;
    this.renderOutput(highlightCode, textarea);

    this.highlight(highlightCode);

    this.handleInput(textarea, highlightCode, highlightPre);
    this.handleScroll(textarea, highlightPre);

}

CodeFlask.prototype.renderOutput = function(highlightCode, input) {
    highlightCode.innerHTML = input.value.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    setTimeout(function(highlightCode, input) {
        highlightCode.parentElement.style.right = (input.offsetWidth - input.clientWidth) + "px";
    }, 0, highlightCode, input);
}

CodeFlask.prototype.handleInput = function(textarea, highlightCode, highlightPre) {
    var self = this,
        input,
        selStartPos,
        inputVal,
        roundedScroll,
        currentLineStart,
        indentLength;

    textarea.addEventListener('input', function(e) {
        input = this;
        
        //input.value = input.value.replace(/\t/g, self.indent); // Disabled for Makefiles & Co.

        self.renderOutput(highlightCode, input);

        self.highlight(highlightCode);
    });

    textarea.addEventListener('keydown', function(e) {
        input = this,
        selStartPos = input.selectionStart,
        selEndPos = input.selectionEnd,
        inputVal = input.value;
        currentLineStart = selStartPos - input.value.substr(0, selStartPos).split("\n").pop().length;

        // If tab pressed, indent
        if (e.keyCode === 9) {
          e.preventDefault();

          // Allow shift-tab
          if (e.shiftKey) {
            indentLength = self.indent.length;

            // If the current line begins with the indent, unindent
            if (inputVal.substring(currentLineStart, currentLineStart + indentLength) == self.indent || inputVal.substring(currentLineStart, currentLineStart + 1) == "\t") {
                var selLen = inputVal.substring(currentLineStart, currentLineStart + 1) == "\t" ? 1 : indentLength;
                input.value = inputVal.substring(0, currentLineStart) + inputVal.substring(currentLineStart + selLen, input.value.length);
              input.selectionStart = selStartPos - selLen;
              input.selectionEnd = selStartPos - selLen;
            }
          } else {
              var ind = (input.value.match(/^\t/m) ? "\t" : self.indent);
              if (self.lang == "makefile") ind = "\t";
            input.value = inputVal.substring(0, selStartPos) + ind + 
                          inputVal.substring(selEndPos, input.value.length); 
            input.selectionStart = selStartPos + ind.length; 
            input.selectionEnd = selStartPos + ind.length;
          }

            highlightCode.innerHTML = input.value.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            self.highlight(highlightCode);
        }
    });
}

CodeFlask.prototype.handleScroll = function(textarea, highlightPre) {
    textarea.addEventListener('scroll', function(){
    
        roundedScroll = Math.floor(this.scrollTop);

        // Fixes issue of desync text on mouse wheel, fuck Firefox.
        if(navigator.userAgent.toLowerCase().indexOf('firefox') < 0) {
            //this.scrollTop = roundedScroll;
        }

        highlightPre.style.transform = "translate3d(0, -" + roundedScroll + "px, 0)";
    });
}

CodeFlask.prototype.handleLanguage = function(lang) {
    if(lang.match(/html|xml|xhtml|svg/)) {
        return 'markup';
    } else  if(lang.match(/js/)) {
        return 'javascript';
    } else {
        return lang;
    }
}

CodeFlask.prototype.onUpdate = function(cb) {
    if(typeof(cb) == "function") {
        this.textarea.addEventListener('input', function(e) {
            cb(this.value);
        });
    }else{
        throw 'CodeFlask.js ERROR: onUpdate() expects function, ' +
        typeof(cb) + ' given instead.';
    }
}

CodeFlask.prototype.update = function(string) {
    var evt = document.createEvent("HTMLEvents");

    this.textarea.value = string;
    this.renderOutput(this.highlightCode, this.textarea);
    this.highlight(this.highlightCode);

    evt.initEvent("input", false, true);
    this.textarea.dispatchEvent(evt);
}

CodeFlask.prototype.highlight = function(highlightCode) {
    Prism.highlightElement(highlightCode);
}
