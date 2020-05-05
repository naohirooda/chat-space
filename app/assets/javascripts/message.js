$(function() { 
  function buildHTML(message){
   if ( message.image ) {
     var html =
      `<div class="content" data-message-id=${message.id}>
         <div class="upper-content">
           <div class="upper-content__user-name">
             ${message.user_name}
           </div>
           <div class="upper-content__date">
             ${message.created_at}
           </div>
         </div>
         <div class="lower-content">
           <p class="lower-content__content">
             ${message.content}
           </p>
         </div>
         <img src=${message.image} >
       </div>`
     return html;
   } else {
     var html =
      `<div class="content" data-message-id=${message.id}>
         <div class="upper-content">
           <div class="upper-content__user-name">
             ${message.user_name}
           </div>
           <div class="upper-content__date">
             ${message.created_at}
           </div>
         </div>
         <div class="lower-content">
           <p class="lower-content__content">
             ${message.content}
           </p>
         </div>
       </div>`
     return html;
       };
  }

  var reloadMessages = function() {
    var last_message_id = $('.content:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
      var insertHTML = '';
      $.each(messages, function(i, message) {
        insertHTML += buildHTML(message)
      });
      $('.chat-contents').append(insertHTML);
      $('.chat-contents').animate({ scrollTop: $('.chat-contents')[0].scrollHeight});
    }
    })
    .fail(function() {
      alert('メッセージ送信に失敗しました');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
  setInterval(reloadMessages, 7000);
  }

$('#new_message').on('submit', function(e){
  e.preventDefault();
  var formData = new FormData(this);
  var url = $(this).attr('action')
  $.ajax({
    url: url,
    type: "POST",
    data: formData,
    dataType: 'json',
    processData: false,
    contentType: false
  })
   .done(function(data){
     var html = buildHTML(data);
     $('.chat-contents').append(html);
     $('.chat-contents').animate({ scrollTop: $('.chat-contents')[0].scrollHeight});
     $('.new_message')[0].reset();
   })
   .fail(function() {
     alert('メッセージを入力してください');
   })
   .always(function(){
     $('.form__submit').prop('disabled',false);
   });
   });
  });