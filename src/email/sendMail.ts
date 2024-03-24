import * as mail from 'nodemailer';

const mail_transporter = mail.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true, // true for 465, false for other ports
  type:"oauth2",
  auth: {
    user: 'z4032@yandex.ru',
    pass: 'vggadypmujytiiil'
  }
});

type SendMailInput = {from:string,to:string, subject:string, text:string};
export const sendMail=(option:SendMailInput)=>{
  return new Promise<boolean>((res,rej)=>{
    mail_transporter.sendMail(option, (error, info) => {
      if (error) {
        console.log(error);
        res(false);
      } else {
        console.log(info)
        res(true);
      }
    });
  })
}
//  sendMail({from:'z4032@yandex.ru', to:'greemayy@gmail.com', subject:"Код для аунтификации", text:"Ваш код 000000"})
//     .then(status=>console.log(status))