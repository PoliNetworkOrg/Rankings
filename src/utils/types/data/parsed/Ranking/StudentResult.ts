import CustomMap from "../../../../CustomMap";

type StudentResult = {
  birthDate?: string;
  canEnroll?: boolean;
  canEnrollInto?: string;
  englishCorrectAnswers?: number;
  id?: string;
  positionAbsolute?: number;
  positionCourse?: number;
  result?: number;
  ofa?: StudentResult_OfaMap;
  sectionsResults?: StudentResult_SectionsResultsMap;
};

// key = ofa id
export type StudentResult_OfaMap = CustomMap<string, boolean>;

// key = section name
export type StudentResult_SectionsResultsMap = CustomMap<string, number>;

export default StudentResult;
