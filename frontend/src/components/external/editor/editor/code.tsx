import Editor from "@monaco-editor/react";
import { File } from "../utils/file-manager";
import { Socket } from "socket.io-client";
//@ts-ignore
export const Code = ({ selectedFile, socket }: { selectedFile: File | undefined, socket: Socket | null }) => {
  if (!selectedFile)
    return null
  if (!socket) {
    return (
        <div>
            <p>Loading socket...</p>
        </div>
    );
}
  const code = selectedFile.content
  let language = selectedFile.name.split('.').pop()

  if (language === "js" || language === "jsx")
    language = "javascript";
  else if (language === "ts" || language === "tsx")
    language = "typescript"
  else if (language === "py" )
    language = "python"

    function debounce(func: (value: string) => void, wait: number) {
      let timeout:  ReturnType<typeof setTimeout>;;
      return (value: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func(value);
        }, wait);
      };
    }
  return (
      <Editor
        height="100vh"
        language={language}
        value={code}
        theme="vs-dark"
        onChange={debounce((value) => {
          socket.emit("updateContent", { path: selectedFile.path, content: value });
        }, 500)}
      />
  )
}
