import { Model, WhereOptions } from 'sequelize'
import * as models from '../models/pgModels'
import { DBController, Models, IOptions, removeOptions } from '../types/types'

interface IGetOptions {
  where?: WhereOptions<any>
  include?: Array<object>
}

const getModelByName = (name: string) => Object.values(models).find(model => model.getTableName() === name)

const getIncludeModels = (modelNames: string[]): IGetOptions[] => {
  return modelNames.reduce((acc, i) => {
    acc.push({model: getModelByName(i)})
    return acc
  }, [])
}


class PgController implements DBController {

  async getAll(modelName: Models, options?:object, includeOptions?: string[]) {
    
    const model = getModelByName(modelName)
    let getOptions: IGetOptions | undefined = {}
    if (options) getOptions.where = {...options}
    if (includeOptions) getOptions.include = [...getIncludeModels(includeOptions)]

    return model.findAndCountAll(getOptions)
  }
  async create(modelName: Models, data: Record<string, unknown>) {
    const model = getModelByName(modelName)
    return model.create(data)
  }
  async remove(modelName: Models, options:removeOptions) {
    const model = getModelByName(modelName)
    return model.destroy({where: {[options.field]: options.value}})
  }
  async find(modelName: Models, options: IOptions, includeOptions?: string[]) {
    const model = getModelByName(modelName)

    let getOptions: IGetOptions | undefined = {}
    if (options) getOptions.where = {...options}
    if (includeOptions) getOptions.include = [...getIncludeModels(includeOptions)]
    return model.findOne(getOptions)
  }
  async update(localModel: Model, options: IOptions) {
    return localModel.update({...options})
  }

  async getAttrs(modelName: Models) {
    const model = getModelByName(modelName)
    return model.getAttributes()
  }
}

export default new PgController()