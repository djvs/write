$(document).ready(function() {

  $(".openvideo img").live('click',function(event){
      console.log("a");
      event.preventDefault();
      if($(this).data("site") == "youtube"){
          console.log("b");
          $("iframe.vidframe")[0].src = "http://www.youtube.com/embed/" + $(this).data('site-id');
      }

  });	
  $('.carousel').elegantcarousel({
          delay:50,
          fade:120,
          slide:120,
          effect:'fade',					  
          orientation:'horizontal',
          loop: true,
          autoplay: false,
          time: 3000			});
  
  $('.open_config').click(function() {
                                   
      var display = $('.config_inner').css('display');
      if(display == 'none') { $('.config_inner').fadeIn(200); }								 
      if(display == 'block') { $('.config_inner').fadeOut(200); }	
      return(false);
   });

  
  function center_main() {
      var window_height = $(window).height();
      var main_height = parseInt($('#main').css('height'));
      var main_height_margin = (window_height - main_height) / 2;
      $('#main').css('top',Math.floor(main_height_margin));
  }
  center_main();

});

