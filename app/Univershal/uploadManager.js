

exports.uploadFile = async function uploadFile(fileBuffer,originalPicFolder,thumbnailPicFolder,processedPicFolder,fileName,mimeType,fileExtension){
    try {
        let promises = [];
        if(mimeType.split("/")[0]== "image"){
            promises = [];
            let dimensions = await sizeOf(fileBuffer);
            let buffer = await uploadProcessedImage(fileBuffer,processedPicFolder,fileName,mimeType,fileExtension);

            dimensions.width = 300;
            promises.push(uploadThumbnailImage(buffer,thumbnailPicFolder,fileName,mimeType,dimensions,1,50,fileExtension));
        }
        else{
            promises = [
                uploadOriginalImage(fileBuffer,processedPicFolder,fileName,mimeType,fileExtension)
            ];
        }
        let [ thumbnailPic,processedPic] = await Promise.all(promises);
        
        return {};

    } catch (err) {
        console.log("===================err===========",err)
        return err;
    }
};

async function uploadOriginalImage(fileBuffer,originalPicFolder,fileName,mimeType) {
    console.log(fileBuffer);
}

async function uploadThumbnailImage(fileBuffer,thumbnailPicFolder,fileName,mimeType,dimensions,compressLevelRatio,quality,fileExtension) {
    try{

        let height = 300;
        let width = 300;
        let compressLevel = 1;


        let data = await sharp(fileBuffer)
            .resize(dimensions.width)
            .min()
            .toFormat('jpeg', {quality: quality})
            .toBuffer();

        if(fileExtension=="png"){
            data = await sharp(fileBuffer)
                    .resize(dimensions.width)
                    .min()
                    .toFormat('png', {quality: quality})
                    .toBuffer();
        }

    }
    catch( err) {
        console.error("err-->>",err);
    }
}


