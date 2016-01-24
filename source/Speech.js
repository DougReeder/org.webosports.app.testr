enyo.kind({
    name: 'testr.Speech',
    layoutKind: "FittableRowsLayout",
    recognition: null,
    recognizing: null,
    finalTranscript: null,
    ignoreOnEnd: null,
    components: [
        { kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
            {fit: true, name: 'apiFld', content: $L("Speech")}
        ]},
        {
            fit: true,
            kind: "Scroller",
            touch: true,
            horizontal: "hidden",
            components: [
                {
                    classes: 'content',
                    components: [
                        {content: "Click on the microphone icon and begin speaking"},
                        {name: 'chameleon', components: [
                            {name: 'micBtn', kind: "onyx.Button", ontap: 'startRecognizing', components: [
                                {tag: 'img', attributes: {src: "assets/voice29.svg", height: 48}}
                            ]}
                        ]},
                        {name: 'textFld', content: " ", style: 'border: 1px solid black'},
                        {allowHtml: true, content: 'Microphone icon made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a>             is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a>'}
                    ]
                }
            ]
        }
    ],
    create: function () {
        var speech = this;
        var speechRecognitionList;

        this.inherited(arguments);
        this.log(window.SpeechRecognition, window.webkitSpeechRecognition);
        if (window.SpeechRecognition) {
            this.$.apiFld.set('content', "Speech API: SpeechRecognition");
            this.recognition = new SpeechRecognition();
            var speechRecognitionList = new SpeechGrammarList();
        } else if (window.webkitSpeechRecognition) {
            this.$.apiFld.set('content', "Speech API: webkitSpeechRecognition");
            this.recognition = new webkitSpeechRecognition();
            var speechRecognitionList = new webkitSpeechGrammarList();
        } else {
            this.$.apiFld.set('content', "Speech API: none");
            this.$.apiFld.addStyles('color: red;')
            return;
        }
        var grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;'
        speechRecognitionList.addFromString(grammar, 1);
        this.recognition.grammars = speechRecognitionList;
        //this.recognition.continuous = false;
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        this.recognition.onresult = function(event) {
            speech.log(event);
            var color = event.results[0][0].transcript;
            speech.$.textFld.set('content', 'Result received: ' + color + '.');
            speech.$.chameleon.addStyles('background-color:'+color);
            console.log('Confidence: ' + event.results[0][0].confidence);
        }

        this.$.textFld.set('content', speechRecognitionList.toString());
    },
    startRecognizing: function (inSender, inEvent) {
        try {
            this.recognition.start();
            this.$.textFld.set('content', "Listening for color");
        } catch (err) {
            this.$.textFld.set('content', err.message || err.name || err.toString());
            this.$.textFld.addStyles('color: red;')
        }
    }
});
