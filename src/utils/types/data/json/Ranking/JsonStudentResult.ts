export type JsonEnrollType = {
  canEnroll: boolean;
  course?: string;
  type?: string;
};

type JsonStudentResult = {
  birthDate?: string;
  enrollType?: JsonEnrollType;
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
