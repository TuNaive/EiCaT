global.encryptPassword = (password, md5encoded) => {
  md5encoded = md5encoded || false;
  password = md5encoded ? password : think.md5(password);
  return think.md5(think.md5('www.cmswing.com') + password + think.md5('Arterli'));
}
