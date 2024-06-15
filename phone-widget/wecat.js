window.send_msg = function(sendKey) {
    V.chatList[T.npc].push({
        sender: "Me",
        msg: sendKey,
        sendTime: [Time.mouth, Time.mouthDay].join(".") + [Time.hour, Time.minute].join(":")
    });
    $(".wecatchat-content").append("<div class='wecatchat-msg-right'><div class='wecatchat-msg-content'>" + L[sendKey] + "</div></div>");
    get_reply(T.npc, sendKey);
}

window.get_reply = function(npc, sendMsg) {
    let pool = window.PhoneEvents[npc];
    let passPool = [];
    for (let id of pool) {
        if (require_check(window.PhoneEventPool[id].requirement) && sendMsg == window.PhoneEventPool[id].preMsg) {
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
            if (e.event.hide_msg != "yes") {
                sWikifier("你有新消息！")
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
            sendTime: [Time.mouth, Time.mouthDay].join(".") + [Time.hour, Time.minute].join(":")
        });
        $(".wecatchat-content").append("<div class='wecatchat-msg-right'><div class='wecatchat-msg-content'>" + L[event.msg] + "</div></div>");
    }
}

window.check_active_event = function(sWikifier) {
    let pool = []
    for (let e in window.PhoneEventPool) {
        e = window.PhoneEventPool[e];
        if (e.preMsg == "" && require_check(e.requirement)) {
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
        if (!npcHasReply && window.PhoneEventPool[V.chatList[e.npc][V.chatList[e.npc].length - 1].msg].replies == "" && !npcAlreadySend.includes(e.npc)) {
            send_event(e);
            npcAlreadySend.push(e.npc);
            if (e.hide_msg != "yes") {
                sWikifier("你有新消息！")
            }
        }
    }

}

function require_check(requirement) {
    if (requirement == "") { return true }
    return eval(requirement);
}

window.wecat_main = function(sWikifier) {
    window.check_time_reply(sWikifier);
    window.check_active_event(sWikifier);
}

let events = {}
if (!window.PhoneEvents) { Object.defineProperty(window, "PhoneEvents", { value: {} }) };
for (let e of window.PMEvents) {
    events[e.id] = e;
    if (!window.PhoneEvents[e.npc]) {
        Object.defineProperty(window.PhoneEvents, e.npc, { value: [e.id] });
    } else {
        window.PhoneEvents[e.npc].push(e.id);
    }
}
window.PhoneEventPool = events;
// class PhoneModEvent {
//     id;
//     npc;
//     preMsg;
//     requirement;
//     script;
//     replies;
//     constructor(args) {
//         let i = 0;
//         for (let key of Object.keys(this)) {
//             this[key] = args[i];
//             i++;
//         }
//     }
//     static read_event(data) {
//         let events = {}
//         if (!window.PhoneEvents) { Object.defineProperty(window, "PhoneEvents", { value: {} }) };
//         for (let i = 0; i < data.length; i++) {
//             if (data[i] == '') { continue; }
//             events[data[i][0]] = new PhoneModEvent(data[i]);
//             if (!window.PhoneEvents[events[data[i][0]].npc]) {
//                 Object.defineProperty(window.PhoneEvents, events[data[i][0]].npc, { value: [events[data[i][0]].id] });
//             } else {
//                 window.PhoneEvents[events[data[i][0]].npc].push(events[data[i][0]].id);
//             }
//         }
//         return events
//     }
// }
// Object.defineProperty(window, "PhoneEventPool", { value: PhoneModEvent.read_event(window.PMEvents) });