"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const yaml_1 = __importDefault(require("yaml"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const client_node_1 = require("@kubernetes/client-node");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const kubeconfig = new client_node_1.KubeConfig();
kubeconfig.loadFromDefault();
const coreV1Api = kubeconfig.makeApiClient(client_node_1.CoreV1Api);
const appsV1Api = kubeconfig.makeApiClient(client_node_1.AppsV1Api);
const networkingV1Api = kubeconfig.makeApiClient(client_node_1.NetworkingV1Api);
const readandupdateyaml = (filepath, replId) => {
    const fileContent = fs_1.default.readFileSync(filepath, 'utf8');
    const updateddocs = yaml_1.default.parseAllDocuments(fileContent).map((doc) => {
        let stringdoc = doc.toString();
        const regexp = new RegExp('service_name', 'g');
        stringdoc = stringdoc.replace(regexp, replId);
        return yaml_1.default.parse(stringdoc);
    });
    return updateddocs;
};
app.post('/start', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const replId = req.body;
    const namespace = "default";
    try {
        const kuberneresManifest = readandupdateyaml(path_1.default.join(__dirname, "../service.yaml"), replId);
        for (const manifest of kuberneresManifest) {
            switch (manifest.kind) {
                case "Deployment":
                    yield appsV1Api.createNamespacedDeployment({ namespace, body: manifest });
                    break;
                case "Service":
                    yield coreV1Api.createNamespacedService({ namespace, body: manifest });
                    break;
                case "Ingress":
                    yield networkingV1Api.createNamespacedIngress({ namespace, body: manifest });
                    break;
                default:
                    console.log(`Unsupported kind: ${manifest.kind}`);
            }
        }
    }
    catch (err) {
        console.log('failed to create the resources');
        res.status(500).send({ message: "failed resources" });
    }
}));
const port = process.env.PORT || 3003;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
