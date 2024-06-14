window.send_msg = function(sendKey) {
    V.chatList[T.npc].push({
        sender: "Me",
        msg: sendKey,
        sendTime: [Time.mouth, Time.mouthDay].join(".") + [Time.hour, Time.minute].join(":")
    });
    $("#wecatchat_content").append("Me：" + L[sendKey] + "<br>");
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

window.check_time_reply = function() {
    if (!V.replyPool) { return }
    for (let e of V.replyPool) {
        if (Time.hour * 60 + Time.minute >= e.replyTime) {
            reply(e.event, e.replyTime);
            V.replyPool.pop(V.replyPool.indexOf(e))
        }
    }

}

function reply(event, replyTime) {
    V.chatList[event.npc].push({
        sender: event.npc,
        msg: event.id,
        sendTime: [Time.mouth, Time.mouthDay].join(".") + [replyTime[0], replyTime[1]].join(":")
    });
    $("#wecatchat_content").append(event.npc + "：" + L[event.id] + "<br>");
}

function require_check(requirement) {
    if (requirement == "") { return true }
    return eval(requirement);
}

class PhoneModEvent {
    id;
    npc;
    preMsg;
    requirement;
    replies;
    constructor(args) {
        let i = 0;
        for (let key of Object.keys(this)) {
            this[key] = args[i];
            i++;
        }
    }
    static read_event(data) {
        let events = {}
        if (!window.PhoneEvents) { Object.defineProperty(window, "PhoneEvents", { value: {} }) };
        for (let i = 0; i < data.length; i++) {
            if (data[i] == '') { continue; }
            events[data[i][0]] = new PhoneModEvent(data[i]);
            if (!window.PhoneEvents[events[data[i][0]].npc]) {
                Object.defineProperty(window.PhoneEvents, events[data[i][0]].npc, { value: [events[data[i][0]].id] });
            } else {
                window.PhoneEvents[events[data[i][0]].npc].push(events[data[i][0]].id);
            }
        }
        return events
    }
}
Object.defineProperty(window, "PhoneEventPool", { value: PhoneModEvent.read_event(window.PMEvents) });