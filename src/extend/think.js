/**
 * Created by arter on 2017/7/9.
 */
const lodash = require("lodash");
const path = require('path');
const moment = require('moment');
module.exports = {
  _: lodash,
  moment: moment,
  resource: path.join(think.ROOT_PATH, 'www')
}