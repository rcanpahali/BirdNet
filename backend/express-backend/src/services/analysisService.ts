import db from '../db';
import { Detection } from '../types';

type SaveAnalysisInput = {
  filename: string;
  mimetype: string;
  fileSize: number;
  lat?: number;
  lon?: number;
  minConf?: number;
  detections: Detection[];
};

type AnalysisRowParams = {
  filename: string;
  mimetype: string;
  fileSize: number;
  lat: number | null;
  lon: number | null;
  minConf: number | null;
};

type DetectionRowParams = Detection & { analysisId: number };

const insertAnalysisStatement = db.prepare<AnalysisRowParams>(
  `INSERT INTO analyses (filename, mimetype, file_size, lat, lon, min_conf)
   VALUES (@filename, @mimetype, @fileSize, @lat, @lon, @minConf)`
);

const insertDetectionStatement = db.prepare<DetectionRowParams>(
  `INSERT INTO detections (analysis_id, common_name, scientific_name, confidence, start_time, end_time)
   VALUES (@analysisId, @common_name, @scientific_name, @confidence, @start_time, @end_time)`
);

export function saveAnalysisResult(payload: SaveAnalysisInput): number {
  const transaction = db.transaction((input: SaveAnalysisInput) => {
    const analysisResult = insertAnalysisStatement.run({
      filename: input.filename,
      mimetype: input.mimetype,
      fileSize: input.fileSize,
      lat: typeof input.lat === 'number' && Number.isFinite(input.lat) ? input.lat : null,
      lon: typeof input.lon === 'number' && Number.isFinite(input.lon) ? input.lon : null,
      minConf:
        typeof input.minConf === 'number' && Number.isFinite(input.minConf)
          ? input.minConf
          : null,
    });

    const analysisId = Number(analysisResult.lastInsertRowid);

    for (const detection of input.detections) {
      insertDetectionStatement.run({
        analysisId,
        ...detection,
      });
    }

    return analysisId;
  });

  return transaction(payload);
}
