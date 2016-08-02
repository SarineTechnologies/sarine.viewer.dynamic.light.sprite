
/*!
sarine.viewer.dynamic.light.sprite - v0.1.0 -  Tuesday, August 2nd, 2016, 5:01:53 PM 
 The source code, name, and look and feel of the software are Copyright © 2015 Sarine Technologies Ltd. All Rights Reserved. You may not duplicate, copy, reuse, sell or otherwise exploit any portion of the code, content or visual design elements without express written permission from Sarine Technologies Ltd. The terms and conditions of the sarine.com website (http://sarine.com/terms-and-conditions/) apply to the access and use of this software.
 */

(function() {
  var LightSprite,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  LightSprite = (function(_super) {
    var allDeferreds, amountOfImages, counter, downloadImagesArr, imageIndex, imagesArr, isEven, setSpeed, sliceCount, speed;

    __extends(LightSprite, _super);

    amountOfImages = 48;

    imageIndex = 0;

    allDeferreds = {};

    imagesArr = {};

    downloadImagesArr = {};

    isEven = true;

    setSpeed = 100;

    speed = 100;

    sliceCount = 0;

    counter = 1;

    function LightSprite(options) {
      var index, _i;
      LightSprite.__super__.constructor.call(this, options);
      this.sliceDownload = options.sliceDownload;
      this.sliceDownload = this.sliceDownload | 3;
      this.imagesArr = {};
      this.downloadImagesArr = {};
      this.first_init_defer = $.Deferred();
      this.full_init_defer = $.Deferred();
      for (index = _i = 0; 0 <= amountOfImages ? _i <= amountOfImages : _i >= amountOfImages; index = 0 <= amountOfImages ? ++_i : --_i) {
        this.imagesArr[index] = void 0;
      }
    }

    LightSprite.prototype.convertElement = function() {
      this.canvas = $("<canvas>");
      this.ctx = this.canvas[0].getContext('2d');
      return this.element.append(this.canvas);
    };

    LightSprite.prototype.first_init = function() {
      var defer, _t;
      defer = this.first_init_defer;
      defer.notify(this.id + " : start load first image");
      _t = this;
      this.loadImage(this.src + "00.png").then(function(img) {
        _t.canvas.attr({
          'width': img.width,
          'height': img.height
        });
        _t.ctx.drawImage(img, 0, 0);
        return defer.resolve(_t);
      });
      return defer;
    };

    LightSprite.prototype.loadParts = function(gap, defer) {
      var downloadImages, index, _t;
      gap = gap || 0;
      defer = defer || $.Deferred();
      downloadImages = [];
      _t = this;
      $.when.apply($, (function() {
        var _i, _len, _ref, _results;
        _ref = (function() {
          var _j, _len, _ref, _results1;
          _ref = Object.getOwnPropertyNames(this.imagesArr);
          _results1 = [];
          for (_j = 0, _len = _ref.length; _j < _len; _j++) {
            index = _ref[_j];
            if ((index + gap) % this.sliceDownload === 0) {
              _results1.push(index);
            }
          }
          return _results1;
        }).call(this);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          index = _ref[_i];
          _results.push((function(index) {
            return _t.loadImage(_t.src + (index < 10 ? "0" + index : index) + ".png").then(function(img) {
              return downloadImages.push(img);
            });
          })(index));
        }
        return _results;
      }).call(this)).then(function() {
        var img, _fn, _i, _len;
        _fn = function(img) {
          var index;
          index = parseInt(img.src.match(/\d+(?=.png)/)[0]);
          return downloadImagesArr[index] = imagesArr[index] = img;
        };
        for (_i = 0, _len = downloadImages.length; _i < _len; _i++) {
          img = downloadImages[_i];
          _fn(img);
        }
        if (Object.getOwnPropertyNames(imagesArr).length === (amountOfImages + 1)) {
          defer.resolve(_t);
        } else {
          _t.loadParts(++gap, defer);
        }
        return _t.delay = (_t.sliceDownload / gap) * setSpeed;
      });
      return defer;
    };

    LightSprite.prototype.full_init = function() {
      var defer;
      defer = this.full_init_defer;
      defer.notify(this.id + " : start load all images");
      this.loadParts().then(defer.resolve);
      return defer;
    };

    LightSprite.prototype.nextImage = function() {
      var indexer;
      indexer = Object.getOwnPropertyNames(downloadImagesArr).map(function(v) {
        return parseInt(v);
      });
      if (indexer.length > 1) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.drawImage(downloadImagesArr[indexer[counter]], 0, 0);
        return counter = (counter + 1) % indexer.length;
      }
    };

    return LightSprite;

  })(Viewer.Dynamic);

  this.LightSprite = LightSprite;

}).call(this);
