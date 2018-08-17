module.exports = {
  "root": true,
  "extends": "standard",
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "mocha": true
  },
  "globals": {
    "log": true
  },
  "plugins": [
    "html"
  ],
  "rules": {
    "camelcase": [
      0,
      {
        "properties": "never"
      }
    ],
  }
};
