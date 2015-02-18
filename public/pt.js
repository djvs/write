$(document).ready(function(){
   $(".makechat").click(function(event){
        var name = prompt("Please name your new chat (and please keep it clean):");
	if (name!=null && name!="")
	{
	  window.location = "http://www.poetrytrain.com/chat/newroom?name=" + encodeURIComponent(name);
	}
   });

   $(".deleteb").click(function(event){
     delid = $(this).data('id');
     event.preventDefault();
     an = confirm("Are you sure you want to delete thie post?");
     if (an){
       $.ajax({
	url: '/sub/' + delid + "/delete",
	type: 'POST',
	headers: {
	  'X-CSRF-Token': $('meta[name=csrf-token]').attr('content')
	},
	success: function(resp){
          $('#post_' + delid).html(resp);
	  console.log(resp);

	}
       });
     }
  });

  $('.tagb').click(function(event){
    event.preventDefault();
    myid = $(this).data('id');
    mytype=$(this).data('type');
    a = prompt('Enter your new tags for "' + $(this).data('title') + '":',$(this).data('tags'));
    if(typeof a != "undefined" && typeof a != "object"){
	$.ajax({
	 url: '/tag/save',
	 type: 'POST',
	 headers: {
	   'X-CSRF-Token': $('meta[name=csrf-token]').attr('content')
	 },
	 data: {
	   id: myid,
	   type: mytype,
	   tags: a
	 },
	 success: function(resp){
	   if (mytype == "Sub"){
	     if (resp == "(none)"){
		 $("#post_" + myid + " .ptags").remove();
	     } else {
	       if ($("#post_" + myid + " .ptags").length != 0){
	         $("#post_" + myid + " .ptags").html(resp);
	       } else {
	         $("#post_" + myid).append("<div class='ptags'>" +  resp + "</div>");
	       }
	     }
	   } else if(mytype == "User"){
	      if (resp == "(none)"){
		$("#user_" + myid + "_tags").html("");
	      } else {
		$("#user_" + myid + "_tags").html(resp);
	      } 
           }
	 }
        });
        $(this).data('tags',a);
    
    }
  });
  $("form.commentform").submit(function(event){
    event.preventDefault();
    console.log("comment submitting...");
    myform = $(this);
    commentee_id = $(this).data("id");
    for (instance in CKEDITOR.instances){
      CKEDITOR.instances[instance].updateElement();
    }
    $.ajax({ 
	url: "/comment",
	type: 'POST',
	beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
	data: myform.serialize(),
	success: function(data){
	   myform.closest(".commentbox").children(".commentscontainer").replaceWith(data);
	   rebindDeleteAndReply();
   	}
    });
  });
  $("a.replyclearlink").click(function(event){
  event.preventDefault();
    $(this).attr("style","display:none;");
    cbox = $(this).closest(".commentbox");
    cbox.find("input[name='rid']").val("0");
    cbox.find(".replyingtotitle").html(cbox.find(".replyingtohiddentitle").html());
    
  });


 rebindDeleteAndReply();
});


function rebindDeleteAndReply(){
  $(".commentreplylink").click(function(event){ 
    event.preventDefault();
    console.log("changingreply");
    rid = $(this).data("id");
    rname = $(this).data("name");
    cbox = $(this).closest(".commentbox");
    cbox.find("input[name='rid']").val(rid);
    cbox.find("strong.replyingtotitle").html(rname);
    cbox.find(".replyclearlink").attr("style","");
  }); 
 
  $(".commentdeletelink").click(function(event){
    event.preventDefault();
    name = $(this).data("name");
    if(confirm("Are you sure you want to delete '" + name + "'?") == true){
	    thiscomment = $(this).closest(".comment");    
	    $.ajax({
	        url: "/comment/delete",
	        type: 'POST',
	        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
	        data:"id="+$(this).data("id"),
	        success: function(data){
		  if(data == "Comment deleted"){
		    thiscomment.replaceWith("");
                  }
	        }
   
	    });
     }
  });

}


