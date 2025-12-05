import { NewRanking } from "@/utils/types/data/json/new-ranking";

export const testRanking: NewRanking = {
  id: "2025_20096_5ea0_html",
  school: "Ingegneria",
  year: 2025,
  phase: {
    raw: "Prima Graduatoria Di Quarta Fase",
    stripped: "Prima Graduatoria Di Quarta Fase",
    primary: 4,
    secondary: 1,
    language: "IT",
    isExtraEu: false,
  },
  rows: [
    {
      id: "TJ4152",
      birthDate: "31/07/2000",
      position: 1,
      canEnroll: true,
      courses: [
        {
          title: "INGEGNERIA DEI MATERIALI E DELLE NANOTECNOLOGIE",
          location: "MILANO LEONARDO",
          position: 1,
          canEnroll: true,
        },
      ],
      result: 95,
      englishResult: 28,
      sectionsResults: {
        "Comprensione Verbale": 12.76,
        "Fisica": 8.07,
        "Inglese": 9.17,
        "Matematica": 65,
      },
      ofa: {
        ENG: false,
      },
    },
  ],
};
