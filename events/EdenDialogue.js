var E = {
    System_npcRest: {
        id: "System_npcRest",
        npc: "Eden",
        preMsg: null,
        condition: (() => {
            return false
        }),
        hide_msg: true,
        action: (() => {
            window.PhoneModEvents.changeNpcRestFlag('Eden');
        }),
        childEvents: {}
    },
    Eden_longTimeNoReturn: {
        id: "Eden_longTimeNoReturn",
        npc: "Eden",
        preMsg: null,
        condition: (() => {
            return C.npc.Eden.love >= 95 && C.npc.Eden.dom > 50 && V.edendays >= 7 && Time.hour >= 7 && Time.hour <= 22
        }),
        hide_msg: false,
        action: (() => {}),
        replies: {
            "Eden_longTimeNoReturn.A": {
                condition: (() => { return true }),
                targetEventKey: "Eden_longTimeNoReturnA",
                action: (() => {}),
            },
            "Eden_longTimeNoReturn.B": {
                condition: (() => { return true }),
                targetEventKey: "Eden_longTimeNoReturnB",
                action: (() => {}),
            }
        }
    },
    Eden_longTimeNoReturnA: {
        id: "Eden_longTimeNoReturnA",
        npc: "Eden",
        preMsg: "Eden_longTimeNoReturn.A",
        condition: (() => { return true }),
        hide_msg: false,
        action: (() => {}),
        replies: {
            "Eden_longTimeNoReturnA.A": {
                condition: (() => { return true }),
                targetEventKey: "Eden_longTimeNoReturnAA",
                action: (() => {}),
            },
            "Eden_longTimeNoReturnA.B": {
                condition: (() => { return true }),
                targetEventKey: "Eden_longTimeNoReturnB",
                action: (() => {}),
            }
        }
    },
    Eden_longTimeNoReturnAA: {
        id: "Eden_longTimeNoReturnA",
        npc: "Eden",
        preMsg: "Eden_longTimeNoReturnA.A",
        condition: (() => { return true }),
        hide_msg: false,
        action: (() => { wikifier('npcincr', 'Eden', 'love', -30) }),
        replies: {}
    },
    Eden_longTimeNoReturnB: {
        id: "Eden_longTimeNoReturnB",
        npc: "Eden",
        preMsg: "Eden_longTimeNoReturn.B",
        condition: (() => { return true }),
        hide_msg: false,
        action: (() => {}),
        replies: {
            "Eden_longTimeNoReturnB.A": {
                condition: (() => { return true }),
                targetEventKey: "Eden_longTimeNoReturnBA",
                action: (() => {}),
            },
            "Eden_longTimeNoReturnB.B": {
                condition: (() => { return V.trauma >= 2000 }),
                targetEventKey: "Eden_longTimeNoReturnBB",
                action: (() => {}),
            }
        }
    },
    Eden_longTimeNoReturnBA: {
        id: "Eden_longTimeNoReturnBA",
        npc: "Eden",
        preMsg: "Eden_longTimeNoReturnB.A",
        condition: (() => { return true }),
        hide_msg: false,
        action: (() => {}),
        replies: {
            "Eden_longTimeNoReturnBA.A": {
                condition: (() => { return true }),
                targetEventKey: "Eden_longTimeNoReturnBAA",
                action: (() => {}),
            }
        }
    },
    Eden_longTimeNoReturnBAA: {
        id: "Eden_longTimeNoReturnBAA",
        npc: "Eden",
        preMsg: "Eden_longTimeNoReturnBA.A",
        condition: (() => { return true }),
        hide_msg: false,
        action: (() => {}),
        replies: {}
    },
    Eden_longTimeNoReturnBB: {
        id: "Eden_longTimeNoReturnBB",
        npc: "Eden",
        preMsg: "Eden_longTimeNoReturnB.B",
        condition: (() => { return true }),
        hide_msg: false,
        action: (() => {}),
        replies: {
            "Eden_longTimeNoReturnBB.A": {
                condition: (() => { return true }),
                targetEventKey: "Eden_longTimeNoReturnBBA",
                action: (() => {}),
            }
        }
    },
    Eden_longTimeNoReturnBBA: {
        id: "Eden_longTimeNoReturnBBA",
        npc: "Eden",
        preMsg: "Eden_longTimeNoReturnB.B",
        condition: (() => { return true }),
        hide_msg: false,
        action: (() => { V.trauma -= 1000 }),
        replies: {}
    }
}
window.PhoneModEvents.readEvents(E)