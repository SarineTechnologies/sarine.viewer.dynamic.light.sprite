
/*!
sarine.viewer.dynamic.light.sprite - v0.1.0 -  Thursday, August 4th, 2016, 4:49:32 PM 
 The source code, name, and look and feel of the software are Copyright © 2015 Sarine Technologies Ltd. All Rights Reserved. You may not duplicate, copy, reuse, sell or otherwise exploit any portion of the code, content or visual design elements without express written permission from Sarine Technologies Ltd. The terms and conditions of the sarine.com website (http://sarine.com/terms-and-conditions/) apply to the access and use of this software.
 */

(function() {
  var LightSprite,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  LightSprite = (function(_super) {
    var SprtieImg, allDeferreds, amountOfImages, counter, downloadImagesArr, imageIndex, imagesArr, isEven, isSprite, setSpeed, sliceCount, speed;

    __extends(LightSprite, _super);

    isSprite = false;

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
      this.sliceDownload = options.sliceDownload, this.jsonFileName = options.jsonFileName, this.firstImagePath = options.firstImagePath, this.spritesPath = options.spritesPath, this.oneSprite = options.oneSprite, this.imageType = options.imageType;
      this.imageType = this.imageType || '.png';
      this.metadata = void 0;
      this.sprites = [];
      this.currentSprite = 0;
      this.playing = false;
      this.delta = 1;
      this.imageIndex = -1;
      this.imagesDownload = 0;
      this.imagegap = 0;
      this.playOrder = {};
      this.isAvailble = true;
      this.sliceDownload = this.sliceDownload | 3;
      this.imagesArr = {};
      this.downloadImagesArr = {};
      this.first_init_defer = $.Deferred();
      this.full_init_defer = $.Deferred();
      for (index = _i = 0; 0 <= amountOfImages ? _i <= amountOfImages : _i >= amountOfImages; index = 0 <= amountOfImages ? ++_i : --_i) {
        this.imagesArr[index] = void 0;
      }
    }

    SprtieImg = (function() {
      function SprtieImg(img, size) {
        this.column = img.width / size;
        this.rows = img.height / size;
        this.image = img;
        this.totalImage = this.column * this.rows;
      }

      return SprtieImg;

    })();

    LightSprite.prototype.convertElement = function() {
      this.canvas = $("<canvas>");
      this.ctx = this.canvas[0].getContext('2d');
      return this.element.append(this.canvas);
    };

    LightSprite.prototype.first_init = function() {
      var defer, _t;
      defer = this.first_init_defer;
      _t = this;
      $.getJSON(this.src + this.jsonFileName, function(data) {
        if (!data.FPS) {
          data.FPS = 15;
        }
        _t.metadata = data;
        _t.canvas.attr({
          "width": data.ImageSize,
          "height": data.ImageSize
        });
        if (data.background !== '') {
          _t.canvas.parent().css("background", "#" + data.background);
        }
        _t.delay = 1000 / data.FPS;
        if (_t.playing) {
          return _t.play();
        }
      }).then(function() {
        isSprite = true;
        return _t.first_init_sprite();
      }).fail((function(_this) {
        return function() {
          isSprite = false;
          return _t.first_init_images();
        };
      })(this));
      return defer;
    };

    LightSprite.prototype.full_init = function() {
      if (isSprite) {
        return this.full_init_sprite();
      } else {
        return this.full_init_images();
      }
    };

    LightSprite.prototype.first_init_images = function() {
      var defer, _t;
      defer = this.first_init_defer;
      defer.notify(this.id + " : start load first image");
      _t = this;
      this.loadImage(this.src + "00.png").then(function(img) {
        if (img.src.indexOf('data:image') !== -1 || img.src.indexOf('no_stone') !== -1) {
          _t.isAvailble = false;
          _t.canvas.attr({
            'class': 'no_stone'
          });
        }
        _t.canvas.attr({
          'width': img.width,
          'height': img.height
        });
        _t.ctx.drawImage(img, 0, 0);
        return defer.resolve(_t);
      });
      return defer;
    };

    LightSprite.prototype.first_init_sprite = function() {
      var defer, _t;
      defer = this.first_init_defer;
      _t = this;
      _t.loadImage(_t.src + _t.firstImagePath).then(function(img) {
        _t.ctx.drawImage(img, 0, 0, _t.metadata.ImageSize, _t.metadata.ImageSize);
        _t.imageIndex = 0;
        return defer.resolve(_t);
      });
      return defer;
    };

    LightSprite.prototype.full_init_images = function() {
      var defer;
      defer = this.full_init_defer;
      if (this.isAvailble) {
        this.loadParts().then(defer.resolve);
      } else {
        defer.resolve;
      }
      return defer;
    };

    LightSprite.prototype.full_init_sprite = function() {
      var defer, _t;
      defer = this.full_init_defer;
      _t = this;
      this.downloadSprite(defer).then(function() {
        if (_t.autoPlay) {
          _t.play(true);
        }
        return true;
      });
      return defer;
    };

    LightSprite.prototype.downloadSprite = function(mainDefer) {
      var _t;
      _t = this;
      return this.loadImage(this.src + this.spritesPath + (!this.oneSprite ? this.sprites.length : "") + this.imageType).then(function(img) {
        var sprite;
        sprite = new SprtieImg(img, _t.metadata.ImageSize);
        _t.imagesDownload += sprite.column * sprite.rows;
        _t.sprites.push(sprite);
        if (_t.imagesDownload >= _t.metadata.TotalImageCount) {
          mainDefer.resolve(_t);
        } else {
          _t.downloadSprite(mainDefer);
        }
        return true;
      });
    };

    LightSprite.prototype.nextImage = function() {
      var col, imageInSprite, imgInfo, playingSprite, row, totalLessOne;
      if (this.metadata && this.sprites.length > 0) {
        if (this.imageIndex + this.delta === this.metadata.TotalImageCount || this.imageIndex + this.delta === this.imagesDownload) {
          this.delta = -1;
        }
        if (this.imageIndex + this.delta === -1) {
          this.delta = 1;
        }
        this.imageIndex += this.delta;
        playingSprite = this.sprites[this.currentSprite];
        if ((this.imageIndex - this.imagegap) % playingSprite.totalImage === 0 && this.imageIndex > 0) {
          if (this.delta === 1) {
            playingSprite = this.sprites[++this.currentSprite];
          } else if (this.delta === -1) {
            playingSprite = this.sprites[--this.currentSprite];
          }
          this.imagegap = this.imageIndex;
        }
        if (!this.backOnEnd && this.sprites.length === 1) {
          totalLessOne = this.sprites[this.currentSprite].totalImage - 1;
          imageInSprite = this.imageIndex - this.imagegap + (this.delta === -1 ? totalLessOne : 0);
        } else {
          imageInSprite = this.imageIndex - this.imagegap + (this.delta === -1 ? this.sprites[this.currentSprite].totalImage : 0);
        }
        col = parseInt(-1 * parseInt(imageInSprite % playingSprite.column) * this.metadata.ImageSize);
        row = parseInt(-1 * parseInt(imageInSprite / playingSprite.rows) * this.metadata.ImageSize);
        if (!this.playOrder[this.imageIndex]) {
          this.playOrder[this.imageIndex] = {
            spriteNumber: this.currentSprite,
            col: col,
            row: row
          };
        }
        imgInfo = this.playOrder[this.imageIndex];
        if (this.imageType === '.png') {
          this.ctx.clearRect(0, 0, this.metadata.ImageSize, this.metadata.ImageSize);
        }
        return this.ctx.drawImage(this.sprites[imgInfo.spriteNumber].image, imgInfo.col, imgInfo.row);
      }
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
