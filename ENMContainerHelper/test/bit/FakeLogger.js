define([], function () {
    return {
        error: function(message, name, error){
            console.log('Error', message, name, error);
        }
    };
});