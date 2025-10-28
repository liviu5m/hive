import { useEffect, useState } from "react";
import BodyLayout from "../layouts/BodyLayout";
import { SearchIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { User } from "@/lib/Types";
import { RealtimeChat } from "../realtime-chat";
import { useAppContext } from "@/lib/AppContext";
import ChatComponents from "../elements/ChatComponent";
import { useQuery } from "@tanstack/react-query";
import { getUsersFromConversation } from "@/api/message";

const messages = [
  {
    id: 1,
    senderId: 1,
    text: "Hey, how's it going?",
    time: "10:45 AM",
    isOwn: false,
  },
  {
    id: 2,
    senderId: "me",
    text: "Hi Alex! I'm doing well, thanks for asking. How about you?",
    time: "10:47 AM",
    isOwn: true,
  },
  {
    id: 3,
    senderId: 1,
    text: "I'm good too! Just working on some new designs. Have you seen the latest update to the platform?",
    time: "10:50 AM",
    isOwn: false,
  },
  {
    id: 4,
    senderId: "me",
    text: "Not yet, what's new in the update?",
    time: "10:52 AM",
    isOwn: true,
  },
];

const Messages = () => {
  const [activeChat, setActiveChat] = useState<User>();
  const { state } = useLocation();
  const [contacts, setContacts] = useState<User[]>(
    state ? [state.user] : []
  );
  const { user, token } = useAppContext();
  console.log(contacts);

  const { data: users } = useQuery({
    queryKey: ["users-from-conversation"],
    queryFn: () => getUsersFromConversation(user?.id || -1, token || ""),
  });

  useEffect(() => {
    if (users) setContacts([...contacts, ...users]);
  }, [users]);

  return (
    user && (
      <BodyLayout>
        <div className="w-[1000px] mt-5 h-[80vh]">
          <h1 className="text-3xl font-bold">Messages</h1>
          <div className="flex h-full bg-white rounded-xl shadow-sm overflow-hidden mt-10">
            <div className="w-80 border-r flex flex-col">
              <div className="p-4 border-b">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <SearchIcon
                    size={18}
                    className="absolute left-3 top-2.5 text-gray-500"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setActiveChat(contact)}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 
                    ${activeChat?.id === contact.id ? "bg-gray-50" : ""}
                  `}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={contact.profilePicture}
                          alt={contact.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* {contact.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">
                          {contact.unread}
                        </span>
                      </div>
                    )} */}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">{contact.name}</h3>
                        <span className="text-xs text-gray-500"></span>
                      </div>
                      <p className="text-sm text-gray-600 truncate"></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {activeChat && (
              <div className="flex-1 flex flex-col">
                <ChatComponents currentUser={user} recipientUser={activeChat} />
              </div>
            )}
          </div>
        </div>
      </BodyLayout>
    )
  );
};

export default Messages;
