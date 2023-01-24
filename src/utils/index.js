export const uploadFiles = async (arrayImgs) => {
  let urls = [];
  if (arrayImgs.length > 0) {
    for (const file of arrayImgs) {
        const upload = new FormData();
        upload.append("file", file);
        upload.append("upload_preset", "helpdesk")
        let url = "https://api.cloudinary.com/v1_1/ragged-cloudinary/image/upload";
        if (file.type.split('/')[0] !== "image") url = "https://api.cloudinary.com/v1_1/ragged-cloudinary/raw/upload"
        const result = await fetch(url, {
          method: "POST",
          body: upload
        })
        const response = await result.json();
        urls.push(response.secure_url)
    }
  }
  return urls;
}