import PagSeguro from 'pagseguro-nodejs';

const pag = new PagSeguro({
    email: process.env.PAGSEGURO_EMAIL,
    token: process.env.PAGSEGURO_TOKEN,
    mode: process.env.PAGSEGURO_MODE, 
    sandBox: process.env.NODE_ENV === "production" ? false : true,
    sandBox_email: process.env.NODE_EN === "production" ? null: "",
    notificationURL: ""
});

