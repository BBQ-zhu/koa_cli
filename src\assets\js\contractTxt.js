
//合同文档
function contractTxt(ruleForm,vipUser) {
  let modeA = `<p style="text-indent: 28px; line-height: 1.5em;"><span style=";font-family:宋体">1、按实际贷款金额的 <span class="fw600"> <strong>${ruleForm.ratio || 'XXXX'}%</strong></span> 收取服务费；</span></p>`
  let modeB =`<p style="text-indent: 28px; line-height: 1.5em;"><span style=";font-family:宋体">1、按固定金额收取：<span class="fw600"> <strong>${ruleForm.service || 'XXXX'}</strong></span> 元，大写：<span class="fw600"> <strong>${digitUppercase(ruleForm.service)}</strong></span> 作为服务费。</span></p>`


  let Txt = `<p style="text-align: center; text-indent: 8px; line-height: 1.5em;"><span class="fw600"> <strong><span style="font-size:19px;line-height:150%;font-family:宋体">金融服务协议</span></strong></span></p><p style="text-indent: 6px; line-height: 1.5em;"><span class="fw600"> <strong style="text-indent: 28px;"><span style=";line-height:150%;font-family:宋体">委托方(以下简称甲方)：${ruleForm.name || 'XXXX'}</span></strong></span></p><p style="text-indent: 6px; line-height: 1.5em;"><span class="fw600"> <strong style="text-indent: 28px;"><span style=";line-height:150%;font-family:宋体">身份证号码：${vipUser.idcard || 'XXXX'}</span></strong></span></p><p style="text-indent: 6px; line-height: 1.5em;"><span class="fw600"> <strong style="text-indent: 28px;"><span style=";line-height:150%;font-family:宋体">联系电话：</span></strong></span><span style="text-decoration: none;"><span class="fw600"> <strong style="text-indent: 28px;"><span style="text-decoration: none; line-height: 150%; font-family: 宋体;">${ruleForm.phone || 'XXXX'}</span></strong></span></span></p><p style="text-indent: 6px; line-height: 1.5em;"><span class="fw600"> <strong style="text-indent: 28px;"><span style=";line-height:150%;font-family:宋体">居住地址：</span></strong></span><span style="text-decoration: none;"><span class="fw600"> <strong style="text-indent: 28px;"><span style="text-decoration: none; line-height: 150%; font-family: 宋体;">${vipUser.domicile || 'XXXX'}</span></strong></span></span><span class="fw600">&nbsp;</span></p><p style="text-indent: 6px; line-height: 1.5em;"><span style="text-decoration: none;"><span class="fw600"> <strong style="text-indent: 28px;"><span style="text-decoration: none; line-height: 150%; font-family: 宋体;"><span class="fw600"> <strong><span style="text-decoration: none; line-height: 24px;">受托方(以下简称乙方)：四川铸力金融服务外包有限公司</span></strong></span></span></strong></span></span></p><p style="text-indent: 6px; line-height: 1.5em;"><span style="text-decoration: none;"><span class="fw600"> <strong style="text-indent: 28px;"><span style="text-decoration: none; line-height: 150%; font-family: 宋体;"><span class="fw600"> <strong><span style="text-decoration: none; line-height: 24px;"><span class="fw600"> <strong><span style="text-decoration: none; line-height: 24px;">服务专员：${ruleForm.manager1 || 'XXXX'}</span></strong></span></span></strong></span></span></strong></span></span></p><p style="text-indent: 6px; line-height: 1.5em;"><span style="text-decoration: none;"><span class="fw600"> <strong style="text-indent: 28px;"><span style="text-decoration: none; line-height: 150%; font-family: 宋体;"><span class="fw600"> <strong><span style="text-decoration: none; line-height: 24px;"><span class="fw600"> <strong><span style="text-decoration: none; line-height: 24px;"><span class="fw600"> <strong><span style="text-decoration: none; line-height: 24px;">联系电话：0816-2328899</span></strong></span></span></strong></span></span></strong></span></span></strong></span></span></p><p style="text-indent: 6px; line-height: 1.5em;"><span style="text-decoration: none;"><span class="fw600"> <strong style="text-indent: 28px;"><span style="text-decoration: none; line-height: 150%; font-family: 宋体;"><span class="fw600"> <strong><span style="text-decoration: none; line-height: 24px;"><span class="fw600"> <strong><span style="text-decoration: none; line-height: 24px;"><span class="fw600"> <strong><span style="text-decoration: none; line-height: 24px;"><span class="fw600"> <strong><span style="text-decoration: none; line-height: 24px;">单位地址：绵阳市涪城区绵绢路9号</span></strong></span></span></strong></span></span></strong></span></span></strong></span></span></strong></span></span></p><p style="text-indent: 6px; line-height: 1.5em;"><span style="font-family: 宋体; text-indent: 28px;">鉴于：甲方有金融方面的需求；乙方具有多渠道金融产品信息及专业办理团队。因此，甲方希望获得乙方提供金融信息服务，并委托乙方向第三方办理贷款事宜，双方本着自愿、公平、公正和互利互惠的原则，经充分协商后达成一致条款如下：</span></p><p style="text-indent: 6px; line-height: 1.5em;"><span style="font-family: 宋体;">一、服务事项及融资要求</span></p>

  <p style="text-indent: 28px; line-height: 1.5em;"><span style=";font-family:宋体">1、</span><span style=";font-family:宋体;letter-spacing:0">贷款类型：<span class="fw600"> <strong>${ruleForm.loantype || 'XXXX'}</strong></span>，以 <span class="fw600"> <strong>${ruleForm.collateral || 'XXXX'}</strong></span> 为${ruleForm.loantype=='抵押贷款'?'抵押物':'申请物'}，向金融机构申请贷款；</span></p>

  <p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">2、甲方融资要求：人民币&nbsp;<span class="fw600"> <strong>${ruleForm.expenses || 'XXXX'}&nbsp;</strong></span>元（大写：<span class="fw600"> <strong>${digitUppercase(ruleForm.expenses)}</strong></span> 元），实际贷款金额由放款机构审批为准；</span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">3、委托方式为：</span><span class="fw600"> <strong><span style="font-family: 宋体; letter-spacing: 0px; text-decoration: none;"> 独家委托</span></strong></span></p><p style="line-height: 1.5em;"><span style="font-family: 宋体;">二、服务费支付方式</span></p>${ruleForm.mode == '比例收费' ? modeA : modeB}
  <p style="line-height: 1.5em;"><span style=";font-family:宋体">三、贷款服务费收取方式</span></p><p style="text-indent: 28px; line-height: 1.5em;"><span style=";font-family:宋体">1、合同签订时，甲方向乙方支付平台、资料费合计</span><span style="font-family: 宋体; text-decoration: none;"> &nbsp;<span class="fw600"> <strong>100.00</strong></span> &nbsp;</span><span style=";font-family:宋体">元，及委托服务保证金 <span class="fw600"> <strong>${ruleForm.loantype || 'XXXX'}</strong></span></span><span style="text-decoration: none;"><span style="text-decoration: none; font-family: 宋体;">&nbsp;</span></span><span style=";font-family:宋体">收取<span class="fw600"> <strong>${ruleForm.margin || 'XXXX'}</strong></span> 元（大写：<span class="fw600"> <strong>${digitUppercase(ruleForm.margin)}</strong></span> ）；</span></p><p style="text-indent: 28px; line-height: 1.5em;"><span style=";font-family:宋体">2、甲方与第三方签订正式放款合同（协议）并确定放款金额后的当天，甲方必须一次性向乙方支付服务费，结清方式为实际尾款扣除保证金；</span></p><p style="text-indent: 28px; line-height: 1.5em;"><span style=";font-family:宋体">3、如因第三方原因需要增加的其他费用由甲方承担，包括但不限于政策调整、评估费、鉴定费、公证费、担保费等。</span></p><p style="text-indent: 28px; line-height: 1.5em;"><span style=";font-family:宋体">4、委托服务事项在双方积极配合下，最终仍无法达成的，乙方在确定无法达成服务当日，无条件退还甲方缴纳的贷款服务保证金；</span></p><p style=" line-height: 1.5em;"><span style=";font-family:宋体">四、甲方的权利与义务</span></p><p style="text-indent: 28px; line-height: 1.5em;"><span style=";font-family:宋体">1、甲方同意委托乙方办理贷款事宜，并积极协助乙方办理第三方贷款所需的一切资料和要求。甲方对乙方的业务流程，所借款项金额成本率及收费标准等事项熟知并完全认可。</span></p><p style="text-indent: 28px; line-height: 1.5em;"><span style=";font-family:宋体">2、甲方承诺向乙方提供办理第三方贷款事宜所需资料文件真实、合法、有效；甲方提供抵押担保的，应当提供真实有效的物权信息，保证</span><span style=";font-family:宋体;letter-spacing:0">抵押物的权属明确，没有查封、扣押等权利瑕疵，且权利共有人同意并配合办理对该物权的抵押手续。 </span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">3、按时、按要求向乙方支付费用，并按与第三方贷款合同约定承担还款义务。</span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">4、本协议履行期间，未经乙方书面同意，甲方不得与第三方私下协商。</span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">5、</span><span style=";font-family:宋体">甲方可随时向乙方了解所委托事项最新进展；</span></p><p style="line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">五、乙方的权利与义务</span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">1、将委托事项进展的真实情况第一时间向甲方汇报。</span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">2、乙方必须对甲方所提供的资料妥善保管，除办理贷款义务外不得另作他用，且对甲方提供的一切信息（口头及文件）进行保密；</span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">3、乙方在履行本协议的过程中，可以向第三方表明其为甲方的居间服务人，并可以向第三方介绍甲方的相关情况；</span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">4、除本协议约定的费用外，如非特殊原因与甲方协商一致，不得额外增加收费或变更收费方式。</span></p><p style="line-height: 1.5em;"><span style=";font-family:宋体">六、违约责任与解除条件</span></p><p style="text-indent: 28px; line-height: 1.5em;"><span style=";font-family:宋体">1、双方在本协议生效后，任何一方擅自单方面撤销委托则视为违约，如果乙方违约，则双倍退还甲方所缴纳的服务保证金，如甲方违约，则乙方不退还甲方缴纳的服务保证金。</span></p><p style="text-indent: 28px; line-height: 1.5em;"><span style=";font-family:宋体">2、甲方未按照合同约定时效支付乙方服务费，每延迟一日，甲方按贷款额</span><span class="fw600"> <strong><span style="font-family: 宋体; text-decoration: none;">&nbsp; 百分之五&nbsp; </span></strong></span><span style=";font-family:宋体">支付滞纳金，并承担由此对乙方造成的其他经济损失；</span></p><p style="text-indent: 28px; line-height: 1.5em;"><span style=";font-family:宋体">3、乙方成功为甲方完成服务事项，但因甲方拒不配合后续工作，乙方将不予退款甲方所交保证金，并有权按照实际审批金额的<span style="text-decoration:underline;">2%</span>追讨违约金；</span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">4、如因甲方提供虚假资料、不如实告知真实情况或不积极配合乙方及金融机构工作，造成服务事项无法成功，乙方将予以退还甲方所缴纳的服务保证金；</span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">5、委托期间内，因客户通过其他渠道寻求融资，造成乙方无法完成服务的，乙方将不予以退还甲方所缴纳的服务保证金；</span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">6、一方违约的，应承担守约方为实现权利所发生的全部费用（包括但不限于诉讼费、差旅费、律师费、保全费、公证费、评估拍卖费等）。</span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">7、如因不可抗力因素或国家政策调整及甲方原因未能达到第三方贷款条件造成无法成功贷款的，乙方对此不承担违约责任；</span></p><p style="line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">七、争议解决途径</span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">因本协议履行发生争议时，双方应友好协商解决；协商不成，由绵阳仲裁委员会管辖，诉讼期间，除争议事项外，协议继续履行。</span></p><p style="line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">八、送达</span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">本协议双方确认的当事人信息适用于双方往来联系、书面文件送达及争议解决时法律文书送达。一方变更联系信息的，应当在变更后3日内及时书面通知对方当事人，对方当事人实际收到变更通知前的送达仍为有效送达，电子送达与书面送达具有同等法律效力。一方按约定信息送达的，</span><span style=";font-family:宋体">自交邮后第7日视为送达。</span></p><p style="line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">九、其他</span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">1、本协议一式两份，自双方签字或盖章之日起生效，具有同等法律效力；</span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">2、本协议为双方确定委托服务关系的唯一有效文件，其他任何涉及双方委托服务关系的法律性文件与本协议不一致的，以本协议为准；</span></p><p style="text-indent: 29px; line-height: 1.5em;"><span style=";font-family:宋体;letter-spacing:0">3、本尽事宜甲乙双方可协商解决；</span></p><p><br/></p>`


  return Txt
}

//数字转换为大写
function digitUppercase (n) {
  if(!n){
    return 'XXXX'
  }
  var fraction = ['角', '分'];
  var digit = [
      '零', '壹', '贰', '叁', '肆',
      '伍', '陆', '柒', '捌', '玖'
  ];
  var unit = [
      ['元', '万', '亿'],
      ['', '拾', '佰', '仟']
  ];
  var head = n < 0 ? '欠' : '';
  n = Math.abs(n);
  var s = '';
  var index = '';
  for (var i = 0; i < fraction.length; i++) {
      if (n.toString().indexOf('.') > -1) {
          var str = n.toString().split('.')[1]
          var strArr = str.split('');
          if (i == 1) {
              index = strArr[i] ? strArr[i] : 0;
          } else {
              index = Math.floor(n * 10 * Math.pow(10, i)) % 10;
          }
      } else {
          index = Math.floor(n * 10 * Math.pow(10, i)) % 10;
      }
      s += (digit[index] + fraction[i]);
  }
  s = s == '零角零分' ? '整' : s;
  n = Math.floor(n);
  for (var i = 0; i < unit[0].length && n > 0; i++) {
      var p = '';
      for (var j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p;
          n = Math.floor(n / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  var newWord = head + s.replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整');
  if (newWord.charAt(newWord.length - 1) == '零') {
      newWord = newWord.slice(0, newWord.length - 1)
  }
  return newWord
}

module.exports={
  contractTxt
}
