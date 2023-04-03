(function(){
  if(document.querySelector('.chat-page')){
  
    var socket = new WebSocket("ws://192.168.1.100:8060");
    var socketOpen = (e) => {
        console.log("connected to the socket");
        var msg = {
            type: 'join',
            sender: 'Browser',
            listener:"allMembers",
            text: 'connected to the chat server'
        }
        appendMessage(JSON.stringify(msg));        
    }

    var socketMessage = (e) => {
        console.log(`Message from socket: ${e.data}`);
        appendMessage(e.data);
    }

    var socketClose = (e) => {
        var msg;
        if(e.wasClean) {
            console.log("The connection closed cleanly");
            msg = {
                type: 'left',
                sender: 'Browser',
                text: 'The connection closed cleanly'
            }
        }
        else {
            console.log("The connection closed for some reason");
            var msg = {
                type: 'left',
                sender: 'Browser',
                text: 'The connection closed for some reason'
            }
        }
        appendMessage(JSON.stringify(msg));
    }
    
    var socketError = (e) => {
        console.log("WebSocket Error");
        console.log(e);
    }

    socket.addEventListener("open", socketOpen);
    socket.addEventListener("message", socketMessage);
    socket.addEventListener("close", socketClose);
    socket.addEventListener("error", socketError);

    function getMembers(){
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=c6lr6v8osc8go4gg03kkeiqna1g5febm");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(window.location.origin + "/chat/api/authentication/user", requestOptions)
        .then(response => response.json())
        .then(result => {            
            if(result.status){
                result.data.forEach(row => {
                    if(row.id != localStorage.my_id){
                        jQuery('.member-list .list-wraper').append('<div class="msg msg-member mb-4" data-userId="'+row.id+'"><span class="newmsg-receive" data-newmsg="0"></span>'+row.first_name+' '+row.last_name+'</div>');
                        preMsgLoad(row.id,localStorage.my_id);
                    }else{
                        localStorage.my_name = row.first_name+' '+row.last_name;
                        jQuery('.member-list .list-wraper').append('<div class="msg msg-member hidden" data-userId="'+row.id+'"><span class="newmsg-receive" data-newmsg="0"></span>'+row.first_name+' '+row.last_name+'</div>');                        
                    }
                });
                setup();
            }else{
                jQuery('.member-list .list-wraper').html(result.message)
            }            
        })
        .catch(error => console.log('error', error));
    }

    function preMsgLoad(receiver,sender){
        var settings = {
            "url": window.location.origin + "/chat/api/livechat/getmsg/" + receiver+"/"+sender,
            "method": "GET",
            "timeout": 0,
            "headers": {},
        };
        jQuery('.messages-box').append('<div class="msg-chanel" data-userId="'+receiver+'"></div>');
        var chat_chanel = jQuery('.msg-chanel[data-userId="'+receiver+'"]');          
        $.ajax(settings).done(function (result) {
          if(result.status){   
              if(result.data){
                  var unread = unread_mine = false;
                  var unread_checked = unread_checked_mine = true;
                  var unread_num = 0;
                  result.data.forEach((row, index)=> {  
                    var msg_class = "";
                    var sender_name = jQuery('.msg-member[data-userid="'+row.sender_id+'"]').text();
                    if(row.sender_id == sender) msg_class = 'msg-mine';                    
                    if(row.created_at != row.updated_at) msg_class += ' edited';  
                    if(index == 0 && row.sender_id != sender){
                       chat_chanel.prepend(`<div class="msg msg-one reader px-3 text-end"><span></span></div>`);
                    }else{
                        if(row.message_status==1 && row.sender_id == sender){
                            unread_mine = true;                            
                        }
                        if((row.message_status==2 || row.sender_id != sender)&& unread_mine && unread_checked_mine){
                            unread_mine = false;
                            unread_checked_mine = false;
                            chat_chanel.prepend(`<div class="msg msg-one reader px-3 text-end"><span></span></div>`);
                        }         
                    }
                    if(row.message_status==1 && row.sender_id != sender){
                        unread = true;
                        unread_num++;
                    }
                    if((row.message_status==2 || row.sender_id == sender)&& unread && unread_checked){
                        unread = false;
                        unread_checked = false;
                        chat_chanel.prepend(`<div class="msg msg-one unread-arert px-3">Unread messages</div>`);
                    }            
                    chat_chanel.prepend(`<div class="msg msg-one `+msg_class+'" data-msgId="'+row.id+`" data-status="`+row.message_status+`">
                       <span class="msg-send-info"><span class="msg-sender">` + sender_name + ' :</span>' + row.created_at + `</span>
                       <span class="msg-text">` + row.message + '</span></div>');                    
                  }); 
                  if(unread_num>0){
                    jQuery('.msg-member[data-userid="'+receiver+'"]').addClass('new-msg-received');
                    jQuery('.msg-member[data-userid="'+receiver+'"] .newmsg-receive').data('newmsg',unread_num);
                    jQuery('.msg-member[data-userid="'+receiver+'"] .newmsg-receive').text(unread_num);
                  }   
              }     
          }else{
              chat_chanel.html(result.message);
          }
        });
    }

    function updateMsg(id,status=0,msg=''){
        if(status){
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append("Cookie", "ci_session=15gp4vifdvvfr5kt8uaqiomg5no7drcd");
            
            var urlencoded = new URLSearchParams();
            urlencoded.append("id", id);
            urlencoded.append("message_status", status);
            
            var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
            };
            
            fetch(window.location.origin + "/chat/api/livechat/getmsg", requestOptions)
            .then(response => response.json())
            .then(result => {
                if(result.status){
                    jQuery('.msg[data-msgid="'+id+'"]').attr('data-status',status);
                }else{
                    console.log(result.message)
                }
            })
            .catch(error => console.log('error', error));    

        }else if(msg){

        }else{
            return false;
        } 
    }

    getMembers();
    
    function sendMessage(message) {
        socket.send(message);
    }

    function parseMessage(message) {
        var msg = {type: "", sender: "", text: ""};
        try {
            msg = JSON.parse(message);
        }
        catch(e) {
            return false;
        }
        return msg;
    }
    document.addEventListener('click',function(e){
        const target = e.target;
        if(target.classList.contains("msg-member")){
           if(!target.classList.contains('selected')){
               var user_id = target.getAttribute('data-userid');
               document.querySelector('.member-list .msg-member.selected')?.classList.remove('selected');
               document.querySelector('.msg-chanel.selected')?.classList.remove('selected');
               document.querySelector('.msg-chanel[data-userid="'+user_id+'"]')?.classList.add('selected');
               target.classList.add('selected');
               if(target.classList.contains('new-msg-received')){
                   target.classList.remove('new-msg-received');
                   target.querySelector('.newmsg-receive').setAttribute('data-newmsg','0');
                   jQuery('.msg-chanel.selected .reader').remove();
                   jQuery('.msg-chanel.selected').append(`<div class="msg msg-one reader tx px-3 text-end"><span></span></div>`);
               }
               
               document.querySelector('form.msg-form.hidden')?.classList.remove('hidden');
               jQuery('#receiver_id').val(user_id);
                
               document.querySelector('.msg-chanel.selected')?.scrollTo(0, document.querySelector('.msg-chanel.selected').scrollHeight); 
               jQuery('.msg-chanel.selected .unread-arert').css('opacity','0');

               document.querySelectorAll('.msg-chanel.selected .msg-one:not(.msg-mine)[data-status="1"]').forEach((item)=>{
                   let id = item.getAttribute('data-msgid');
                   updateMsg(id,2,'');
               });                
               var readMsg = {
                   type: "read",
                   sender: localStorage.my_id,
                   listener:document.querySelector('.msg-chanel.selected').getAttribute('data-userid'),
                   text: localStorage.my_name + ' read message!'
               };                
               sendMessage(JSON.stringify(readMsg));          

               setTimeout(function(){                    
                    jQuery('.msg-chanel.selected .unread-arert').remove();
               },3000)                    
           }              
        }else{
            return;
        }
    })
    document.querySelector('#msg').addEventListener('focus',function(){        
        // document.querySelectorAll('.msg-chanel.selected .msg-one:not(.msg-mine)[data-status="1"]').forEach((item)=>{
        //     let id = item.getAttribute('data-msgid');
        //     updateMsg(id,2,'');
        // });
        // var readMsg = {
        //     type: "read",
        //     sender: localStorage.my_id,
        //     listener:document.querySelector('.msg-chanel.selected').getAttribute('data-userid'),
        //     text: localStorage.my_name + ' read message!'
        // };                
        // sendMessage(JSON.stringify(readMsg)); 
    })
    function appendMessage(message) {
        
        var parsedMsg;        
        var memberContainer = document.querySelector(".member-list .list-wraper");
        var groupContainer = document.querySelector(".group-list .list-wraper");
        if (parsedMsg = parseMessage(message)) {
            console.log('appending message');
            console.log(parsedMsg);
            // if(parsedMsg.listener == "allMembers"){                
            // }
            var msgElem, senderElem, textElem;
            var sender, text;            

            msgElem = document.createElement("div");
            msgElem.classList.add('msg');
            msgElem.classList.add('msg-' + parsedMsg.type);
            if(parsedMsg.msg_id) msgElem.setAttribute('data-msgid',parsedMsg.msg_id);
            if(parsedMsg.sender == localStorage.my_id) msgElem.classList.add('msg-mine');

            senderWraperElem = document.createElement("span");
            senderWraperElem.classList.add("msg-send-info");

            senderElem = document.createElement("span");
            senderElem.classList.add("msg-sender");

            textElem = document.createElement("span");
            textElem.classList.add("msg-text");

            parsedMsg.sender_name ? sender = document.createTextNode(parsedMsg.sender_name + ' : ') : sender = document.createTextNode(parsedMsg.sender + ' : ') ;
            text = document.createTextNode(parsedMsg.text);

            console.log(sender);
            
            senderElem.appendChild(sender);
            textElem.appendChild(text);

            senderWraperElem.appendChild(senderElem);
            msgElem.appendChild(senderWraperElem);
            msgElem.appendChild(textElem);
            //debugger;
            if(parsedMsg.type == "join" && parsedMsg.sender != "Browser" && parsedMsg.sender != "Server" && parsedMsg.sender != localStorage.my_id){
                if(memberContainer.querySelector('.msg-member[data-userId="'+parsedMsg.sender+'"]')){
                    memberContainer.querySelector('.msg-member[data-userId="'+parsedMsg.sender+'"]').classList.add("online");
                }else{
                    jQuery('.member-list .list-wraper').append('<div class="msg msg-member online mb-4" data-userId="'+parsedMsg.sender+'"><span class="newmsg-receive" data-newmsg="0"></span>'+parsedMsg.sender_name+'</div>');   
                    jQuery('.messages-box').append('<div class="msg-chanel" data-userId="'+parsedMsg.sender+'"></div>');                     
                }
                if(parsedMsg.listener == "allMembers"){
                    var joinMsg = {
                        type: "join",
                        sender: localStorage.my_id,
                        listener:parsedMsg.sender,
                        text: localStorage.my_name + ' joined the chat!'
                    };                
                    sendMessage(JSON.stringify(joinMsg)); 
                }  
                            
            }else if(parsedMsg.type == "left"){
                memberContainer.querySelector('.msg-member[data-userId="'+parsedMsg.sender+'"]')?.classList.remove("online");                             
            }
            else if(parsedMsg.type == "read"){
                jQuery(".chat-box .msg-chanel[data-userid='"+parsedMsg.sender+"'] .reader").remove();
                jQuery(".chat-box .msg-chanel[data-userid='"+parsedMsg.sender+"']").append(`<div class="msg msg-one reader tx px-3 text-end"><span></span></div>`); 
                document.querySelector('.msg-chanel.selected')?.scrollTo(0, document.querySelector('.msg-chanel.selected').scrollHeight);                            
            }
            if(parsedMsg.type != "read" && parsedMsg.type != "left" && parsedMsg.type != "join" && parsedMsg.sender != "Browser" && parsedMsg.sender != "Server"){
                if(parsedMsg.chanel_id && parsedMsg.chanel_id == localStorage.my_id){
                    var msgContainer = document.querySelector(".chat-box .msg-chanel[data-userid='"+parsedMsg.sender+"']");
                    msgElem.setAttribute('data-status','1');
                    if(msgContainer.classList.contains('selected')){                        
                        updateMsg(parsedMsg.msg_id,2,''); 
                        var readMsg = {
                            type: "read",
                            sender: localStorage.my_id,
                            listener:parsedMsg.sender,
                            text: localStorage.my_name + ' read message!'
                        } 
                        sendMessage(JSON.stringify(readMsg)); 
                        msgContainer.appendChild(msgElem);
                        jQuery('.msg-chanel.selected .reader').remove();
                        jQuery('.msg-chanel.selected').append(`<div class="msg msg-one reader tx px-3 text-end"><span></span></div>`); 
                    }else{
                        document.querySelector('.msg-member[data-userid="'+parsedMsg.sender+'"]').classList.add('new-msg-received');
                        if(document.querySelector('.msg-member[data-userid="'+parsedMsg.sender+'"] .newmsg-receive').getAttribute('data-newmsg') * 1 == 0){
                            jQuery(".chat-box .msg-chanel[data-userid='"+parsedMsg.sender+"']").append(`<div class="msg msg-one unread-arert px-3">Unread messages</div>`);
                        }
                        let arrived = document.querySelector('.msg-member[data-userid="'+parsedMsg.sender+'"] .newmsg-receive').getAttribute('data-newmsg') * 1 + 1;
                        document.querySelector('.msg-member[data-userid="'+parsedMsg.sender+'"] .newmsg-receive').setAttribute('data-newmsg',arrived);
                        document.querySelector('.msg-member[data-userid="'+parsedMsg.sender+'"] .newmsg-receive').innerText = arrived;
                        msgContainer.appendChild(msgElem);                    
                    }
                    document.querySelector('.msg-chanel.selected')?.scrollTo(0, document.querySelector('.msg-chanel.selected').scrollHeight);              
                }else if(parsedMsg.chanel_id && parsedMsg.chanel_id != localStorage.my_id){
                    var msgContainer = document.querySelector(".chat-box .msg-chanel[data-userid='"+parsedMsg.chanel_id+"']"); 
                    msgElem.setAttribute('data-status','2');
                    msgContainer.appendChild(msgElem);
                    document.querySelector('.msg-chanel.selected')?.scrollTo(0, document.querySelector('.msg-chanel.selected').scrollHeight);
                }
            }
            // if(parsedMsg.type == "refuse"){
            //     document.querySelector('form.join-form').classList.remove('hidden');
            //     document.querySelector('form.msg-form').classList.add('hidden');
            //     document.querySelector('form.close-form').classList.add('hidden');                            
            // }
            
        }
    }

    function setup() {
        var sender = sender_name = '';        
        var msgForm = document.querySelector('form.msg-form');
        // var closeForm = document.querySelector('form.close-form');
    
        function joinChart() {
            sender = localStorage.my_id;
            sender_name = localStorage.my_name;
            var joinMsg = {
                type: "join",
                sender: sender,
                sender_name: sender_name,
                listener:"allMembers",
                text: sender + ' joined the chat!'
            };                       
            sendMessage(JSON.stringify(joinMsg));            
        }
        joinChart(); 

        function msgFormSubmit(event) {
            event.preventDefault();
            var msgField, msgText, msg;
            var listener = document.getElementById('receiver_id').value;
            msgField = document.getElementById('msg');
            msgText = msgField.value;
            chat_type = document.getElementById('chatType').value;
            if(chat_type == "one"){
                var myHeaders = new Headers();
                myHeaders.append("Cookie", "ci_session=t8o81v2rtps88gnfii9b190vce77opd6");

                var formdata = new FormData();
                formdata.append("msg", msgText);
                formdata.append("receiver_id", listener);
                formdata.append("sender_id", localStorage.my_id);

                var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
                };

                fetch(window.location.origin + "/chat/api/livechat/savemsg", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if(result.status){
                        var today = new Date();
                        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        var dateTime = date+' '+time;
                        msg = {
                            msg_id: result.data,
                            chanel_id: listener,
                            type: chat_type,
                            sender: localStorage.my_id,
                            sender_name: localStorage.my_name,
                            date:dateTime,
                            listener: listener + ',' + localStorage.my_id,
                            text: msgText
                        };
                        msg = JSON.stringify(msg);
                        sendMessage(msg);
                        msgField.value = '';
                    }else{
                        jQuery('.msg-chanel.selected').append('<div class="alert alert-danger txt-right">'+result.message+'</div>');
                    }

                })
                .catch(error => console.log('error', error));

                // if(document.querySelectorAll(".msg-member.selected").length == 0){
                //     listener = "allMembers";
                // }else{
                //     document.querySelectorAll(".msg-member.selected").forEach((item)=>{                    
                //         listener +="," + item.getAttribute('data-userId');
                //     })
                // }
            }
            
        }
    
        msgForm.addEventListener('submit', msgFormSubmit);

        // function closeFormSubmit(event) {
        //     event.preventDefault();
        //     socket.close();           
        // }

        // closeForm.addEventListener('submit', closeFormSubmit);
    }    
  }
})();