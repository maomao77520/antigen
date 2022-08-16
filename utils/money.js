export function changeNum(number) {
  // //如果用户第一位输入的是小数点，则重置输入框内容
  if (number != '' && number.substr(0, 1) == '.') {
	number = "";
  }
  number = number.replace(/^0*(0\.|[1-9])/, '$1');//粘贴不生效
  number = number.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
  number = number.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
  number = number.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  number = number.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
  if (number.indexOf(".") < 0 && number != "") {//以上已经过滤，若无小数点，首位不能为类似于 01、02的金额
	if (number.substr(0, 1) == '0' && number.length == 2) {
	  number = number.substr(1, number.length);
	}
  }
  return number
}