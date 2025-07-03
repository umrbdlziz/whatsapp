import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,

    // 🆕 Live Doc collaboration
    liveDocContent,
    setLiveDocContent,
    initLiveDocSocket,
    sendLiveDocUpdate,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [showDoc, setShowDoc] = useState(false);

  // Initialize socket listener for live doc
  useEffect(() => {
    initLiveDocSocket();
  }, []);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
              {message.translatedText && message.translatedText !== message.text && (
                <p className="text-xs text-gray-400 italic mt-1 border-t border-gray-600 pt-1">
                  {message.translatedText}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />

      {/* Toggle for Live Doc */}
      <div className="px-4 py-2 flex items-center gap-2">
        <input
          type="checkbox"
          className="toggle toggle-sm toggle-primary"
          checked={showDoc}
          onChange={() => setShowDoc((prev) => !prev)}
        />
        <span className="text-sm">Enable Live Document</span>
      </div>

      {/* Live Document Editor */}
      {showDoc && (
        <div className="px-4 pb-4">
          <textarea
            className="textarea textarea-bordered w-full min-h-[150px]"
            placeholder="Start collaborating here..."
            value={liveDocContent}
            onChange={(e) => {
              setLiveDocContent(e.target.value);
              sendLiveDocUpdate(e.target.value);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
