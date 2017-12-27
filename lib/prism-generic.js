Prism.languages.generic = {
    'string': {
        pattern: /("|'(?!(?:|s|d|t|ve|ll)(?:\s|\r|\n|$)))(?:(?:(?:(?!\1|\\)(?:.|\n))(?:\\.)?)*)\1/,
        greedy: true,
    },
    'number': /[0-9]+/,
    'keyword': /[(){}\[\]]/,
    'operator': /[\^°!"§$%&/=?\\´`*+~#'\-_.:,;<>|@µ€£¥¢¡¿×÷±]/
 }
