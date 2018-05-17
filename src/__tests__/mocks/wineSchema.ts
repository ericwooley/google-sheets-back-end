import { ISchema } from "../../interfaces"
const wineEntity: ISchema = {
  wine: {
    id: {
      type: "string",
      validate: (value: string) => ""
    },

    name: {
      type: "string",
      validate: (value: string) => {
        console.log("testing name", value)
        if (!value) {
          return "Name is required"
        }
        return ""
      }
    },
    vintage: {
      type: "string",
      validate: (value: string) => ""
    },
    producer: {
      type: "string",
      validate: (value: string) => ""
    },
    vineyardDesignate: {
      type: "string",
      validate: (value: string) => ""
    },
    subAppellation: {
      type: "string",
      validate: (value: string) => ""
    },
    drinkBefore: {
      type: "string",
      validate: (value: string) => ""
    },
    drinkAfter: {
      type: "string",
      validate: (value: string) => ""
    },
    drinkDate: {
      type: "string",
      validate: (value: string) => ""
    },
    cellar: {
      type: "reference",
      validate: (value: string) => "",
      entity: "cellar"
    }
  },
  cellar: {
    id: {
      type: "string",
      validate: (value: string) => ""
    },
    name: {
      type: "string",
      validate: (value: string) => ""
    }
  }
}
export default wineEntity
