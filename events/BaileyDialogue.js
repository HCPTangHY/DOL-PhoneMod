const E = {
    System_npcRest: {
        id: "System_npcRest",
        npc: "Bailey",
        preMsg: null,
        condition: (() => {
            return false
        }),
        hide_msg: true,
        action: (() => {
            window.PhoneModEvents.changeNpcRestFlag('Bailey');
        }),
        childEvents: {}
    },
    Bailey_init: {
        id: "Bailey_init",
        npc: "Bailey",
        preMsg: null,
        condition: (() => {
            return !V.chatList
        }),
        hide_msg: false,
        action: (() => {}),
        childEvents: {}
    },
    Bailey_greeting: {
        id: "Bailey_greeting",
        npc: "Bailey",
        preMsg: "greetingMsg",
        condition: (() => { return Time.hour >= 7 && Time.hour <= 22 }),
        hide_msg: false,
        action: (() => {}),
        replies: {
            "Bailey_greeting.A": {
                condition: (() => { return true }),
                targetEventKey: "Bailey_greetingA",
                action: (() => {}),
            }
        }
    },
    Bailey_greetingA: {
        id: "Bailey_greetingA",
        npc: "Bailey",
        preMsg: "Bailey_greeting.A",
        condition: (() => { return true }),
        hide_msg: false,
        action: (() => {}),
        replies: {}
    },
    Bailey_rentlooking_init: {
        id: "Bailey_rentlooking_init",
        npc: "Bailey",
        preMsg: null,
        condition: (() => { return V.renttime <= 0 && !(V.location == 'alex_cottage' || V.location == 'home' || location == 'temple') && !V.daily.Bailey }),
        hide_msg: true,
        action: (() => { V.daily.Bailey = {}; }),
        replies: {}
    },
    Bailey_rentlooking: {
        id: "Bailey_rentlooking",
        npc: "Bailey",
        parentEvent: null,
        preMsg: null,
        condition: (() => { return V.renttime <= 0 && !(V.location == 'alex_cottage' || V.location == 'home' || location == 'temple') && V.daily.Bailey && !V.daily.Bailey.rentLooking }),
        hide_msg: true,
        action: (() => { V.daily.Bailey.rentLooking = true; }),
        replies: {
            "Bailey_rentlooking.A": {
                targetEventKey: "Bailey_greetingA",
                condition: (() => { return true }),
                action: (() => {}),
            }
        }
    }
}

window.PhoneModEvents.readEvents(E)