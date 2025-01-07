import fs from "fs";
import express , { Request, Response } from "express"
import yaml from "yaml";
import path, { toNamespacedPath } from "path";
import cors from "cors";
import { KubeConfig, AppsV1Api, CoreV1Api, NetworkingV1Api } from "@kubernetes/client-node";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const kubeconfig = new KubeConfig();
kubeconfig.loadFromDefault();
const coreV1Api = kubeconfig.makeApiClient(CoreV1Api);
const appsV1Api = kubeconfig.makeApiClient(AppsV1Api);
const networkingV1Api = kubeconfig.makeApiClient(NetworkingV1Api);

const readandupdateyaml = (filepath:string,replId:string): Array<any> =>{
    const fileContent = fs.readFileSync(filepath,'utf8');
    const updateddocs = yaml.parseAllDocuments(fileContent).map((doc) => {
            let stringdoc = doc.toString();
            const regexp = new RegExp('service_name','g');
            stringdoc = stringdoc.replace(regexp,replId);
            return yaml.parse(stringdoc);
    })
    return updateddocs;
}

app.post('/start',async (req: Request,res:Response) => {
    const replId = req.body;
    const namespace = "default";
    console.log("request reached here at /start endpoint orchestrator")

    try{
        const kuberneresManifest = readandupdateyaml(path.join(__dirname,"../service.yaml"),replId);
        for (const manifest of kuberneresManifest){
            switch(manifest.kind){
                case "Deployment":
                await appsV1Api.createNamespacedDeployment({namespace, body:manifest});
                break;
            case "Service":
                await coreV1Api.createNamespacedService({namespace, body:manifest});
                break;
            case "Ingress":
                await networkingV1Api.createNamespacedIngress({namespace, body:manifest});
                break;
            default:
                console.log(`Unsupported kind: ${manifest.kind}`);
            }
        }
        console.log("request reached here atend of means pod is created /start endpoint orchestrator")

    }catch(err){
        console.log('failed to create the resources');
        res.status(500).send({ message: "failed resources" });
    }
});

const port = process.env.PORT || 3003;

app.listen(port,() => {
  console.log(`listening on ${port}`)
});
