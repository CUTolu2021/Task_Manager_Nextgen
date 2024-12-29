import { v2 as cloudinary } from 'cloudinary';

interface IImageData {
  public_id: string;
  image: any;
}
export const uploadCAC2 = async (data: IImageData) => {
  // Configuration
  cloudinary.config({
    cloud_name: 'dugwoa2qp',
    api_key: '869573292963113',
    api_secret: 'iHRIAJQL3zdDU4VKr9LT5X9-ZWQ', // Click 'View API Keys' above to copy your API secret
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(data.image, {
      public_id: data.public_id,
    })
    .catch((error) => {
      console.log(error);
    });

  console.log('upload from cloudinary', uploadResult);

  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url(data.public_id, {
    fetch_format: 'auto',
    quality: 'auto',
  });

  console.log('Optimize from cloudinary', optimizeUrl);

  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url(data.public_id, {
    crop: 'auto',
    gravity: 'auto',
    width: 500,
    height: 500,
  });

  console.log('transform from cloudinary', autoCropUrl);

  return autoCropUrl;
};



cloudinary.config({
    cloud_name: 'dugwoa2qp',
    api_key: '869573292963113',
    api_secret: 'iHRIAJQL3zdDU4VKr9LT5X9-ZWQ', // Click 'View API Keys' above to copy your API secret
  });

export const uploadCAC = async (
  buffer: Buffer,
  fileName: string,
): Promise<string> => {

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: 'auto', public_id: fileName },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        },
      )
      .end(buffer);
  });
};
