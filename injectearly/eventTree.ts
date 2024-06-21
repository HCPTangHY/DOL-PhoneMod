class PhoneEventBaseNode {
    do() {
        return true
    }
}

class NonLeafNode extends PhoneEventBaseNode {
    childrenNodes: Array<any>;
    constructor() {
        super()
        this.childrenNodes = [];
    }
}

class PhoneEventTreeSelectorNode extends NonLeafNode {
    constructor() {
        super()
    }
    do() {
        for (let child of this.childrenNodes) {
            if (child.do()) { return false; }
        }
        return true
    }
}
class PhoneEventTreeSequenceNode extends NonLeafNode {
    constructor() {
        super()
    }
    do() {
        for (let child of this.childrenNodes) {
            if (!child.do()) { return false; }
        }
        return true
    }
}
class PhoneEventTreeParallelNode extends NonLeafNode {
    constructor() {
        super()
    }
    do() {
        for (let child of this.childrenNodes) {
            child.do();
        }
        return true
    }
}
class PhoneEventTreeConditionNode extends PhoneEventBaseNode {
    condition:string;
    constructor(condition:string) {
        super()
        this.condition = condition
    }
    do():boolean {
        return eval(this.condition);
    }
}
class PhoneEventTreeActionNode extends PhoneEventBaseNode {
    msgID:string;
    constructor(msgID:string) {
        super()
        this.msgID = msgID
    }
    do() {
        try {
            console.log(this.msgID);
            return true
        } catch (error) {
            return false
        }
    }
}
class PhoneEventNode extends PhoneEventTreeSequenceNode {
    constructor(conditionNode:PhoneEventTreeConditionNode, actionNode:PhoneEventTreeActionNode) {
        super();
        this.childrenNodes.push(conditionNode, actionNode);
    }
}
class PhoneModEvent {
    id:string;
    npc:string;
    preMsg:string;
    condition:string;
    hide_msg:boolean;
    script:string;
    replies:any[];
    constructor(id:string,npc:string,preMsg:string,condition:string,hide_msg:boolean,script:string,replies:any[]) {
        this.id=id;
        this.npc=npc;
        this.preMsg=preMsg;
        this.condition=condition;
        this.hide_msg=hide_msg;
        this.script=script;
        this.replies = replies;
    }
}
enum NPCCharState {
    active,passive,rest
}
class NPCEventTree {
    state:number; //active:1, passive:2, rest:3
    activeNode:PhoneEventTreeSelectorNode;
    passiveNode:PhoneEventTreeSelectorNode;
    restNode:null;

    constructor() {
        this.activeNode = new PhoneEventTreeSelectorNode();
        this.passiveNode = new PhoneEventTreeSelectorNode();
        this.restNode = null;
        this.state = NPCCharState.active;
    }
    new_SelectorNode() {
        return new PhoneEventTreeSelectorNode();
    }
    new_SequenceNode() {
        return new PhoneEventTreeSequenceNode();
    }
    new_ConditionNode(codition:string) {
        return new PhoneEventTreeConditionNode(codition);
    }
    new_ActionNode(msgID:string) {
        return new PhoneEventTreeActionNode(msgID);
    }
    new_PhoneEventNode(conditionNode:PhoneEventTreeConditionNode, actionNode:PhoneEventTreeActionNode) {
        return new PhoneEventNode(conditionNode, actionNode);
    }

    read_events(events:PhoneModEvent[]) {
        for (let eid in events) {
            if (!events[eid].preMsg) {
                this.activeNode.childrenNodes.push(
                    this.new_PhoneEventNode(
                        this.new_ConditionNode(events[eid].condition),
                        this.new_ActionNode(eid)
                    )
                );
                continue
            } else {
                for (let i=0;i<this.passiveNode.childrenNodes.length;i++) {
                    let nodes = this.passiveNode.childrenNodes[i];
                    if (nodes.childrenNodes[0].codition==`V.PhoneModChatPreMsg==${events[eid].preMsg}`) {
                        this.passiveNode.childrenNodes[i].childrenNodes[1].childrenNodes.push(
                            this.new_PhoneEventNode(
                                this.new_ConditionNode(events[eid].condition),
                                this.new_ActionNode(eid)
                            )
                        );
                        continue
                    }
                }
                this.passiveNode.childrenNodes.push(this.new_SequenceNode());
                this.passiveNode.childrenNodes[this.passiveNode.childrenNodes.length-1].childrenNodes.push(
                    this.new_ConditionNode("V.PhoneModChatPreMsg=="+events[eid].preMsg),
                    this.new_PhoneEventNode(
                        this.new_ConditionNode(events[eid].condition),
                        this.new_ActionNode(eid)
                    )
                );
            }
        }
    }
}

interface Window {
    PhoneModNPCEventTree:NPCEventTree;
    PhoneModNPCEvents:any
}
window.PhoneModNPCEventTree = new NPCEventTree();
window.PhoneModNPCEvents = {
    read_events(events:PhoneModEvent[]) {
        let npcPool:any = {}
        for (let eid in events) {
            if (events[eid].npc in npcPool) {
                npcPool[events[eid].npc][eid] = events[eid];
            } else {
                this[events[eid].npc] = new NPCEventTree();
                npcPool[events[eid].npc] = {};
                npcPool[events[eid].npc][eid] = events[eid];
            }
        }
        for (let npc in npcPool) {
            this[npc].read_events(npcPool[npc]);
        }
    }
}