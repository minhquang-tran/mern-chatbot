import React from "react";
import { Box, Avatar } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function parseMessageContent(
  message: string,
): { type: "text" | "code"; content: string }[] {
  const parts = message.split(/```([\s\S]*?)```/);
  return parts
    .map((part, index) => ({
      type: index % 2 === 1 ? ("code" as const) : ("text" as const),
      content: part.trim(),
    }))
    .filter((part) => part.content.length > 0);
}

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "model";
}) => {
  const messageParts = parseMessageContent(content);
  const auth = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: role === "model" ? "#004d5612" : "#004d56",
        gap: 2,
        borderRadius: 2,
        my: 1,
      }}
    >
      <Avatar
        sx={{ ml: "0", bgcolor: role === "user" ? "black" : "transparent" }}
      >
        {role === "model" ? (
          <img src="gemini.png" alt="gemini" width={"30px"} />
        ) : (
          `${auth?.user?.name[0]}${auth?.user?.name.split(" ")[1]?.[0] || ""}`
        )}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        {messageParts.map((part, index) =>
          part.type === "code" ? (
            <SyntaxHighlighter
              key={index}
              style={coldarkDark}
              language="javascript"
            >
              {part.content}
            </SyntaxHighlighter>
          ) : (
            <ReactMarkdown
              key={index}
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => (
                  <p
                    style={{ fontSize: "20px", margin: "10px 0" }}
                    {...props}
                  />
                ),
                a: ({ node, ...props }) => (
                  <a style={{ color: "#58a6ff" }} {...props} />
                ),
              }}
            >
              {part.content}
            </ReactMarkdown>
          ),
        )}
      </Box>
    </Box>
  );
};

export default ChatItem;
