$(function () {
    "use strict";

    var you = {};
    you.avatar = "/images/person.png";
    
    var pnc = {};
    pnc.avatar = "/images/pnc.png";
    
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }            
    
    //-- No use time. It is a javaScript effect.
    function insertChat(who, text, time = 0){
        var control = "";
        var date = formatAMPM(new Date());
      
        if (who == "you"){
            control = '<li style="width:100%">' +
                            '<div class="msj macro">' +
                            '<div class="avatar"><img class="img-circle" style="width:100%;" src="'+ you.avatar +'" /></div>' +
                                '<div class="text text-l">' +
                                    '<p>'+ text +'</p>' +
                                    '<p><small>'+date+'</small></p>' +
                                '</div>' +
                            '</div>' +
                        '</li>';                    
        }else{
            control = '<li style="width:85%;">' +
                            '<div class="msj-rta macro">' +
                                '<div class="text text-r">' +
                                    '<p>'+text+'</p>' +
                                    '<p><small>'+date+'</small></p>' +
                                '</div>' +
                            '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="'+pnc.avatar+'" />' +
                            '<span></span></div>' +                                
                      '</li>';
        }
        setTimeout(
            function(){                        
                $("ul").append(control);
    
            }, time);
        
    }
    
    function resetChat(){
        $("ul").empty();
    }

    $(".mytext").on("keyup", function(e){
        if (e.which == 13){
            var text = $(this).val();
            if (text !== ""){
                insertChat("you", text);              
                $(this).val('');
                ws.send(text);
            }
        }
    });

    //-- Clear Chat
    resetChat();

    const ws = new WebSocket('ws://localhost:5000');
    ws.onopen = event => {
        ws.send("connected");
    };

    ws.onmessage = event => {
        insertChat("pnc", event.data);
        $('.mytext').focus();
    };
});