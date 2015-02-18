$(document).ready(function(){
	scrollChatToBottom();
	setInterval(function(){updateChat()},1000);

	function scrollChatToBottom(){
		var elem=$(".chat_allmessages");
		if(elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight()){
		} else {
			elem.scrollTop(99999999);
			
		}
	}
	
	function updateChat(){
	  id = $(".chat_display").data("id");
	  scrollval = $(".chat_display")[0].scrollHeight;
	  $.get("/chat/" + id + "/refresh",function(data){
		$(".chat_display").replaceWith(data);
		$(".chat_display").scrollTop(scrollval);
		scrollChatToBottom();
		
	  })
	  console.log('refreshing chat');
	}

        $(".chat_form").submit(function(e){
		 e.preventDefault();
		 data = $(this).serialize();
		 $.ajax({
	            url: "/chat/" + $(this).data("id") + "/post",
	            type: 'POST',
	            beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
	            data:data,
	            success: function(data){
			$(this).children(".chat_display").replaceWith(data);
			$("input.messagebody").val("");
	            }
	
	         });

	});

});
