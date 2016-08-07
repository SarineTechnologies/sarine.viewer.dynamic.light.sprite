###!
sarine.viewer.dynamic.light.sprite - v0.1.0 -  Sunday, August 7th, 2016, 3:56:19 PM 
 The source code, name, and look and feel of the software are Copyright © 2015 Sarine Technologies Ltd. All Rights Reserved. You may not duplicate, copy, reuse, sell or otherwise exploit any portion of the code, content or visual design elements without express written permission from Sarine Technologies Ltd. The terms and conditions of the sarine.com website (http://sarine.com/terms-and-conditions/) apply to the access and use of this software.
###

class LightSprite extends Viewer.Dynamic 
	
	amountOfImages = 48 
	imageIndex = 0	
	allDeferreds = {} 
	imagesArr = {}
	downloadImagesArr = {}
	isEven = true
	setSpeed = 100
	speed = 100
	sliceCount = 0
	counter = 1
	constructor: (options) ->
		super(options)						
		{@sliceDownload,@jsonFileName,@firstImagePath,@spritesPath,@oneSprite,@imageType} = options
		@isSprite = false

		#sprite properties
		@imageType = @imageType || '.png' 
		@metadata = undefined
		@sprites = []
		@currentSprite = 0
		@playing = false 
		@delta = 1 
		@imageIndex = -1
		@imagesDownload = 0
		@imagegap = 0 
		@playOrder = {}  

		#images properties
		@isAvailble = true
		@sliceDownload = @sliceDownload | 3
		@imagesArr = {}
		@downloadImagesArr = {}
		@first_init_defer = $.Deferred()
		@full_init_defer = $.Deferred()
		for index in [0..amountOfImages]
			@imagesArr[index] = undefined		

	class SprtieImg
		constructor: (img,size) ->
			@column = img.width / size
			@rows = img.height / size
			@image = img
			@totalImage = @column * @rows
			
	convertElement : () ->
		@canvas = $("<canvas>")		
		@ctx = @canvas[0].getContext('2d')
		@element.append(@canvas)		

	first_init : () ->		
		defer = @first_init_defer
		_t = @
		@loadImage(@src + @firstImagePath).then((img)->
			if img.src.indexOf('data:image') != -1 || img.src.indexOf('no_stone') != -1
				_t.isAvailble = false
				_t.canvas.attr {'class' : 'no_stone'}
			_t.canvas.attr {'width':img.width, 'height': img.height}
			_t.ctx.drawImage img , 0 , 0 			
			defer.resolve(_t) 
		)
		defer

	full_init : ()->
		defer = @full_init_defer
		_t = @
		$.getJSON @src + @jsonFileName , (data)->
			if !data.FPS then data.FPS = 15
			_t.metadata = data
			_t.canvas.attr({
					"width": data.ImageSize
					"height": data.ImageSize
				})
			if data.background != ''
				_t.canvas.parent().css "background" , "##{data.background}"
			_t.delay = 1000 / data.FPS
			if(_t.playing)
				_t.play()
		.then ()->
			_t.isSprite = true
			_t.downloadSprite(defer).then(()-> 
				if _t.autoPlay 
					_t.play true
				true
			)	
		.fail =>			
			_t.isSprite = false
			if _t.isAvailble then _t.loadParts().then(defer.resolve) else defer.resolve

		defer
			
	downloadSprite : (mainDefer)->
		_t = @
		@loadImage(@src + @spritesPath + (if !@oneSprite then @sprites.length else "") + @imageType ).then (img)->
			sprite = new SprtieImg(img,_t.metadata.ImageSize)
			_t.imagesDownload += sprite.column * sprite.rows
			_t.sprites.push sprite
			if(_t.imagesDownload >= _t.metadata.TotalImageCount)
				mainDefer.resolve(_t)
			else
				_t.downloadSprite(mainDefer)
			true
	
	loadParts : (gap,defer)->
		gap = gap || 0
		defer = defer || $.Deferred()
		downloadImages = []
		_t = @
		$.when.apply($,for index in (index for index in Object.getOwnPropertyNames(@imagesArr) when (index + gap) % @sliceDownload == 0)
			do (index)->
				_t.loadImage(_t.src + (if index < 10 then "0" + index else index)  + ".png").then((img)-> downloadImages.push img )
			).then(()->
					for img in downloadImages
						do (img)->
							index = parseInt(img.src.match(/\d+(?=.png)/)[0])
							downloadImagesArr[index] = imagesArr[index] = img
					if Object.getOwnPropertyNames(imagesArr).length == (amountOfImages + 1)
						defer.resolve(_t)
					else
						_t.loadParts(++gap,defer)
					_t.delay = (_t.sliceDownload / gap) * setSpeed  
				)
		return defer

	nextImage : ()->
		if !@isSprite 
			indexer = Object.getOwnPropertyNames(downloadImagesArr).map((v)-> parseInt(v)) 
			if indexer.length > 1
				@ctx.clearRect 0, 0, @ctx.canvas.width, @ctx.canvas.height
				@ctx.drawImage downloadImagesArr[indexer[counter]] , 0 , 0			
				counter = (counter + 1) % indexer.length
		else
			@delta = 1
			if(@metadata && @sprites.length > 0)
				if (@imageIndex + @delta != @metadata.TotalImageCount)
					@imageIndex += @delta
				else
					if(@oneSprite)
						@imageIndex = 0
					else
						@imageIndex += @delta 
				playingSprite = @sprites[@currentSprite]
				if (@imageIndex - @imagegap)  %  playingSprite.totalImage == 0 && @imageIndex > 0
					if @sprites.length - 1 == @currentSprite
						playingSprite = @sprites[--@currentSprite]	
					else
						playingSprite = @sprites[++@currentSprite]
					@imagegap = @imageIndex

				imageInSprite = @imageIndex - @imagegap
				col =  parseInt(-1 * parseInt(imageInSprite % playingSprite.column) * @metadata.ImageSize)
				row = parseInt(-1 * parseInt(imageInSprite / playingSprite.rows) * @metadata.ImageSize)
				if !@playOrder[@imageIndex]
					@playOrder[@imageIndex] = {
						spriteNumber : @currentSprite
						col : col
						row : row
					}
				imgInfo = @playOrder[@imageIndex]
				if @imageType == '.png'
					@ctx.clearRect(0,0,@metadata.ImageSize,@metadata.ImageSize);
				@ctx.drawImage(@sprites[imgInfo.spriteNumber].image, imgInfo.col  ,imgInfo.row)

@LightSprite = LightSprite