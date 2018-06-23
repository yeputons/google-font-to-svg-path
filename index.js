var makerjs = require('makerjs');
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.renderCurrent = function () {
            var size = _this.sizeInput.valueAsNumber;
            if (!size)
                size = parseFloat(_this.sizeInput.value);
            if (!size)
                size = 100;
            _this.render(_this.selectFamily.selectedIndex, _this.selectVariant.selectedIndex, _this.textInput1.value, size, _this.unionCheckbox.checked, parseFloat(_this.bezierAccuracy.value) || undefined, function(svg) { _this.updateSvg1(svg); });
            _this.render(_this.selectFamily.selectedIndex, _this.selectVariant.selectedIndex, _this.textInput2.value, size, _this.unionCheckbox.checked, parseFloat(_this.bezierAccuracy.value) || undefined, function(svg) { _this.updateSvg2(svg); });
        };
        this.loadVariants = function () {
            _this.selectVariant.options.length = 0;
            var f = _this.fontList.items[_this.selectFamily.selectedIndex];
            var v = f.variants.forEach(function (v) { return _this.addOption(_this.selectVariant, v); });
            _this.renderCurrent();
        };
    }
    App.prototype.init = function () {
        this.selectFamily = this.$('#font-select');
        this.selectVariant = this.$('#font-variant');
        this.unionCheckbox = this.$('#input-union');
        this.textInput1 = this.$('#input-text1');
        this.textInput2 = this.$('#input-text2');
        this.bezierAccuracy = this.$('#input-bezier-accuracy');
        this.sizeInput = this.$('#input-size');
        this.renderDiv1 = this.$('#svg-render1');
        this.renderDiv2 = this.$('#svg-render2');
        this.renderDivAnim = this.$('#svg-render-anim');
        this.outputTextarea = this.$('#output-svg');
        this.updateButton = this.$('#input-update');
    };
    App.prototype.handleEvents = function () {
        this.selectFamily.onchange = this.loadVariants;
        this.updateButton.onclick = this.renderCurrent;
    };
    App.prototype.$ = function (selector) {
        return document.querySelector(selector);
    };
    App.prototype.addOption = function (select, optionText) {
        var option = document.createElement('option');
        option.text = optionText;
        if (optionText == "Noto Serif") {
            option.selected = true;
        }
        select.options.add(option);
    };
    App.prototype.getGoogleFonts = function (apiKey) {
        var _this = this;
        var xhr = new XMLHttpRequest();
        xhr.open('get', 'https://www.googleapis.com/webfonts/v1/webfonts?key=' + apiKey, true);
        xhr.onloadend = function () {
            _this.fontList = JSON.parse(xhr.responseText);
            _this.fontList.items.forEach(function (font) { return _this.addOption(_this.selectFamily, font.family); });
            _this.loadVariants();
            _this.handleEvents();
        };
        xhr.send();
    };
    App.prototype.render = function (fontIndex, variantIndex, text, size, union, bezierAccuracy, cb) {
        text = text.toUpperCase();
        var _this = this;
        var f = this.fontList.items[fontIndex];
        var v = f.variants[variantIndex];
        var url = f.files[v];
        opentype.load(url, function (err, font) {
            //generate the text using a font
            var textModel = new makerjs.models.Text(font, text, size, union, false, bezierAccuracy);
            for (var i in textModel.models) {
                textModel.models[i].layer = i;
            }
            var svg = makerjs.exporter.toSVG(textModel);
            cb(svg);
        });
    };
    App.prototype.updateSvg1 = function (svg) {
        this.renderDiv1.innerHTML = svg;
        this.updateAnimation();
    };
    App.prototype.updateSvg2 = function (svg) {
        this.renderDiv2.innerHTML = svg;
        this.updateAnimation();
    };
    App.prototype.updateAnimation = function () {
        animateAnagram(this.textInput1.value.toUpperCase(), this.textInput2.value.toUpperCase(), this.renderDiv1.children[0], this.renderDiv2.children[0], this.renderDivAnim);
        this.outputTextarea.value = this.renderDivAnim.innerHTML;
    };
    return App;
}());
var app = new App();
window.onload = function () {
    app.init();
    app.getGoogleFonts('AIzaSyAOES8EmKhuJEnsn9kS1XKBpxxp-TgN8Jc');
};
