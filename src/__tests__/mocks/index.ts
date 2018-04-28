import * as fs from "fs"
import { join } from "path"

export default {
  templateSheet: JSON.parse(
    fs.readFileSync(join(__dirname, "./template_sheet.json")).toString()
  )
}
