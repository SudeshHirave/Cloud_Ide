import { useEffect, useState } from "react"
import axios from 'axios';
import { useSearchParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import styled from '@emotion/styled';
import { File, RemoteFile, Type } from "./external/editor/utils/file-manager";

function useSocket(replId :string){
    const [socket,setsocket] = useState<Socket | null>(null);
    useEffect(() => {
      const newSocket = io(`ws://${replId}.sudeshsocket.com`);
      setsocket(newSocket);
      return () => {
        newSocket.disconnect();
      };
    },[replId])
    return socket;
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* Aligns children (button) to the right */
  padding: 10px; /* Adds some space around the button */
`;

const Workspace = styled.div`
  display: flex;
  margin: 0;
  font-size: 16px;
  width: 100%;
`;

const LeftPanel = styled.div`
  flex: 1;
  width: 60%;
`;

const RightPanel = styled.div`
  flex: 1;
  width: 40%;
`;

export const Coading = ()=>{
    const [podcreated, setpodcreated] = useState(false);
    const [searchParams] = useSearchParams();
    const replId = searchParams.get('replId') ?? '';
 

    useEffect(() => {
      axios.post("http//localhost:3002/project",{replId})
        .then(() => setpodcreated(true))
        .catch((err) => {console.log(err);})
    },[])
    if(!podcreated){
        return (<>booting..</>)
    }
    return (<Postcodingpage/>)
}
export const Postcodingpage = () => {
    const [loaded,setloaded] = useState(false);
    const [searchparms] = useSearchParams();
    const replId = searchparms.get('replId') ?? '';
    const [filestructure,setFileStructure] = useState<RemoteFile[]>([]);
    const [selectedFile,setSelectedFile] = useState<File | undefined>(undefined);
    const [showOutput,setShowOutput] = useState(false);
    const socket = useSocket(replId);

    useEffect(() => {
        if(socket){
            socket.on('loaded', ({rootContent} : {rootContent : RemoteFile[]}) => {
                setloaded(true);
                setFileStructure(rootContent);   
            })
        }
    },[socket]);

    const onSelect = (file : File)=>{
        if(file.type === Type.DIRECTORY){
            socket?.emit('fetchDir', file.path, (data : RemoteFile[]) => {
              setFileStructure((prev) => {
                const allfiles = [...prev,...data];
                return allfiles.filter((file,index,self) => {
                  index === self.findIndex(f => f.path === file.path);
                })
              })
            })
        }
        else{
            socket?.emit('fetchContent',file.path,(data : string) => {
              file.content = data;
              setSelectedFile(file);
            })
        }
    }
    if(!loaded){
        return <>loading...</>;
    }
    
    return(
        <Container>
            <ButtonContainer>
                <button onSelect={()=>setShowOutput(true)}>output</button>
            </ButtonContainer>
            <Workspace>
                <LeftPanel>
                    <>ocoding </>
                </LeftPanel>
                <RightPanel>
                    <>terminal</>
                </RightPanel>
            </Workspace>
        </Container>
    )
}