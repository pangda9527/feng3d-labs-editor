module feng3d.editor
{
    export class AssetsFileNode
    {
        fileinfo: FileInfo;

        image = "resource/assets/icons/json.png";

        name = "文件名称";

        selected = false;

        constructor(fileinfo: FileInfo)
        {
            if (fileinfo.isDirectory)
            {
                this.image = "folder_png";
            }
            else if (/(.jpg|.png)\b/.test(fileinfo.path))
            {
                this.image = fileinfo.path;
            }
            else
            {
                var filename = fileinfo.path.split("/").pop();
                var extension = filename.split(".").pop();
                if (RES.getRes(extension + "_png"))
                {
                    this.image = extension + "_png";
                } else
                {
                    this.image = "file_png";
                }
            }

            this.fileinfo = fileinfo;
            this.name = fileinfo.path.split("/").pop().split(".").shift();
        }
    }
}