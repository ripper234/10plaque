/* Main JS  */
(function($){
	/* Isotope custom layout */
$.Isotope.prototype._getCenteredMasonryColumns = function() {
    this.width = this.element.width();
    
    var parentWidth = this.element.parent().width();
    
                  // i.e. options.masonry && options.masonry.columnWidth
    var colW = this.options.masonry && this.options.masonry.columnWidth ||
                  // or use the size of the first item
                  this.$filteredAtoms.outerWidth(true) ||
                  // if there's no items, use size of container
                  parentWidth;
    
    var cols = Math.floor( parentWidth / colW );
    cols = Math.max( cols, 1 );

    // i.e. this.masonry.cols = ....
    this.masonry.cols = cols;
    // i.e. this.masonry.columnWidth = ...
    this.masonry.columnWidth = colW;
	
  };

  // modified Isotope methods for gutters in masonry
$.Isotope.prototype._getMasonryGutterColumns = function() {
  var gutter = this.options.masonry && this.options.masonry.gutterWidth || 0;
      containerWidth = this.element.parent().width();

  this.masonry.columnWidth = this.options.masonry && this.options.masonry.columnWidth ||
                // or use the size of the first item
                this.$filteredAtoms.outerWidth(true) ||
                // if there's no items, use size of container
                containerWidth;

  this.masonry.columnWidth += gutter;

  this.masonry.cols = Math.floor( ( containerWidth + gutter ) / this.masonry.columnWidth );
  this.masonry.cols = Math.max( this.masonry.cols, 1 );
};

$.Isotope.prototype._masonryReset = function() {
	// layout-specific props
	this.masonry = {};
	// FIXME shouldn't have to call this again
	
	this._getCenteredMasonryColumns();	
	this._getMasonryGutterColumns();
	var i = this.masonry.cols;
	this.masonry.colYs = [];
	while (i--) {
	  this.masonry.colYs.push( 0 );
	}
};

$.Isotope.prototype._masonryResizeChanged = function() {
    var prevColCount = this.masonry.cols;
    // get updated colCount
    this._getCenteredMasonryColumns();
	this._getMasonryGutterColumns();
	
    return ( this.masonry.cols !== prevColCount );
  };

$.Isotope.prototype._masonryGetContainerSize = function() {
	var unusedCols = 0,
        i = this.masonry.cols;
    // count unused columns
    while ( --i ) {
      if ( this.masonry.colYs[i] !== 0 ) {
        break;
      }
      unusedCols++;
    }
    
    return {
          height : Math.max.apply( Math, this.masonry.colYs ),
          // fit container to columns that have been used;
          width : (this.masonry.cols - unusedCols) * this.masonry.columnWidth
        };
  };
 
/* End isotope custom layout */

	function resizedw(){
		// Haven't resized in 100ms!
		_flipper_pause = false;
	}

	var doit;
	$(document).ready(function(){	
		$('.accordion-toggle').click(function(){
			if($(this).hasClass('collapsed')){
				$(this).parent().removeClass('collapsed');
			} else {
				$(this).parent().addClass('collapsed');
			}
		});
			
		if(_DEVICE_TYPE_ != 'mobile'){
			$(window).resize(function(){
				_flipper_pause = true;
			  clearTimeout(doit);
			  doit = setTimeout(resizedw, 500);
			});
			
			var Page = (function() {
						return {
							init: function() {
								$( '.bb-bookblock' ).each( function( i ) {
									var $bookBlock = $( this ),
										bb = $bookBlock.bookblock( {
											speed : _flipper_speed,
											shadowSides : 0.8,
											shadowFlip : 0.7,
											orientation:'horizontal',
											circular:true
										} );
								})
							}
						}
				})();			
				
			Page.init();
		} else {
			
		}
			
		/* flipper - pause on hover */
		$(".flipper-container").each(function(){
			$(this).hover(function(){
				_flipper_pause = true;
			},function(){
				_flipper_pause = false;
			});
		});
		
		/* metro slider */			
		if($(".metro-slider").length > 0){
			setTimeout('metro_flip()',_flipper_delay_between_flip);
			
			/* metro-slider */
			$('.metro-slider').flexslider({
				animationSpeed:_metroslide_speed,
				animation: "slide",
				easing: "easeOutExpo",
				slideshow:false
			  });
		}
		
		  
		/* projects */
		var $container = $('#portfolio-container');
		if($container.length > 0){
			$container.imagesLoaded(function(){				
				$container.isotope({
					itemSelector : ".element",				
					masonry:{
						gutterWidth:20,
						columnWidth:220
					},
					getSortData : {
						order : function ( $elem ) {

							return $elem.find('.number').text();
							}
					}
				});
			});
			
			$("#project-tags").find("a").click(function(){
				$('#portfolio-container').isotope({ filter: $(this).attr('data-filter')});
				$(this).parent().parent().find('a').removeClass('active');
				$(this).addClass('active');
			});
			
			/* Project View Popup */
			$('.portfolio-view').each(function(){
				var id = $(this).attr('href');
				$(this).click(function(){
					lazy_load($(id).find('.lazy-load'));
					$(id).modal();
					return false;				
				});				
			});
		}
		
		/* Show/hide gotop button */
		$('#gotop').fadeOut();
		
		if(_DEVICE_TYPE_ != 'mobile'){

			$(window).scroll(function(){
				var currentScrollTop = $(document).scrollTop();
				
				/* Show/hide gotop button */
				if(currentScrollTop > $(window).height()){
					$('#gotop').fadeIn();
				} else {
					$('#gotop').fadeOut();
				}
				
				/* Check if Page scrollTop meets a piechart, then animate the piechart */
				$('.piechart').each(function(){
					if($(this).offset().top - 500 <= currentScrollTop){
						// animate it
						_animatePieChart($(this));
					}
				});
				
				/* Set active menu item when scrolling to a page section */
				var sections = $('.page-section');
				for(var i = sections.length - 1; i >= 0; i--){
					if(currentScrollTop >= $(sections[i]).offset().top - 100){
						/*if($(window).width() > 767){
							if(i>0){
								$('#maintop').addClass('shrink');
							} else {
								$('#maintop').removeClass('shrink');
							}
						}
						var id = $(sections[i]).attr('id');
						var active_item = $('#navigation').find("a[href='#" + id + "']");
						if(active_item.length > 0){
							$('#navigation').find("a").removeClass("active");
							active_item.addClass("active");
						}*/
						
						if($(window).width() > 767){
							if(i>0){
								$('#navitop').addClass('show');
							} else {
								$('#navitop').removeClass('show');
							}
						}
						
						
						
						//location.hash = "#" + id;
						break;
					}
				}
			});		
		}
		
		$('.navigation').find("ul.menu").prepend('<li class="triangle"><span><!-- --></span></li>');
		/* Navigation scrolling */
		$('.navigation').find("a").click(function(e){
			scrollTo($(this).attr("href"));
			location.hash = $(this).attr("href");			
			return false;
		});
		
		/* Navigation toogle in mobile */
		$('.icon-menu').click(function(){
			$(this).parent().toggleClass('active');
		});
		
		if(_navigation_shrink){
			// shrink on searchbox focus
			$('#search input[type="text"]').focus(function(){
				$('#navigation', $(this).parent().parent().parent().parent().parent()).find('.menu').addClass('shrink');
			}).blur(function(){
				var parent = $(this).parent().parent().parent().parent().parent();
				setTimeout(function(){$('#navigation', parent).find('.menu').removeClass('shrink')},150);
			});
		}
		
		if(typeof _page_sections_bg !== 'undefined'){
			for(var section in _page_sections_bg){
				if(typeof section !== 'undefined'){
					var obj = _page_sections_bg[section];
					if(obj.bgimage != ''){
						var img = $('<img/>');
						img.attr('data-div',section).attr('data-color',obj.bgcolor).attr('src', obj.bgimage)
							.load(function() {
								if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
									// error loading image
								} else {
									// success
									$("#"+jQuery(this).attr('data-div')).css({'background':((jQuery(this).attr('data-color') != '')?jQuery(this).attr('data-color'):'#FFF') + ' url("'+jQuery(this).attr('src')+'") top center no-repeat','background-attachment':'fixed','background-size':'cover'});
								}
							});
					} else {
						$("#"+section).css({'background':((obj.bgcolor != '')?obj.bgcolor:'#FFF')});
					}
				}
			}
		}
	});
	
	
	// Portfolio 2
	//Grid.init();
	
	
	
})(jQuery);

/* Popup Next Project */
function popup_next(current,next){
	$j = jQuery;
	$j(current).modal('hide');
	
	lazy_load($j(next).find('.lazy-load'));
	$j(next).modal('show');
}

/* Popup Prev Project */
function popup_next(current,prev){
	$j = jQuery;
	$j(current).modal('hide');
	
	lazy_load($j(prev).find('.lazy-load'));
	$j(prev).modal('show');
}


/*
 * Continuously auto-flip flipper items
 */
function metro_flip(){
	if(_DEVICE_TYPE_ != 'mobile'){
		var w = jQuery(window).width();
		if(((w > 540 && w < 768) || w >= 980) && !_flipper_pause){
			$j = jQuery;
			var active_slide = $j(".metro-slider").find(".flex-active-slide").find(".metro-slide");
			var that = active_slide.find(".flipper-container.active");
			if(that.length == 0){
				that = active_slide.find(".flipper-container:eq(0)");
				that.addClass("active");
			}
			
			// change the active item			
			var count = active_slide.find(".flipper-container").length;
			var active_index = active_slide.find(".flipper-container").index(that);
			
			if(active_index == count - 1){
				next = active_slide.find(".flipper-container:eq(0)");
			} else {
				next = active_slide.find(".flipper-container:eq(" + (active_index+1) + ")");
			}
			
			that.removeClass("active");
			next.addClass("active");
			
			that.find(".bb-bookblock").bookblock('prev');
		}
	} else {
		// sliding flipper instead of bookblock
		$j = jQuery;
		var active_slide = $j(".metro-slider").find(".flex-active-slide").find(".metro-slide");
		var that = active_slide.find(".flipper-container.active");
		if(that.length == 0){
			that = active_slide.find(".flipper-container:eq(0)");
			that.addClass("active");
		}
		
		// change the active flipper item					
		var fliper_containers = active_slide.find(".flipper-container");
		var count = fliper_containers.length;
		var active_index = fliper_containers.index(that);
		
		if(active_index == count - 1){
			next = active_slide.find(".flipper-container:eq(0)");
		} else {
			next = $(fliper_containers[active_index+1]);
		}
		
		that.removeClass("active");
		next.addClass("active");
		
		// sliding 
		var active_item = that.find(".flipper-item.active");
		if(active_item.length == 0){
			// set first item as active if not found any active items
			active_item = that.find(".flipper-item:eq(0)");
			active_item.addClass("active");
		}
		
		var items = that.find(".flipper-item");
		var next_item;
		
		if(items.index(active_item) == items.length - 1){
			// back to the first item
			next_item = that.find(".flipper-item:eq(0)");
		} else {
			next_item = active_item.next();
		}
		
		active_item.removeClass("active");
		next_item.addClass("active");
		
		that.find(".bb-bookblock").css({'margin-left':((-100*items.index(next_item))+'%')});
	}
	
	setTimeout('metro_flip()',_flipper_delay_between_flip);
}

// lazy load an img with attribute 'data-src'
function lazy_load(img){
	$j = jQuery;
	if(img.attr('src') === undefined){
		img.attr('src', img.attr('data-src'))
		.load(function() {
			if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
				// error loading image
			} else {
				// success
			}
		});
	}
}



/*
 * Animate Pie Chart
 * Triggered only if page is scrolled to its position
 */
function _animatePieChart(div){
	$j = jQuery;
	
	var obj = div.find('.value');
	var end_value = obj.html();
	
	obj.animate(
		{height:end_value},{
		step:function(now,fx){
				if(now > 180){$j(this).parent().addClass('big');}
				$j(this).parent().attr('data-value',Math.floor(now));
			},
		duration: _pie_animate_duration
		},'swing');
}

/* Scroll to top */
function gotop(){
	$j = jQuery;
	$j("body,html").animate({scrollTop:0},500,'easeInQuad')
}
/* Scroll to a div ID */
function scrollTo(div){
	$j = jQuery;
	$j('html,body').animate({
        scrollTop: $j(div).offset().top - 75},500,'easeInQuad');
}