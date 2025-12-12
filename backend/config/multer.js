const multer=require('multer');
const path=require('path');


const storage=(destination)=>multer.diskStorage({
    destination:destination,
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`);
    }
});

function checkFileType(file, cb) {
    let fileTypes;
    if (file.fieldname === 'logo') {
        fileTypes = /jpeg|jpg|png/;
    } else if (file.fieldname === 'descriptionFile') {
        fileTypes = /jpeg|jpg|png|pdf|docx|doc/;
    } else {
        return cb('Error: Invalid fieldname');
    }

    if (!fileTypes) {
        return cb('Error: No file types defined');
    }

    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb('Error: Invalid file type!');
    }
}

const upload=(destination)=>multer({
    storage:storage(destination),
    limits:{fileSize:20000000},
    fileFilter:(req,file,cb)=>{
        checkFileType(file,cb);
    }
}).fields([
    {name:'logo',maxCount:1},
    {name:'descriptionFile',maxCount:1}
])

module.exports=upload;