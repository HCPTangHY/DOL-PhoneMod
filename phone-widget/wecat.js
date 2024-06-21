window.send_msg = function(sendKey) {
    V.chatList[T.npc].push({
        sender: "Me",
        msg: sendKey,
        sendTime: [Time.year, Time.mouth, Time.mouthDay, Time.hour, Time.minute]
    });
    $(".wecatchat-content").append("<div class='wecatchat-msg-right'><div class='wecatchat-msg-content'>" + L(sendKey) + "</div></div>");
    get_reply(T.npc, sendKey);
}

window.get_reply = function(npc, sendMsg) {
    let pool = window.PhoneEvents[npc];
    let passPool = [];
    for (let id of pool) {
        if (require_check(window.PhoneEventPool[id].condition) && sendMsg == window.PhoneEventPool[id].preMsg) {
            passPool.push(window.PhoneEventPool[id]);
        }
    }
    if (passPool.length == 0) { return }
    let event = passPool[Math.round(Math.random() * (passPool.length - 1))];
    let replyTime = window.CharacterSchedule[npc].get_respones_minute();
    replyTime += Time.hour * 60 + Time.minute;
    if (replyTime >= 1440) { replyTime = 1440 - replyTime; }
    V.replyPool.push({ event: event, replyTime: replyTime });
    V.replyPool = V.replyPool.sort((a, b) => a.replyTime - b.replyTime);
}

window.check_time_reply = function(sWikifier) {
    console.log(sWikifier);
    if (!V.replyPool) { return }
    for (let e of V.replyPool) {
        if (Time.hour * 60 + Time.minute >= e.replyTime) {
            send_event(e.event);
            V.replyPool.pop(V.replyPool.indexOf(e))
            if (!e.event.hide_msg) {
                sWikifier("你有新消息！<br>")
            }
        }
    }

}

function send_event(event) {
    eval(event.script);
    console.log("calling event: " + event.id);
    if (event.hide_msg != "yes") {
        V.chatList[event.npc].push({
            sender: event.npc,
            msg: event.id,
            sendTime: [Time.year, Time.mouth, Time.mouthDay, Time.hour, Time.minute]
        });
        $(".wecatchat-content").append("<div class='wecatchat-msg-right'><div class='wecatchat-msg-content'>" + L(event.msg) + "</div></div>");
    }
}

window.check_active_event = function(sWikifier) {
    let pool = []
    for (let e in window.PhoneEventPool) {
        e = window.PhoneEventPool[e];
        if (e.preMsg == "" && require_check(e.condition)) {
            pool.push(e)
        }
    }
    let npcAlreadySend = []
    for (let e of pool) {
        let npcHasReply = false;
        V.replyPool.map(function(i, index, arr) {
            if (i.event.npc == e.npc) {
                npcHasReply = true;
            }
        })
        if (!npcHasReply && window.PhoneEventPool[V.chatList[e.npc][V.chatList[e.npc].length - 1].msg].replies == {} && !npcAlreadySend.includes(e.npc)) {
            send_event(e);
            npcAlreadySend.push(e.npc);
            if (!e.hide_msg) {
                sWikifier("你有新消息！")
            }
        }
    }

}

function require_check(condition) {
    return eval(condition);
}

window.wecat_main = function(sWikifier) {
        window.check_time_reply(sWikifier);
        window.check_active_event(sWikifier);
    }
    // let event = {
    //     id,
    //     preMsg,
    //     parentNode,
    //     options
    // }