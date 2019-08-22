module.exports = {
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            2,
            4
        ],
        "quotes": [
            2,
            "double"
        ],
        "linebreak-style": [
            2,
            "unix"
        ],
        "semi": [
            2,
            "always"
        ],
        "no-unused-vars": [
            2, {"args": "none"}
        ],
        "no-console": 0,
        "no-undef": 0,
        "no-irregular-whitespace": 0,
        "react/jsx-uses-react": 1,
        "react/jsx-uses-vars": 1,
    },
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 6,
        "ecmaFeatures": {
            "jsx": true,
            "experimentalObjectRestSpread": true
        }
    }
};
