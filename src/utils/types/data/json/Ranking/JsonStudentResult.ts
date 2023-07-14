type JsonStudentResult = {
  birthDate?: string;
  canEnroll?: boolean;
  canEnrollInto?: string;
  englishCorrectAnswers?: number;
  id?: string;
  positionAbsolute?: number;
  positionCourse?: number;
  result?: number;
  ofa?: {
    [name: string]: boolean;
  };
  sectionsResults?: {
    [name: string]: number;
  };
};

export default JsonStudentResult;
