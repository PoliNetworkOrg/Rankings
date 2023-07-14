import JsonMeritTable from "./JsonMeritTable";

type JsonCourseTable = JsonMeritTable & {
  title: string;
  location?: string;
  sections: string[];
};

export default JsonCourseTable;
