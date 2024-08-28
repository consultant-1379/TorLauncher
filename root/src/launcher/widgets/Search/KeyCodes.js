define([], function () {
    return {

        keyCodes: {
            tab: 9,
            enter: 13,
            escape: 27,
            upArrow: 38,
            downArrow: 40,
            f: 70,
            i: 73,
            numberPad_6: 102,
            numberPad_9: 105
        },

        isFavoriteKey: function (e) {
            return e.originalEvent.keyCode === this.keyCodes.f || e.originalEvent.keyCode === this.keyCodes.numberPad_6;
        },

        isTooltipKey: function (e) {
            return e.originalEvent.keyCode === this.keyCodes.i || e.originalEvent.keyCode === this.keyCodes.numberPad_9;
        },

        isUpArrowKey: function (e) {
            return e.originalEvent.keyCode === this.keyCodes.upArrow;
        },

        isDownArrowKey: function (e) {
            return e.originalEvent.keyCode === this.keyCodes.downArrow;
        },

        isEscapeKey: function (e) {
            return e.originalEvent.keyCode === this.keyCodes.escape;
        },

        isEnterKey: function (e) {
            return e.originalEvent.keyCode === this.keyCodes.enter;
        },

        isTabKey: function (e) {
            return e.originalEvent.keyCode === this.keyCodes.tab;
        }
    };
});
