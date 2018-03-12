import Base from './base.js'
import SMSClient from '@alicloud/sms-sdk'


export default class extends Base {

   __before() {
    return super.__before(false).then(data => {
      return data
    })
  }
  /**
   * index action
   * 获取短信验证码
   * @return {Promise} []
   */
  async sendAction() {
    console.log('start sms')
    const { mobile } = this.post()
    const accessKeyId = 'LTAI8O6FP2MA2NPR'
    const secretAccessKey = '8nQNh3LNQaZxKcfp9J4jDIKJOk0Y2R'
    //初始化sms_client
    let smsClient = new SMSClient({accessKeyId, secretAccessKey})
    const code = this.mathRand()
    //发送短信
    const result = await smsClient.sendSMS({
        PhoneNumbers: mobile,
        SignName: '昊天娱乐',
        TemplateCode: 'SMS_126645138',
        TemplateParam: `{"code":${code}}`
    })
    let { Code } = result
    if (Code === 'OK') {
        //处理返回参数
      console.log('=====sms result',result)
      const codeObj = {
        code: code,
        sendTime: moment()
      }
      this.session('codeObj', codeObj)
      return this.success({msg:'发送成功',code: 0})
    } else {
      return this.fail({msg:'发送失败'})
    }
  }
  /**
   * index action
   * 验证短信验证码
   * @return {Promise} []
   */
  async validateAction(param) {
    const code = param
    if (!code) {
      return { msg: '验证码输入不正确', code: 304}
    }
    const codeObj = this.session('codeObj')
    console.log("==========sms validate", code, codeObj.code)
    const valTime = moment().diff(codeObj.sendTime, 'seconds')
    if (valTime > 300) {
      return { msg: '验证码已经超时，请重新发送', code: 303 }
    } 
    if (code === codeObj.code) {
      return {msg:'验证成功',code: 0}
    } else {
      return { msg: '验证码输入不正确', code: 304}
    }
  }

  mathRand () {
    let Num="";
    for(var i=0; i<6; i++) { 
      Num += Math.floor(Math.random()*10); 
    }
    return Num
  }
}
