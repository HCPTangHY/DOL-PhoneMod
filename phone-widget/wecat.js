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
    let passPool = [];
    window.PhoneModEvents.events.get(npc).npcEvents.forEach((value, key) => {
        if (value.condition() && sendMsg == value.preMsg) {
            passPool.push(value);
        }
    });
    if (passPool.length == 0) { return }
    let event = passPool[Math.round(Math.random() * (passPool.length - 1))];
    let replyTime = window.CharacterSchedule[npc].getResponseMinute();
    replyTime += Time.hour * 60 + Time.minute;
    if (replyTime >= 1440) { replyTime = 1440 - replyTime; }
    V.replyPool.push({ event: event, replyTime: replyTime });
    V.replyPool = V.replyPool.sort((a, b) => a.replyTime - b.replyTime);
    console.log("reply push " + event.id)
}

window.check_time_reply = function(sWikifier) {
    console.log(sWikifier);
    if (!V.replyPool) { return }
    for (let i = 0; i < V.replyPool.length; i++) {
        let e = V.replyPool[i];
        if (Time.hour * 60 + Time.minute >= e.replyTime) {
            send_event(e.event);
            if (!e.event.hide_msg) {
                sWikifier("你有新消息！<br>");
            }
            console.log(i);
            V.replyPool.pop(i);
            let npcPool = window.PhoneModEvents.getNpcAllEvents(e.event.npc);
            window.PhoneModEvents.changeNpcNowEventKey(e.event.npc, e.event.id);
            if (npcPool.get(window.PhoneModEvents.getNpcNowEventKey(e.event.npc)).childEvents.size == 0 && e.event.id != "System_npcRest") {
                window.PhoneModEvents.changeNpcRestFlag(e.event.npc);
                window.PhoneModEvents.events.get(e.event.npc).npcRestFlag = true;
                let replyTime = Time.hour * 60 + Time.minute + 10;
                if (replyTime >= 1440) { replyTime = 1440 - replyTime; }
                V.replyPool.push({ event: npcPool.get("System_npcRest"), replyTime: replyTime });
                console.log("reply push System_npcRest");
            }
        }
    }

}

function send_event(event) {
    event.action();
    console.log("calling event: " + event.id);
    if (!event.hide_msg) {
        V.chatList[event.npc].push({
            sender: event.npc,
            msg: event.id,
            sendTime: [Time.year, Time.mouth, Time.mouthDay, Time.hour, Time.minute]
        });
        $(".wecatchat-content").append("<div class='wecatchat-msg-right'><div class='wecatchat-msg-content'>" + L(event.msg) + "</div></div>");
    }
}

window.check_active_event = function(sWikifier) {
    let pool = [];
    window.PhoneModEvents.events.forEach((value, key) => {
        value.npcActiveEventList.forEach((value, key) => {
            if (value.condition()) {
                pool.push(e)
            }
        })
    })
    let npcAlreadySend = []
    for (let e of pool) {
        let npcHasReply = false;
        V.replyPool.map(function(i, index, arr) {
            if (i.event.npc == e.npc) {
                npcHasReply = true;
            }
        })
        if (!npcHasReply && nowEventKey != "" && !npcAlreadySend.includes(e.npc)) {
            send_event(e);
            npcAlreadySend.push(e.npc);
            if (!e.hide_msg) {
                sWikifier("你有新消息！")
            }
        }
    }

}


window.wecat_main = function(sWikifier) {
    window.check_time_reply(sWikifier);
    window.check_active_event(sWikifier);
}