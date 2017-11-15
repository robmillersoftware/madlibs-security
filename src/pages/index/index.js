/**
 * This is a quick, sloppy websocket chat client
 */
//Open a new websocket to the backend
const ws = new WebSocket(connectionString);

const pingWs = () => {
    ws.send('ping');
}

$(function () {
    "use strict";

    //These are the calls to get the avatar assets from the RESTful backend
    var you = { avatar: '/images/person.png' };
    var pnc = { avatar: '/images/pnc.png' };
    
    //Utility function that converts a date object to the format we desire
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
    
    /**
     * Creates a new chat bubble
     * @param {*} who- Which party sent this message 
     * @param {*} text- A text string representing what was said
     */
    function insertChat(who, text, time = 0){
        //The DOM object
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
            }, 100);
        
    }
    
    function resetChat(){
        $("ul").empty();
    }

    //When the user presses the enter key, create a new chat bubble and send the message to the backend
    $(".mytext").on("keyup", function(e){
        if (e.which == 13){
            var text = $(this).val();
            if (text !== ""){
                insertChat("you", text);              
                $(this).val('');

                let msg = {
                    string: text,
                    id: localStorage.userId
                };

                ws.send(JSON.stringify(msg));
            }
        }
    });

    //-- Clear Chat
    resetChat();

    //Open a new websocket to the backend
    const ws = new WebSocket(connectionString);
    ws.onopen = event => {
        let msg = {
            string: "connected",
            id: localStorage.userId
        };
        ws.send(JSON.stringify(msg));
    };

    ws.onmessage = event => {
        let message = JSON.parse(event.data);

        //Keep a UUID in local storage for now. This will eventually be a JWT most likely
        if (!localStorage.userId) {
            localStorage.setItem("userId", message.uuid);
        }
        insertChat(message.party, message.msg);
        $('.mytext').focus();
    };

    setTimeout(pingWs, 10000);
});