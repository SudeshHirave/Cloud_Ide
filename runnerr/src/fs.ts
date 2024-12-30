import fs from 'fs'
interface File {
    type : 'file' | 'dir',
    name: string
}

export const fetchDir = async (dir : string , baseDir : string) : Promise<File[]> =>{
    try{
        return new Promise((resolve, reject) => {
            fs.readdir(dir, { withFileTypes: true }, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files.map(file => ({ type: file.isDirectory() ? "dir" : "file", name: file.name, path: `${baseDir}/${file.name}`  })));
                }
            });       
        });
    }catch(err){
        throw new Error('Failed to read directory ${dir}: ${err.message}');
    }
};
export const fetchFileContent = (fullpath :string): Promise<string> =>{
    return new Promise((resolve,reject) => {
      fs.readFile(fullpath,'utf8', (err,data) => {
        if(err){
            console.log('error fetching file');
            reject(err);
        }else{
            resolve(data);
        }
      })
    })
};
export const savefile = (file: string, content: string): Promise<void> =>{
    return new Promise((resolve,reject) => {
        fs.writeFile(file, content, "utf8", (err) => {
            if (err) {
                return reject(err);
            }else{
               resolve();
            }
      })
    })
}
