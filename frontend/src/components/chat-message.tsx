import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/hooks/use-realtime-chat";
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessage, updateMessage } from "@/api/message";
import { useAppContext } from "@/lib/AppContext";

interface ChatMessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showHeader: boolean;
  roomName: string;
  setEdit: (e: string) => void;
  setNewMessage: (e: string) => void;
}

export const ChatMessageItem = ({
  message,
  isOwnMessage,
  showHeader,
  roomName,
  setEdit,
  setNewMessage,
}: ChatMessageItemProps) => {
  const MENU_ID = "my-menu-" + message.id;
  const { token } = useAppContext();
  const queryClient = useQueryClient();
  const { show } = useContextMenu({ id: MENU_ID });

  const { mutate: deleteMessageFunc } = useMutation({
    mutationKey: ["delete-message", message.id],
    mutationFn: () => deleteMessage(message.id, token || ""),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["messages", roomName] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <div
      className={`flex mt-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={cn("max-w-[75%] w-fit flex flex-col gap-1", {
          "items-end": isOwnMessage,
        })}
      >
        {showHeader && (
          <div
            className={cn("flex items-center gap-2 text-xs px-3", {
              "justify-end flex-row-reverse": isOwnMessage,
            })}
          >
            <span className={"font-medium"}>{message.user.name}</span>
            <span className="text-foreground/50 text-xs">
              {new Date(message.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        )}
        <div
          className={cn(
            "py-2 px-3 rounded-xl text-sm w-fit",
            isOwnMessage
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
          onContextMenu={(e) => {
            e.preventDefault();
            show({ event: e as unknown as MouseEvent });
          }}
        >
          {message.content}
          <Menu id={MENU_ID}>
            <Item
              onClick={() => {
                setEdit(message.id);
                setNewMessage(message.content);
              }}
            >
              Update
            </Item>
            <Item onClick={() => deleteMessageFunc()}>Delete</Item>
          </Menu>
        </div>
      </div>
    </div>
  );
};
