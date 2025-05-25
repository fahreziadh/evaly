// import sharp from "sharp";

// export enum ImageFormat {
//   JPEG = "jpeg",
//   PNG = "png",
//   WEBP = "webp",
//   AVIF = "avif",
//   ORIGINAL = "original",
// }

// export async function compressImage(
//   image: File,
//   options?: {
//     width?: number;
//     height?: number;
//     quality?: number;
//     outputFormat?: ImageFormat;
//     maintainAspectRatio?: boolean;
//   }
// ) {
//   const {
//     width,
//     height,
//     quality = 80,
//     outputFormat = ImageFormat.WEBP,
//     maintainAspectRatio = true,
//   } = options || {};

//   // Convert File to buffer
//   const arrayBuffer = await image.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   let sharpInstance = sharp(buffer);

//   // Get image metadata to calculate aspect ratio if needed
//   let resizeOptions: sharp.ResizeOptions = {
//     width,
//     height,
//     fit: "inside",
//     withoutEnlargement: true,
//   };

//   if (maintainAspectRatio && (width || height) && !(width && height)) {
//     const metadata = await sharpInstance.metadata();

//     if (width && !height && metadata.width && metadata.height) {
//       // Calculate height based on aspect ratio
//       const aspectRatio = metadata.height / metadata.width;
//       resizeOptions.height = Math.round(width * aspectRatio);
//     } else if (height && !width && metadata.width && metadata.height) {
//       // Calculate width based on aspect ratio
//       const aspectRatio = metadata.width / metadata.height;
//       resizeOptions.width = Math.round(height * aspectRatio);
//     }
//   }

//   // Resize if width or height is provided
//   if (resizeOptions.width || resizeOptions.height) {
//     sharpInstance = sharpInstance.resize(resizeOptions);
//   }

//   // Compress with quality (between 50-100)
//   const finalQuality = Math.max(50, Math.min(100, quality));

//   // Get the original image format
//   const inputFormat = image.type.split("/")[1];

//   // Determine output format
//   const format =
//     outputFormat === ImageFormat.ORIGINAL ? inputFormat : outputFormat;

//   // Process based on format
//   let outputBuffer;
//   let outputMimeType = image.type;

//   if (format === ImageFormat.JPEG) {
//     outputBuffer = await sharpInstance
//       .jpeg({ quality: finalQuality })
//       .toBuffer();
//     outputMimeType = "image/jpeg";
//   } else if (format === ImageFormat.PNG) {
//     outputBuffer = await sharpInstance
//       .png({ quality: finalQuality })
//       .toBuffer();
//     outputMimeType = "image/png";
//   } else if (format === ImageFormat.WEBP) {
//     outputBuffer = await sharpInstance
//       .webp({ quality: finalQuality })
//       .toBuffer();
//     outputMimeType = "image/webp";
//   } else if (format === ImageFormat.AVIF) {
//     outputBuffer = await sharpInstance
//       .avif({ quality: finalQuality })
//       .toBuffer();
//     outputMimeType = "image/avif";
//   } else {
//     // Default to webp if format is not supported
//     outputBuffer = await sharpInstance
//       .webp({ quality: finalQuality })
//       .toBuffer();
//     outputMimeType = "image/webp";
//   }

//   // Generate output filename
//   let outputFilename = image.name;
//   if (format !== ImageFormat.ORIGINAL) {
//     // Replace extension in filename
//     const nameParts = image.name.split(".");
//     if (nameParts.length > 1) {
//       nameParts[nameParts.length - 1] = format;
//       outputFilename = nameParts.join(".");
//     } else {
//       outputFilename = `${image.name}.${format}`;
//     }
//   }

//   // Convert buffer back to File
//   const compressedFile = new File([outputBuffer], outputFilename, {
//     type: outputMimeType,
//   });

//   return compressedFile;
// }

export const compressImage = async (image: File) => {
  return image
}
