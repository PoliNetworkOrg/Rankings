import CustomMap from "../../../../CustomMap";

type StudentResult = {
  birthDate?: string;
  enroll: Enroll;
  englishCorrectAnswers?: number;
  id?: string;
  positionAbsolute?: number;
  positionCourse?: number;
  result?: number;
  ofa?: StudentResult_OfaMap;
  sectionsResults?: StudentResult_SectionsResultsMap;
};

export type Enroll = {
  allowed: boolean;
  status?: string;
  course?: string;
};

// key = ofa id
export type StudentResult_OfaMap = CustomMap<string, boolean>;

// key = section name
export type StudentResult_SectionsResultsMap = CustomMap<string, number>;

export default StudentResult;
