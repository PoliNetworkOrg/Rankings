import CustomMap from "../../../../CustomMap";

type StudentResult = {
  birthDate?: string;
  englishCorrectAnswers?: number;
  matricolaHash?: string;
  positionAbsolute?: number;
  positionCourse?: number;
  result?: number;
  ofa?: StudentResult_OfaMap;
  sectionsResults?: StudentResult_SectionsResultsMap;
  enrollAllowed: boolean;
  enrollStatus?: string;
  enrollCourse?: string;
};

// key = ofa id
export type StudentResult_OfaMap = CustomMap<string, boolean>;

// key = section name
export type StudentResult_SectionsResultsMap = CustomMap<string, number>;

export default StudentResult;
