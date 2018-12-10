
// Bibilioteca pra fazer qurequisições diretamente do backend
const request = require('request');
// caracteres utf-8
iconv  = require('iconv-lite');
// faz com que seja possivel trabalhar com jquery no backend
const cheerio = require('cheerio');

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('crawler/index', {
        title: 'WebCrwler',
        msg: 'Welcome to webCrawler'
    })
});

router.post('/', (req, res) => {
    console.log('fdx');
    if(!req.body.nome) {
        console.log('erro 1');
        return res.redirect('/');
    }

    let requestOptions  = { encoding: null, method: "GET", uri: "https://sigarra.up.pt/feup/pt/noticias_geral.eventos?p_g_eventos=0"};

    request(requestOptions, (err, response, body) =>{
        if(err || response.statusCode != 200){
            console.log('erro 2');
            return res.redirect('/');
        }

        // jquery
        let $ = cheerio.load(iconv.decode(new Buffer(body), "ISO-8859-1")); // Faz  o load de toda a página da requisição e guarda em html na variavel
        let data = [];

        $('.topo li').each((key, element) => {
            // sempre que encontrar um novo elemento ".top li"
            let date = $(element).find('b').text();
            let header = $(element).find('a').text();
            let link = $(element).find('a').attr('href');            
            
            // Go to link to get all necessary info
            request(requestOptions, (err, response, body) =>{

            }


            data.push({
                date, header, link
            })
        });

        // Guardar os dados na sessão para passar para a pagina de /result
        req.session.result_data = data;
        return res.redirect('/result');

    });  
});

router.get('/result', (req, res) => {
    let result = req.session.result_data

	req.session.result_data = []

    return res.status(200).render('crawler/result', {
            data: result,            
    });
});

module.exports = router;