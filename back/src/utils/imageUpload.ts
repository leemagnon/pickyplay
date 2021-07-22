import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('JPEG 또는 PNG 파일만 업로드할 수 있습니다. Invalid Mime Type, only JPEG and PNG'), false);
  }
};

export const S3Upload = (folder) =>
  multer({
    fileFilter,
    storage: multerS3({
      s3: new AWS.S3(),
      bucket: 'pickyplay-s3',
      acl: 'public-read',
      key(req, file, cb) {
        cb(null, `${folder}/${Date.now()}_${path.basename(file.originalname)}`);
      },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  });

export const uploadProfileImg = async (req, res, next) => {
  try {
    res.json(req.file.location);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const uploadReviewImgs = async (req, res, next) => {
  try {
    res.json(req.files.map((v) => v.location));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * S3 사용 시 좋은 점 : 서버 스케일링 때 이미지도 함께 복사되는 문제를 고려할 필요 없고, 백업도 알아서 해준다.
 */
