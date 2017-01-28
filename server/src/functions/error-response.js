module.exports = function (message) {
    console.error('Responding: ' + message);
    return { message: message };
};
