
/*!
sarine.viewer.dynamic.light.sprite - v0.1.0 -  Sunday, August 7th, 2016, 3:56:19 PM 
 The source code, name, and look and feel of the software are Copyright © 2015 Sarine Technologies Ltd. All Rights Reserved. You may not duplicate, copy, reuse, sell or otherwise exploit any portion of the code, content or visual design elements without express written permission from Sarine Technologies Ltd. The terms and conditions of the sarine.com website (http://sarine.com/terms-and-conditions/) apply to the access and use of this software.
 */

(function() {
  var LightSprite, Viewer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Viewer = (function() {
    var error, rm;

    rm = ResourceManager.getInstance();

    function Viewer(options) {
      console.log("");
      this.first_init_defer = $.Deferred();
      this.full_init_defer = $.Deferred();
      this.src = options.src, this.element = options.element, this.autoPlay = options.autoPlay, this.callbackPic = options.callbackPic;
      this.id = this.element[0].id;
      this.element = this.convertElement();
      Object.getOwnPropertyNames(Viewer.prototype).forEach(function(k) {
        if (this[k].name === "Error") {
          return console.error(this.id, k, "Must be implement", this);
        }
      }, this);
      this.element.data("class", this);
      this.element.on("play", function(e) {
        return $(e.target).data("class").play.apply($(e.target).data("class"), [true]);
      });
      this.element.on("stop", function(e) {
        return $(e.target).data("class").stop.apply($(e.target).data("class"), [true]);
      });
      this.element.on("cancel", function(e) {
        return $(e.target).data("class").cancel().apply($(e.target).data("class"), [true]);
      });
    }

    error = function() {
      return console.error(this.id, "must be implement");
    };

    Viewer.prototype.first_init = Error;

    Viewer.prototype.full_init = Error;

    Viewer.prototype.play = Error;

    Viewer.prototype.stop = Error;

    Viewer.prototype.convertElement = Error;

    Viewer.prototype.cancel = function() {
      return rm.cancel(this);
    };

    Viewer.prototype.loadImage = function(src) {
      return rm.loadImage.apply(this, [src]);
    };

    Viewer.prototype.setTimeout = function(delay, callback) {
      return rm.setTimeout.apply(this, [this.delay, callback]);
    };

    return Viewer;

  })();

  this.Viewer = Viewer;

  Viewer.Dynamic = (function(_super) {
    __extends(Dynamic, _super);

    Dynamic.playing = false;

    Dynamic.prototype.nextImage = Error;

    function Dynamic(options) {
      Dynamic.__super__.constructor.call(this, options);
      this.delay = 50;
      Object.getOwnPropertyNames(Viewer.Dynamic.prototype).forEach(function(k) {
        if (this[k].name === "Error") {
          return console.error(this.id, k, "Must be implement", this);
        }
      }, this);
    }

    Dynamic.prototype.play = function(force, delay) {
      var _t;
      if (force) {
        this.playing = true;
      }
      this.nextImage.apply(this);
      if (this.playing) {
        _t = this;
        return this.setTimeout(this.delay, _t.play);
      }
    };

    Dynamic.prototype.stop = function() {
      return this.playing = false;
    };

    return Dynamic;

  })(Viewer);

  LightSprite = (function(_super) {
    var SprtieImg, allDeferreds, amountOfImages, counter, downloadImagesArr, imageIndex, imagesArr, isEven, setSpeed, sliceCount, speed;

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
      this.sliceDownload = options.sliceDownload, this.jsonFileName = options.jsonFileName, this.firstImagePath = options.firstImagePath, this.spritesPath = options.spritesPath, this.oneSprite = options.oneSprite, this.imageType = options.imageType;
      this.isSprite = false;
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
      this.loadImage(this.src + this.firstImagePath).then(function(img) {
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

    LightSprite.prototype.full_init = function() {
      var defer, _t;
      defer = this.full_init_defer;
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
        _t.isSprite = true;
        return _t.downloadSprite(defer).then(function() {
          if (_t.autoPlay) {
            _t.play(true);
          }
          return true;
        });
      }).fail((function(_this) {
        return function() {
          _t.isSprite = false;
          if (_t.isAvailble) {
            return _t.loadParts().then(defer.resolve);
          } else {
            return defer.resolve;
          }
        };
      })(this));
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
      var col, imageInSprite, imgInfo, indexer, playingSprite, row;
      if (!this.isSprite) {
        indexer = Object.getOwnPropertyNames(downloadImagesArr).map(function(v) {
          return parseInt(v);
        });
        if (indexer.length > 1) {
          this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
          this.ctx.drawImage(downloadImagesArr[indexer[counter]], 0, 0);
          return counter = (counter + 1) % indexer.length;
        }
      } else {
        this.delta = 1;
        if (this.metadata && this.sprites.length > 0) {
          if (this.imageIndex + this.delta !== this.metadata.TotalImageCount) {
            this.imageIndex += this.delta;
          } else {
            if (this.oneSprite) {
              this.imageIndex = 0;
            } else {
              this.imageIndex += this.delta;
            }
          }
          playingSprite = this.sprites[this.currentSprite];
          if ((this.imageIndex - this.imagegap) % playingSprite.totalImage === 0 && this.imageIndex > 0) {
            if (this.sprites.length - 1 === this.currentSprite) {
              playingSprite = this.sprites[--this.currentSprite];
            } else {
              playingSprite = this.sprites[++this.currentSprite];
            }
            this.imagegap = this.imageIndex;
          }
          imageInSprite = this.imageIndex - this.imagegap;
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
      }
    };

    return LightSprite;

  })(Viewer.Dynamic);

  this.LightSprite = LightSprite;

}).call(this);
