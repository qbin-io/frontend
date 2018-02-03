((url) => Prism.languages.generic = {
    'url': url,
    'string': {
        pattern: /("|'(?!(?:|s|d|t|ve|ll)(?:\s|\r|\n|$)))(?:(?:(?:(?!\1|\\)(?:.|\n))(?:\\.)?)*)\1/,
        greedy: true,
        inside: {
            'url': url
        }
    },
    'number': /[0-9]+/,
    'keyword': /[(){}\[\]]/,
    'operator': /[\^°!"§$%&/=?\\´`*+~#'\-_.:,;<>|@µ€£¥¢¡¿×÷±]/
 })(/\b([a-z]{3,7}:\/\/|tel:)[\w\-+%~/.:#=?&amp;]+|\b\S+@[\w.]+[a-z]{2}/)
