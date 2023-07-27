type ofa = {
  [name: string]: boolean;
};

type sectionResults = {
  [name: string]: number;
};

type JsonStudentResult = {
  birthDate?: string;
  canEnroll?: boolean;
  canEnrollInto?: string;
  englishCorrectAnswers?: number;
  id?: string;
  positionAbsolute?: number;
  positionCourse?: number;
  result?: number;
  ofa?: ofa;
  sectionsResults?: sectionResults;
};

export default JsonStudentResult;
