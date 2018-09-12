import Base from './base.js'
import fs from 'mz/fs'

export default class extends Base {
  constructor(ctx) {
    super(ctx)
    this.uploadPath = think.ROOT_PATH + '/uploadFiles'
  }

  __before() {
    return super.__before(true).then(data => {
      return data
    })
  }

  async indexAction() {
    const bomFile = this.file('bomFile')
    const {path, name, size} = bomFile
    const suffix = _.last(_.split(name,  '.'))

    if (size > 1024 * 1024 * 40) {
      return this.fail(-1, '允许上传文件大小在40M以内')
    }

    if (!_.includes(['zip', 'rar', 'xlsx', 'xls'], suffix)) {
      return this.fail(-1, '不合法的文件后缀，仅支持zip、rar、xlsx、xls格式文件')
    }

    // todo: add user info
    let uuid = think.uuid(`userUuid_${Date.now()}`)
    uuid = `${uuid}_${name}`

    think.mkdir(this.uploadPath)

    var readStream = fs.createReadStream(path)
    var writeStream = fs.createWriteStream(`${this.uploadPath}/${uuid}`)
    readStream.pipe(writeStream)

    // await fs.rename(path, `${this.uploadPath}/${uuid}`)

    return this.success({
      ..._.pick(bomFile, ['name', 'size']),
      uuid
    })
  }

  async downloadAction() {
    const uuid = this.get('uuid')
    const path = `${this.uploadPath}/${uuid}`

    this.ctx.set('content-disposition', `attachment;filename=${encodeURIComponent(_.last(_.split(uuid, '_')))}`)

    try {
      const file = await fs.readFile(path)
      return this.body = file
    } catch (err) {
      return this.body = 'no such file'
    }
  }

  async createEnquireAction() {
    const postParams = this.post()

    postParams.user_id = this.user.uid
    postParams.order_no = this.model('nonstandard_enquire').getOrderid(this.user.uid)
    postParams.goods_id = parseInt(postParams.goods_id)

    await this.model('nonstandard_enquire').add(postParams)

    return this.success()
  }
}
