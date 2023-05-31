import axios from "axios";

export async function getImageUrl(image) {
     try {
          const form_Data = new FormData();
          form_Data.append("file", image.files);
          form_Data.append("upload_preset", "jaywest");
          const {
               data: { secure_url: url },
          } = await axios.post(
               "https://api.cloudinary.com/v1_1/di97m2vqq/upload",
               form_Data
          );
          return url;
     } catch (error) {
          console.log(error);
     }
}
