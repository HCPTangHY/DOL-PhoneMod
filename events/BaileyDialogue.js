const PhoneModEvent = {
    Bailey_init: {
        id: "Bailey_init",
        npc: "Bailey",
        parentEvent: null,
        preMsg: null,
        condition: "!V.chatList",
        hide_msg: false,
        script: "",
        replies: []
    },
    Bailey_greeting: {
        id: "Bailey_greeting",
        npc: "Bailey",
        parentEvent: null,
        preMsg: "greetingMsg",
        condition: "Time.hour>=7&&Time.hour<=22",
        hide_msg: false,
        script: "",
        replies: {
            "Bailey_greeting.A": {
                condition: true,
                target: "Bailey_greetingA"
            }
        }
    },
    Bailey_greetingA: {
        id: "Bailey_greetingA",
        npc: "Bailey",
        parentEvent: "Bailey_greeting",
        preMsg: "Bailey_greeting.A",
        condition: true,
        hide_msg: false,
        script: "",
        replies: {}
    },
    Bailey_rentlooking_init: {
        id: "Bailey_rentlooking_init",
        npc: "Bailey",
        parentEvent: null,
        preMsg: null,
        condition: "V.renttime<=0&&!(V.location=='alex_cottage'||V.location=='home'||location=='temple')&&!V.daily.Bailey",
        hide_msg: true,
        script: "V.daily.Bailey = {};",
        replies: {}
    },
    Bailey_rentlooking: {
        id: "Bailey_rentlooking",
        npc: "Bailey",
        parentEvent: null,
        preMsg: null,
        condition: "V.renttime<=0&&!(V.location=='alex_cottage'||V.location=='home'||location=='temple')&&V.daily.Bailey&&!V.daily.Bailey.rentLooking",
        hide_msg: true,
        script: "V.daily.Bailey.rentLooking=true;",
        replies: {
            "Bailey_rentlooking.A": {
                target: null,
                condition: true
            }
        }
    }
}

if (!window.PhoneEventPool) { Object.defineProperty(window, "PhoneEventPool", { value: {} }) };
if (!window.PhoneEvents) { Object.defineProperty(window, "PhoneEvents", { value: {} }) };
for (let e in PhoneModEvent) {
    if (!window.PhoneEvents[PhoneModEvent[e].npc]) {
        Object.defineProperty(window.PhoneEvents, PhoneModEvent[e].npc, { value: [e] });
    } else {
        window.PhoneEvents[PhoneModEvent[e].npc].push(e);
    }
    Object.assign(window.PhoneEventPool, PhoneModEvent)
}