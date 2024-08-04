window.send_msg = function(sendKey) {
    V.chatList[T.npc].msgList.push({
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
        if (!V.chatList[event.npc]) {
            V.chatList[event.npc] = { name: event.npc, type: "NNPC", msgList: [], avaterKey: "椒盐实验体_0" };
            let sendtime = [Time.year, Time.mouth, Time.mouthDay, Time.hour, Time.minute];
            V.chatList[event.npc].msgList = [{ msg: "", sender: event.npc, sendTime: sendtime }];
        }
        V.chatList[event.npc].msgList.push({
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
                pool.push(value)
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
        if (!npcHasReply && window.PhoneModEvents.getNpcNowEventKey(e.npc) == "" && !npcAlreadySend.includes(e.npc)) {
            send_event(e);
            npcAlreadySend.push(e.npc);
            if (!e.hide_msg) {
                sWikifier("你有新消息！")
            }
        }
    }

}

window.wecatInit = function() {
    V.replyPool = [];
    class WecatChatListItem {
        constructor(name, type, avaterKey) {
            this.name = name;
            this.type = type;
            this.msgList = [];
            this.avaterKey = avaterKey;
        }
    }
    class WecatMsg {
        constructor(msg, sender, sendTime) {
            this.msg = msg;
            this.sender = sender;
            this.sendTime = sendTime;
        }
    }
    V.chatList = { "Bailey": new WecatChatListItem("Bailey", "NNPC", "椒盐实验体_0") };
    let sendtime = [Time.year, Time.mouth, Time.mouthDay, Time.hour, Time.minute];
    V.chatList["Bailey"].msgList = [new WecatMsg("Bailey_init", "Bailey", sendtime)];
}

window.wecat_main = function(sWikifier) {
    if (!V.replyPool) { window.wecatInit(); }
    window.check_time_reply(sWikifier);
    window.check_active_event(sWikifier);
}