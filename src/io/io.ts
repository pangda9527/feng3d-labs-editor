module feng3d.editor
{
    export var file: FileUtils;
    if (isNative)
    {
        file = require(__dirname + "/io/native/file.js").file;
    } else
    {
        file = feng3d.web.file;
    }

    file.selectFile = (callback: (file: File) => void) =>
    {
        selectFileCallback = callback;
    }

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.addEventListener('change', function (event)
    {
        var file = fileInput.files[0];
        selectFileCallback(file);
        selectFileCallback = null;
    });
    document.body.appendChild(fileInput);
    window.addEventListener("click", () =>
    {
        if (selectFileCallback)
            fileInput.click();
    });

    var selectFileCallback: (file: File) => void;
}