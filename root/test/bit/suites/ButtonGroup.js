define([
    'launcher/widgets/ButtonGroup/ButtonGroup',
    'jscore/core'
], function (ButtonGroup, core) {

    describe('Button Group', function () {

        var btnGroup;

        beforeEach(function () {
            btnGroup = new ButtonGroup();
            btnGroup.attachTo(core.Element.wrap(container));
        });

        afterEach(function () {
            btnGroup.destroy();
        });

        it('should show three options A-Z, Categories, and Favorites', function () {
            var inputs = btnGroup.getElement().findAll('input');
            var spans = btnGroup.getElement().findAll('span');
            expect(inputs[0].getValue()).to.equal('apps');
            expect(inputs[1].getValue()).to.equal('groups');
            expect(inputs[2].getValue()).to.equal('favorites');
            expect(spans[0].getText()).to.equal('A - Z');
            expect(spans[1].getText()).to.equal('Categories');
            expect(spans[2].getText()).to.equal('Favorites');
        });

        it('should check whatever setSelection passes', function () {
            btnGroup.setSelection('apps');
            var inputs = btnGroup.getElement().findAll('input');
            expect(inputs[0].getProperty('checked')).to.be.true;
            expect(inputs[1].getProperty('checked')).to.be.false;
            expect(inputs[2].getProperty('checked')).to.be.false;

            btnGroup.setSelection('groups');
            expect(inputs[0].getProperty('checked')).to.be.false;
            expect(inputs[1].getProperty('checked')).to.be.true;
            expect(inputs[2].getProperty('checked')).to.be.false;
        });

        it('should trigger hash change when checked', function () {
            var inputs = btnGroup.getElement().findAll('input');
            inputs[1].trigger('click');
            expect(window.location.hash).to.equal('#launcher/groups');
            inputs[2].trigger('click');
            expect(window.location.hash).to.equal('#launcher/favorites');
            inputs[0].trigger('click');
            expect(window.location.hash).to.equal('#launcher/apps');
        });
    })

})