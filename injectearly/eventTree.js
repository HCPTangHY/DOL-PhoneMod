"use strict";
// class PhoneEventBaseNode {
//     do() {
//         return true
//     }
// }
// class NonLeafNode extends PhoneEventBaseNode {
//     childrenNodes: Array<any>;
//     constructor() {
//         super()
//         this.childrenNodes = [];
//     }
// }
// class PhoneEventTreeSelectorNode extends NonLeafNode {
//     constructor() {
//         super()
//     }
//     do() {
//         for (let child of this.childrenNodes) {
//             if (child.do()) { return false; }
//         }
//         return true
//     }
// }
// class PhoneEventTreeSequenceNode extends NonLeafNode {
//     constructor() {
//         super()
//     }
//     do() {
//         for (let child of this.childrenNodes) {
//             if (!child.do()) { return false; }
//         }
//         return true
//     }
// }
// class PhoneEventTreeParallelNode extends NonLeafNode {
//     constructor() {
//         super()
//     }
//     do() {
//         for (let child of this.childrenNodes) {
//             child.do();
//         }
//         return true
//     }
// }
// class PhoneEventTreeConditionNode extends PhoneEventBaseNode {
//     condition:string;
//     constructor(condition:string) {
//         super()
//         this.condition = condition
//     }
//     do():boolean {
//         return eval(this.condition);
//     }
// }
// class PhoneEventTreeActionNode extends PhoneEventBaseNode {
//     msgID:string;
//     constructor(msgID:string) {
//         super()
//         this.msgID = msgID
//     }
//     do() {
//         try {
//             console.log(this.msgID);
//             return true
//         } catch (error) {
//             return false
//         }
//     }
// }
// class PhoneEventNode extends PhoneEventTreeSequenceNode {
//     constructor(conditionNode:PhoneEventTreeConditionNode, actionNode:PhoneEventTreeActionNode) {
//         super();
//         this.childrenNodes.push(conditionNode, actionNode);
//     }
// }
// enum NPCChatState {
//     active,passive,rest
// }
// class NPCEventTree {
//     state:number; //active:1, passive:2, rest:3
//     activeNode:PhoneEventTreeSelectorNode;
//     passiveNode:PhoneEventTreeSelectorNode;
//     restNode:null;
//     constructor() {
//         this.activeNode = new PhoneEventTreeSelectorNode();
//         this.passiveNode = new PhoneEventTreeSelectorNode();
//         this.restNode = null;
//         this.state = NPCChatState.active;
//     }
//     new_SelectorNode() {
//         return new PhoneEventTreeSelectorNode();
//     }
//     new_SequenceNode() {
//         return new PhoneEventTreeSequenceNode();
//     }
//     new_ConditionNode(codition:string) {
//         return new PhoneEventTreeConditionNode(codition);
//     }
//     new_ActionNode(msgID:string) {
//         return new PhoneEventTreeActionNode(msgID);
//     }
//     new_PhoneEventNode(conditionNode:PhoneEventTreeConditionNode, actionNode:PhoneEventTreeActionNode) {
//         return new PhoneEventNode(conditionNode, actionNode);
//     }
//     read_events(events:PhoneModEvent[]) {
//         for (let eid in events) {
//             if (!events[eid].preMsg) {
//                 this.activeNode.childrenNodes.push(
//                     this.new_PhoneEventNode(
//                         this.new_ConditionNode(events[eid].condition),
//                         this.new_ActionNode(eid)
//                     )
//                 );
//                 continue
//             } else {
//                 for (let i=0;i<this.passiveNode.childrenNodes.length;i++) {
//                     let nodes = this.passiveNode.childrenNodes[i];
//                     if (nodes.childrenNodes[0].codition==`V.PhoneModChatPreMsg==${events[eid].preMsg}`) {
//                         this.passiveNode.childrenNodes[i].childrenNodes[1].childrenNodes.push(
//                             this.new_PhoneEventNode(
//                                 this.new_ConditionNode(events[eid].condition),
//                                 this.new_ActionNode(eid)
//                             )
//                         );
//                         continue
//                     }
//                 }
//                 this.passiveNode.childrenNodes.push(this.new_SequenceNode());
//                 this.passiveNode.childrenNodes[this.passiveNode.childrenNodes.length-1].childrenNodes.push(
//                     this.new_ConditionNode("V.PhoneModChatPreMsg=="+events[eid].preMsg),
//                     this.new_PhoneEventNode(
//                         this.new_ConditionNode(events[eid].condition),
//                         this.new_ActionNode(eid)
//                     )
//                 );
//             }
//         }
//     }
// }
class PhoneModEvent {
    constructor(id, childEvents, npc, preMsg, hide_msg, condition, action) {
        this.id = id;
        this.childEvents = new Map();
        for (let k in childEvents) {
            this.childEvents.set(k, childEvents[k]);
        }
        this.npc = npc;
        this.preMsg = preMsg;
        this.hide_msg = hide_msg;
        this.condition = condition;
        this.action = action;
    }
}
class PhoneModEventSelectItem {
    constructor(id, parentEventKey, condition, targetEventKey, action) {
        this.id = id;
        this.parentEventKey = parentEventKey;
        this.condition = condition;
        this.targetEventKey = targetEventKey;
        this.action = action;
    }
}
class NpcInfo {
    constructor() {
        this.npcName = "";
        this.npcEvents = new Map();
        this.npcActiveEventList = new Map();
        this.userSelectedAnswer = "";
        this.nowEventKey = "";
        this.npcRestFlag = false;
    }
    read_events(events) {
        for (let eid in events) {
            if (!events[eid].preMsg) {
                this.npcActiveEventList.set(eid, new PhoneModEvent(eid, events[eid].replies, events[eid].npc, events[eid].preMsg, events[eid].hide_msg, events[eid].condition, events[eid].action));
            }
            else {
                this.npcEvents.set(eid, new PhoneModEvent(eid, events[eid].replies, events[eid].npc, events[eid].preMsg, events[eid].hide_msg, events[eid].condition, events[eid].action));
            }
        }
    }
}
class PhoneModEventTree {
    constructor() {
        this.events = new Map();
    }
    readEvents(events) {
        let npcPool = {};
        for (let eid in events) {
            if (events[eid].npc in npcPool) {
                npcPool[events[eid].npc][eid] = events[eid];
            }
            else {
                this.events.set(events[eid].npc, new NpcInfo());
                npcPool[events[eid].npc] = {};
                npcPool[events[eid].npc][eid] = events[eid];
            }
        }
        for (let npc in npcPool) {
            this.events.get(npc).read_events(npcPool[npc]);
        }
    }
    getNpcEvents(npc) {
        return this.events.get(npc).npcEvents;
    }
    getNpcActiveEvents(npc) {
        return this.events.get(npc).npcActiveEventList;
    }
    getNpcAllEvents(npc) {
        return new Map([...this.getNpcEvents(npc), ...this.getNpcActiveEvents(npc)]);
    }
    getNpcNowEventKey(npc) {
        var _a;
        return (_a = this.events.get(npc)) === null || _a === void 0 ? void 0 : _a.nowEventKey;
    }
    changeNpcNowEventKey(npc, eid) {
        this.events.get(npc).nowEventKey = eid;
    }
    getNpcRestFlag(npc) {
        var _a;
        return (_a = this.events.get(npc)) === null || _a === void 0 ? void 0 : _a.npcRestFlag;
    }
    changeNpcRestFlag(npc) {
        this.events.get(npc).npcRestFlag = !this.events.get(npc).npcRestFlag;
    }
}
window.PhoneModEvents = new PhoneModEventTree();
