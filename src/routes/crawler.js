
// Bibilioteca pra fazer qurequisições diretamente do backend
const request = require('request');
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
    if(!req.body.nome) {
        return res.redirect('/');
    }

    let name = req.body.nome;


    request('https://sigarra.up.pt/feup/pt/noticias_geral.eventos?p_g_eventos=0', (err, response, body) =>{
        if(err || response.statusCode != 200){
            return res.redirect('/');
        }

        // jquery
        let $ = cheerio.load(body); // Faz  o load de toda a página da requisição e guarda em html na variavel
        let data = [];

        $('.topo li').each((key, element) => {
            // sempre que encontrar um novo elemento ".top li"
            let date = $(element).find('b').text();
            let header = $(element).find('a').text();
            let link = $(element).find('a').attr('href');

            data.push({
                date, header, link
            })
        });

        let resp = {
            teste: data,
            nome: name,
        };

        if(!data.length){
            return res.redirect('/');
        }

        //Guardar os dados na sessão para pasar para a pagina de /result
        req.session.result_data = data;
        req.session.name = name;        

        return res.redirect('/result');

    });  
});

router.get('/result', (req, res) => {

    let result = req.session.result_data
    let name = req.session.name    

	req.session.result_data = []
	req.session.name = ""


    return res.status(200).render('crawler/result', {
            data: req.session.result_data,
            name: req.session.name,
            
    });
});

module.exports = router;