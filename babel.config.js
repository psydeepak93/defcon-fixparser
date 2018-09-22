module.exports = {
    "plugins": ["@babel/plugin-proposal-class-properties"],
    "presets": [
        ["@babel/react"],
        ["@babel/preset-env", {
            "targets": {
                "node": "current"
            }
        }]
    ],
    "compact": false
};
