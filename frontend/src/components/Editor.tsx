import { Socket } from "socket.io-client"
import Sidebar from "./external/editor/components/sidebar";
import { Code } from "./external/editor/editor/code";
import styled from "@emotion/styled";
import { buildFileTree, File, RemoteFile } from "./external/editor/utils/file-manager"
import { useEffect, useMemo } from "react"
import { FileTree } from "./external/editor/components/file-tree"
const Main = styled.main`
  display: flex;
`;

// credits - https://codesandbox.io/s/monaco-tree-pec7u
export const Editor = ({
    socket,
    files,
    selectedfile,
    onSelect
}:{
    socket: Socket | null,
    files: RemoteFile[],
    selectedfile: File | undefined,
    onSelect: (file: File) => void 
}) => {
    const rootdir = useMemo(() => {
      return buildFileTree(files);
    },[files]);
    useEffect(() => {
      if(!selectedfile){
        onSelect(rootdir.files[0])
      }
    } , [selectedfile]);

  return(
    <div>
        <Main>
            <Sidebar>
                <FileTree
            rootDir={rootdir}
            selectedFile={selectedfile}
            onSelect={onSelect}
                />
            </Sidebar>
            <Code socket={socket!} selectedFile={selectedfile} />
        </Main>
    </div>
  )
}
