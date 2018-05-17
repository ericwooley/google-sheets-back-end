import { ISchema } from "../../interfaces"
const wineEntity: ISchema = {
  wine: {
    id: {
      type: "string",
      validate: (value: string) => ""
    },

    name: {
      type: "string",
      validate: (value: string) => ""
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
