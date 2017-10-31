import * as nfs from "fs";

declare global
{
    export var gfs: typeof nfs;
}