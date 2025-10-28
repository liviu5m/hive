import { Message, User } from "@/lib/Types";
import React, { useEffect, useRef, useState } from "react";
import { RealtimeChat } from "../realtime-chat";
import { ChatMessage } from "@/hooks/use-realtime-chat";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createMessage,
  getMessagesBySenderIdAndReceiverId,
} from "@/api/message";
import { useAppContext } from "@/lib/AppContext";

const ChatComponents = ({
  currentUser,
  recipientUser,
}: {
  currentUser: User;
  recipientUser: User;
}) => {
  const { token } = useAppContext();
  const roomName = [currentUser.id, recipientUser.id].sort().join("-");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { data: messagesData } = useQuery({
    queryKey: ["messages", roomName],
    queryFn: () =>
      getMessagesBySenderIdAndReceiverId(
        currentUser.id,
        recipientUser.id,
        token || ""
      ),
  });

  useEffect(() => {
    if (messagesData)
      setMessages(
        messagesData.map((msg: Message) => ({
          ...msg,
          user: { ...msg.sender, name: msg.sender.username },
        }))
      );
  }, [messagesData]);

  const { mutate: addMessage } = useMutation({
    mutationKey: ["create-message"],
    mutationFn: (msg: ChatMessage) =>
      createMessage(msg, currentUser.id, recipientUser.id, token || ""),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const onMessage = (msgs: ChatMessage[]) => {
    let msg = msgs.slice(messages?.length)[0];
    if (msg) {
      addMessage(msg);
      setMessages([...messages, msg]);
    }
  };

  return (
    <div className="h-full">
      <RealtimeChat
        roomName={roomName}
        username={currentUser.username}
        messages={messages}
        onMessage={onMessage}
      />
    </div>
  );
};

export default ChatComponents;
