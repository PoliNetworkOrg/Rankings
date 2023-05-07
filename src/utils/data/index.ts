// get data from original website
// Array.from(document.querySelectorAll("tbody tr").values()).slice(4).map(v => Array.from(v.childNodes).slice(1).map(c => c.innerText))

import ing1 from "./ing1"
import ingGlob from "./ing_glob"
import archGlob from "./arch_glob"

const ing2 = [
  [1, "29/10/2002", "Yes", 98.0, 10.0, 65.0, 15.0, 10.0, 30, "No", "No"],
  [2, "07/05/2003", "Yes", 92.89, 10.0, 62.89, 15.0, 10.0, 30, "No", "No"],
  [3, "31/03/2003", "Yes", 83.24, 9.17, 65.0, 15.0, 8.07, 28, "No", "No"],
  [4, "13/02/2002", "Yes", 73.33, 9.58, 61.75, 15.0, 10.0, 29, "No", "No"]
]

export const DATA = [
  {
    school: "Ingegneria",
    years: [2022, 2021].map(y => ({
      year: y,
      global: ingGlob,
      phases: [
        {
          phase: "Prima di Seconda",
          courses: [
            {
              name: "Gestionale",
              table: ing1
            },
            {
              name: "Matematica",
              table: ing2
            }
          ]
        },
        {
          phase: "Seconda di Seconda",
          courses: [
            {
              name: "Matematica",
              table: ing1
            }
          ]
        }
      ]
    }))
  },
  {
    school: "Architettura",
    years: [
      {
        year: 2022,
        global: archGlob,
        phases: [
          {
            phase: "Fkas",
            courses: [
              {
                name: "Fuck",
                table: [[]]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    school: "Design",
    years: []
  },
  {
    school: "Urbanistica",
    years: []
  }
]
