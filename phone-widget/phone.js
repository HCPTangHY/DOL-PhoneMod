window.send_msg = function(sendKey) {
    V.chatList[T.npc].push({
        sender: "Me",
        msg: L[sendKey],
        sendTime: [Time.year, Time.mouth, Time.mouthDay].join(".") + [Time.hour, Time.minute].join(":")
    });
    $("#wecatchat_content").append("Me：" + L[sendKey] + "<br>");
}