import React from 'react'
import { Dropzone, FileItem } from "@dropzone-ui/react";

const FormDropzone = ({files, setFiles, accept, header = false, footer = false, label = "Arrastra y suelta aquí tus archivos", ...props}) => {
    
  const updateFiles = (incommingFiles) => {
    setFiles(incommingFiles);
  }; 
  
  const onDelete = (id) => {
    setFiles(files.filter((x) => x.id !== id));
  };

  return (
    <>
      <p className="font-bold my-3 text-left">{label}</p>
      <Dropzone
        onChange={updateFiles}
        value={files}
        header={header}
        footer={footer}
        maxFileSize={10098000}
        label={"Arrastra y suelta aquí tus archivos"}
        accept={accept}
        localization={"ES-es"}
        minHeight="200px"
        disableScroll
        {...props}
      >
        {files.length > 0 &&
          files.map((file) => (
            <FileItem
              {...file}
              key={file.id}
              onDelete={onDelete}
              localization={"ES-es"}
              resultOnTooltip={false}
              preview
              info={false}
              hd={false}
            />
          ))}
      </Dropzone>
    </>
  )
}

export default FormDropzone