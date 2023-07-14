import CustomMap from "../CustomMap";
import JsonIndexBySchoolYear from "../types/data/json/Index/JsonIndexBySchoolYear";
import JsonIndexBySchoolYearCourse from "../types/data/json/Index/JsonIndexBySchoolYearCourse";
import JsonIndexByYearSchool from "../types/data/json/Index/JsonIndexByYearSchool";
import JsonRanking from "../types/data/json/Ranking/JsonRanking";
import JsonRankingSummary, {
  JsonCourseSummary,
  JsonResultsSummary,
} from "../types/data/json/Ranking/JsonRankingSummary";
import JsonStudentResult from "../types/data/json/Ranking/JsonStudentResult";
import JsonStatsByYear from "../types/data/json/Stats/JsonStatsByYear";
import {
  IndexBySchoolYear,
  IndexBySchoolYear_SchoolsMap,
  IndexBySchoolYear_YearsMap,
} from "../types/data/parsed/Index/IndexBySchoolYear";
import {
  IndexBySchoolYearCourse,
  IndexBySchoolYearCourse_CoursesMap,
  IndexBySchoolYearCourse_LocationsMap,
  IndexBySchoolYearCourse_SchoolsMap,
  IndexBySchoolYearCourse_YearsMap,
} from "../types/data/parsed/Index/IndexBySchoolYearCourse";
import {
  IndexByYearSchool,
  IndexByYearSchool_SchoolsMap,
  IndexByYearSchool_YearsMap,
} from "../types/data/parsed/Index/IndexByYearSchool";
import Ranking from "../types/data/parsed/Ranking";
import RankingSummary, {
  AveragePartialScoresMap,
  CourseSummary,
  HowManyOfaMap,
  ResultsSummary,
} from "../types/data/parsed/Ranking/RankingSummary";
import StudentResult, {
  StudentResult_OfaMap,
  StudentResult_SectionsResultsMap,
} from "../types/data/parsed/Ranking/StudentResult";
import School from "../types/data/School";
import StatsByYear, {
  SchoolStats,
  StatsBySchoolMap,
} from "../types/data/parsed/Stats";
import JsonCourseStats from "../types/data/json/Stats/JsonCourseStats";
import CourseStats from "../types/data/parsed/Stats/CourseStats";

export default class JsonParser {
  public static parseIndexBySchoolYear(
    json: JsonIndexBySchoolYear,
  ): IndexBySchoolYear {
    const schoolMap: IndexBySchoolYear_SchoolsMap = new CustomMap();

    Object.entries(json.schools).map(([school, years]) => {
      const yearsMap: IndexBySchoolYear_YearsMap = new CustomMap();
      Object.entries(years).map(([year, files]) => {
        yearsMap.set(parseInt(year), files);
      });
      schoolMap.set(school as School, yearsMap);
    });

    const indexBySchool: IndexBySchoolYear = {
      schools: schoolMap,
    };

    return indexBySchool;
  }

  public static parseIndexBySchoolYearCourse(
    json: JsonIndexBySchoolYearCourse,
  ): IndexBySchoolYearCourse {
    const schoolMap: IndexBySchoolYearCourse_SchoolsMap = new CustomMap();
    Object.entries(json.schools).map(([school, years]) => {
      const yearsMap: IndexBySchoolYearCourse_YearsMap = new CustomMap();

      Object.entries(years).map(([year, courses]) => {
        const coursesMap: IndexBySchoolYearCourse_CoursesMap = new CustomMap();

        Object.entries(courses).map(([course, locations]) => {
          const locationsMap: IndexBySchoolYearCourse_LocationsMap =
            new CustomMap();

          Object.entries(locations).map(([location, files]) => {
            locationsMap.set(location, files);
          });

          coursesMap.set(course, locationsMap);
        });
        yearsMap.set(parseInt(year), coursesMap);
      });
      schoolMap.set(school as School, yearsMap);
    });

    const indexBySchoolYearCourse: IndexBySchoolYearCourse = {
      schools: schoolMap,
    };

    return indexBySchoolYearCourse;
  }

  public static parseIndexByYearSchool(
    json: JsonIndexByYearSchool,
  ): IndexByYearSchool {
    const yearsMap: IndexByYearSchool_YearsMap = new CustomMap();
    Object.entries(json.years).map(([year, schools]) => {
      const schoolMap: IndexByYearSchool_SchoolsMap = new CustomMap();

      Object.entries(schools).map(([school, files]) => {
        schoolMap.set(school as School, files);
      });
      yearsMap.set(parseInt(year), schoolMap);
    });

    const indexByYearSchool: IndexByYearSchool = {
      years: yearsMap,
    };

    return indexByYearSchool;
  }

  private static parseStudentResult(json: JsonStudentResult): StudentResult {
    const { ofa, sectionsResults, ...rowBase } = json;
    const ofaMap: StudentResult_OfaMap = new CustomMap();
    if (ofa)
      for (const [name, value] of Object.entries(ofa)) {
        ofaMap.set(name, value);
      }

    const sectionsResultsMap: StudentResult_SectionsResultsMap =
      new CustomMap();
    if (sectionsResults)
      for (const [name, value] of Object.entries(sectionsResults)) {
        sectionsResultsMap.set(name, value);
      }

    return {
      ...rowBase,
      ofa: ofaMap.size > 0 ? ofaMap : undefined,
      sectionsResults:
        sectionsResultsMap.size > 0 ? sectionsResultsMap : undefined,
    };
  }

  private static parseCourseSummary(json: JsonCourseSummary): CourseSummary {
    const { howManyOfa, averagePartialScores, ...base } = json;
    const howManyOfaMap: HowManyOfaMap = new CustomMap();
    if (howManyOfa)
      for (const [ofa, num] of Object.entries(howManyOfa)) {
        howManyOfaMap.set(ofa, num);
      }

    const averagePartialScoresMap: AveragePartialScoresMap = new CustomMap();
    if (averagePartialScores)
      for (const [section, score] of Object.entries(averagePartialScores)) {
        howManyOfaMap.set(section, score);
      }

    const c: CourseSummary = {
      ...base,
      howManyOfa: howManyOfaMap,
      averagePartialScores: averagePartialScoresMap,
    };
    return c;
  }

  private static parseResultsSummary(json: JsonResultsSummary): ResultsSummary {
    const map: ResultsSummary = new CustomMap();
    for (const [score, num] of Object.entries(json)) {
      map.set(parseInt(score), num);
    }

    return map;
  }

  private static parseRankingSummary(json: JsonRankingSummary): RankingSummary {
    const { courseSummarized, resultsSummarized, ...base } = json;
    const rankingSummary: RankingSummary = {
      ...base,
      courseSummarized: courseSummarized.map((cs) =>
        this.parseCourseSummary(cs),
      ),
      resultsSummarized: this.parseResultsSummary(resultsSummarized),
    };

    return rankingSummary;
  }

  public static parseRanking(json: JsonRanking): Ranking {
    const { byMerit, byCourse, rankingSummary, ...base } = json;
    const ranking: Ranking = {
      ...base,
      byMerit: {
        headers: byMerit.headers,
        rows: byMerit.rows.map((row) => this.parseStudentResult(row)),
      },

      byCourse: byCourse.map((course) => ({
        title: course.title,
        location: course.location,
        sections: course.sections,
        headers: course.headers,
        rows: course.rows.map((row) => this.parseStudentResult(row)),
      })),

      rankingSummary: this.parseRankingSummary(rankingSummary),
    };

    return ranking;
  }

  private static parseCourseStats(json: JsonCourseStats): CourseStats {
    const courseStats: CourseStats = {
      stats: this.parseRankingSummary(json.stats),
      singleCourseJson: json.singleCourseJson,
    };

    return courseStats;
  }

  public static parseStatsByYear(json: JsonStatsByYear): StatsByYear {
    const schoolsMap: StatsBySchoolMap = new CustomMap();

    for (const [school, stats] of Object.entries(json.schools)) {
      const schoolStats: SchoolStats = {
        numStudents: stats.numStudents,
        list: stats.list.map((cs) => this.parseCourseStats(cs)),
      };
      schoolsMap.set(school as School, schoolStats);
    }

    const statsByYear: StatsByYear = {
      numStudents: json.numStudents,
      schools: schoolsMap,
    };

    return statsByYear;
  }
}
